export interface Claim { id: string; token: string }
export interface DeletionClaim extends Claim { owner: string }
export interface DigestItem { kind: 'task' | 'project' | 'invoice'; id: string; title: string; relevant_date: string; project_id: string; project_name: string; client_name: string }
export interface Envelope extends Claim { to: string; date: string; timezone: string; attempt: number; items: DigestItem[] }
export type Outcome = { outcome: 'accepted' | 'temporary' | 'permanent' | 'unknown'; retrySeconds?: number }
export interface JobStore {
  claimDigests(): Promise<Claim[]>
  authorize(claim: Claim): Promise<Envelope | null>
  finishDigest(claim: Claim, result: Outcome): Promise<void>
  claimDeletions(): Promise<DeletionClaim[]>
  purge(claim: DeletionClaim): Promise<boolean>
  deleteIdentity(owner: string): Promise<void>
  finishDeletion(claim: DeletionClaim, success: boolean): Promise<void>
}
export interface MailDriver { send(envelope: Envelope): Promise<Outcome> }
const escapeHtml = (v: string) => v.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
export function digestContent(envelope: Envelope, appUrl: string) {
  const base = new URL(appUrl)
  if (base.username || base.password || (base.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(base.hostname))) throw new Error('APP_URL must use HTTPS.')
  const lines = [`Lancealot — Your follow-ups for ${envelope.date}`, `Dates use ${envelope.timezone}`, '']
  let html = `<h1>Lancealot</h1><p>Your follow-ups for ${escapeHtml(envelope.date)}</p><p>Dates use ${escapeHtml(envelope.timezone)}</p>`
  for (const [kind, title] of [['task', 'Task follow-ups'], ['project', 'Project deadlines'], ['invoice', 'Overdue invoices']] as const) {
    const items = envelope.items.filter(i => i.kind === kind)
    if (!items.length) continue
    lines.push(title)
    html += `<h2>${title}</h2>`
    for (const item of items) {
      const url = new URL('/projects/' + encodeURIComponent(item.project_id), base).href
      lines.push(item.title, `${item.client_name} / ${item.project_name}`, item.relevant_date, url, '')
      html += `<p><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.client_name)} / ${escapeHtml(item.project_name)}<br>${escapeHtml(item.relevant_date)}<br><a href="${escapeHtml(url)}">Open ${item.kind}</a></p>`
    }
  }
  const settings = new URL('/settings', base).href
  lines.push('Reminder settings: ' + settings)
  html += `<p><a href="${escapeHtml(settings)}">Reminder settings</a></p>`
  return { subject: `Your Lancealot follow-ups for ${envelope.date}`, text: lines.join('\n'), html }
}
export async function runJobs(store: JobStore, driver: MailDriver | null) {
  const result = { deleted: 0, cleanupPending: 0, accepted: 0, unknown: 0, skipped: 0 }
  for (const claim of await store.claimDeletions()) {
    try {
      if (!await store.purge(claim)) continue
      await store.deleteIdentity(claim.owner)
      await store.finishDeletion(claim, true); result.deleted++
    } catch {
      await store.finishDeletion(claim, false); result.cleanupPending++
    }
  }
  // No provider selected/configured means no claims, no synthetic successes, and no sending.
  if (!driver) return result
  for (const claim of await store.claimDigests()) {
    const envelope = await store.authorize(claim)
    if (!envelope) { result.skipped++; continue }
    let outcome: Outcome
    try { outcome = await driver.send(envelope) } catch { outcome = { outcome: 'unknown' } }
    await store.finishDigest(claim, outcome)
    if (outcome.outcome === 'accepted') result.accepted++
    if (outcome.outcome === 'unknown') result.unknown++
  }
  return result
}
// Optional adapter, not an approved vendor/paid plan. EMAIL_PROVIDER has no default value.
export function resendDriver(key: string, from: string, appUrl: string, send: typeof fetch = fetch): MailDriver {
  return { async send(envelope) {
    const content = digestContent(envelope, appUrl)
    let response: Response
    try {
      response = await send('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `lancealot/${envelope.id}/${envelope.attempt}` }, body: JSON.stringify({ from, to: [envelope.to], ...content }), signal: AbortSignal.timeout(10000) })
    } catch { return { outcome: 'unknown' } }
    if (response.ok) {
      try { const body = await response.json(); return body && typeof body.id === 'string' ? { outcome: 'accepted' } : { outcome: 'unknown' } } catch { return { outcome: 'unknown' } }
    }
    if (response.status === 429) {
      const header = response.headers.get('retry-after') || '60'
      const delay = /^\d+$/.test(header) ? Number(header) : Math.ceil((Date.parse(header) - Date.now()) / 1000)
      return { outcome: 'temporary', retrySeconds: Number.isFinite(delay) ? Math.max(0, delay) : 60 }
    }
    if ([400, 401, 403, 404, 422].includes(response.status)) return { outcome: 'permanent' }
    // Timeouts, 5xx and idempotency conflicts can hide an accepted request. Never blind-retry.
    return { outcome: 'unknown' }
  } }
}
