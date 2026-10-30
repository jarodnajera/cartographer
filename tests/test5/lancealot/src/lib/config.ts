export type PublicConfig = { status: 'ready'; url: string; key: string } | { status: 'missing' | 'invalid' }

/** Configuration is public. This rejects known privileged keys; Supabase still validates the key. */
export function readPublicConfig(env: Record<string, unknown>): PublicConfig {
  const url = String(env.VITE_SUPABASE_URL ?? '').trim()
  const key = String(env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim()
  if (!url || !key) return { status: 'missing' }
  try {
    const parsed = new URL(url)
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)
    if (parsed.username || parsed.password || (parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:'))) return { status: 'invalid' }
    let publicKey = /^sb_publishable_[A-Za-z0-9_-]+$/.test(key)
    if (!publicKey && key.split('.').length === 3) {
      const payload = key.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')
      publicKey = JSON.parse(atob(payload)).role === 'anon'
    }
    if (!publicKey) return { status: 'invalid' }
    return { status: 'ready', url: url.replace(/\/$/, ''), key }
  } catch {
    return { status: 'invalid' }
  }
}
