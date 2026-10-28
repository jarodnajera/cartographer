import { createClient, type SupabaseClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
let connection: SupabaseClient | null = null
// Invalid public configuration must not turn the whole UI into a blank page.
if (url && key) {
  try { connection = createClient(url, key, { auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true } }) }
  catch { connection = null }
}
export const configured = connection !== null
export const supabase = connection

// Freeze each request to the token it was authorized with, including during cross-tab account changes.
export function requestClient(token: string): SupabaseClient {
  if (!url || !key) throw new Error('The private workspace connection is not configured.')
  return createClient(url, key, { accessToken: async () => token })
}
