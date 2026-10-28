import type { Gateway, Snapshot, Entity, Kind } from './types'
import { amountValue, currencies, localDate, sampleAttention, shiftDate } from './domain'
export function sampleGateway(): Gateway {
  const owner_id = 'sample-workspace', day = localDate(new Date(), 'America/Los_Angeles')
  const base = { owner_id, version: 1 }
  let data: Snapshot = {
    clients: [{ ...base, id: 'c1', name: 'Cedar Studio' }, { ...base, id: 'c2', name: 'Atlas Co.' }, { ...base, id: 'c3', name: 'Morrow Press' }],
    projects: [{ ...base, id: 'p1', client_id: 'c1', name: 'Brand & website', status: 'active', deadline: shiftDate(day, 2) }, { ...base, id: 'p2', client_id: 'c2', name: 'Autumn campaign', status: 'active', deadline: shiftDate(day, -1) }, { ...base, id: 'p3', client_id: 'c3', name: 'Editorial identity', status: 'completed', deadline: shiftDate(day, -8) }],
    tasks: [{ ...base, id: 't1', project_id: 'p1', title: 'Follow up on homepage feedback', followup_date: day, completed: false }, { ...base, id: 't2', project_id: 'p2', title: 'Confirm the campaign copy', followup_date: shiftDate(day, -1), completed: false }, { ...base, id: 't3', project_id: 'p3', title: 'Check in on the handoff', followup_date: day, completed: false }],
    invoices: [{ ...base, id: 'i1', project_id: 'p2', client_id: 'c2', reference: 'INV-024', amount: '1800.00', currency: 'USD', currency_digits: 2, due_date: shiftDate(day, -2), paid: false }, { ...base, id: 'i2', project_id: 'p3', client_id: 'c3', reference: 'INV-019', amount: '650.00', currency: 'EUR', currency_digits: 2, due_date: shiftDate(day, -7), paid: false }],
    settings: { owner_id, version: 1, timezone: 'America/Los_Angeles', digest_time: '09:00', email_enabled: false },
  }
  const collection = (kind: Kind) => ({ client: 'clients', project: 'projects', task: 'tasks', invoice: 'invoices' })[kind] as 'clients' | 'projects' | 'tasks' | 'invoices'
  return {
    features: async () => ({digest: false, deletion: true, status: null}),
    async removeAccount(password) { if (password !== 'demo') throw new Error('For the sample, enter demo. Your sample workspace is unchanged.') },
    load: async () => structuredClone(data),
    attention: async () => sampleAttention(data, localDate(new Date(), data.settings.timezone || 'UTC')),
    async save(kind, values, id, version) {
      const draft = structuredClone(data), key = collection(kind), rows = draft[key] as Entity[]
      const old = rows.find(r => r.id === id)
      if (id && (!old || old.version !== version)) throw { code: '40001' }
      const value = { ...values, id: id || crypto.randomUUID(), owner_id, version: (old?.version || 0) + 1 } as unknown as Entity
      if (kind === 'invoice') {
        const invoice = value as Snapshot['invoices'][number], p = draft.projects.find(p => p.id === invoice.project_id)
        if (!p) throw { code: '23503' }
        invoice.amount = amountValue(invoice.amount, invoice.currency); invoice.currency_digits = currencies.find(c => c.code === invoice.currency)!.digits; invoice.client_id = p.client_id
        if (draft.invoices.some(i => i.id !== id && i.client_id === p.client_id && i.reference.trim().toLowerCase() === invoice.reference.trim().toLowerCase())) throw { code: '23505' }
      }
      if (kind === 'project') {
        const p = value as Snapshot['projects'][number]
        if (!draft.clients.some(c => c.id === p.client_id)) throw { code: '23503' }
        for (const i of draft.invoices.filter(i => i.project_id === id)) { i.client_id = p.client_id; i.version++ }
        const keys = draft.invoices.map(i => i.client_id + ':' + i.reference.trim().toLowerCase())
        if (new Set(keys).size !== keys.length) throw { code: '23505' }
      }
      if (kind === 'task' && !draft.projects.some(p => p.id === (value as Snapshot['tasks'][number]).project_id)) throw { code: '23503' }
      if (old) rows.splice(rows.findIndex(r => r.id === id), 1, value); else rows.push(value)
      data = draft
    },
    async remove(kind, id, version) {
      const rows = data[collection(kind)] as Entity[], index = rows.findIndex(r => r.id === id && r.version === version)
      if (index < 0) throw { code: '40001' }
      if (kind === 'client' && data.projects.some(p => p.client_id === id)) throw { code: '23503' }
      if (kind === 'project' && (data.tasks.some(t => t.project_id === id) || data.invoices.some(i => i.project_id === id))) throw { code: '23503' }
      rows.splice(index, 1)
    },
    async settings(timezone, time, enabled, version) {
      if (data.settings.version !== version) throw { code: '40001' }
      localDate(new Date(), timezone)
      if (enabled && !time) throw new Error('Choose a local send time.')
      data.settings = { owner_id, timezone, digest_time: time, email_enabled: enabled, version: version + 1 }
    },
    export: async () => ({ formatVersion: 1, exportedAt: new Date().toISOString(), sample: true, workspace: structuredClone(data) }),
  }
}
