import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { AccountGateway } from './types'
import type { PublicConfig } from '../lib/config'

export function createSupabaseGateway(config: Extract<PublicConfig, { status: 'ready' }>, origin: string, persistSession = true) {
  const client: SupabaseClient = createClient(config.url, config.key, {
    auth: { flowType: 'pkce', detectSessionInUrl: false, persistSession, autoRefreshToken: persistSession },
  })
  const callback = new URL('/auth/callback', origin).href
  const gateway: AccountGateway = {
    async currentUser() {
      const { data, error } = await client.auth.getUser()
      if (error) {
        if (error.name === 'AuthSessionMissingError' || error.status === 401) return null
        throw error
      }
      const user = data.user
      return user ? { id: user.id, email: user.email ?? '', verified: Boolean(user.email_confirmed_at) } : null
    },
    async workspace() {
      const { data, error } = await client.from('workspaces')
        .select('owner_id,status,timezone,digest_time,email_enabled').maybeSingle()
      if (error) throw error
      if (!data) return null
      return { ownerId: data.owner_id, status: data.status, timezone: data.timezone, digestTime: data.digest_time, emailEnabled: data.email_enabled }
    },
    async signIn(email, password) {
      const { error } = await client.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    async signUp(email, password) {
      const { error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: callback } })
      if (error) throw error
    },
    async signOut() {
      const { error } = await client.auth.signOut({ scope: 'local' })
      if (error) throw error
    },
    async requestRecovery(email, redirectTo) {
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) throw error
    },
    async updatePassword(password) {
      const { error } = await client.auth.updateUser({ password })
      if (error) throw error
    },
    async resendVerification(email, redirectTo) {
      const { error } = await client.auth.resend({ type: 'signup', email, options: { emailRedirectTo: redirectTo } })
      if (error) throw error
    },
    async finishCallback(code) {
      let recovery = false
      const { data: { subscription } } = client.auth.onAuthStateChange(event => {
        if (event === 'PASSWORD_RECOVERY') recovery = true
      })
      try {
        const { error } = await client.auth.exchangeCodeForSession(code)
        if (error) throw error
        return recovery ? 'recovery' : 'verification'
      } finally { subscription.unsubscribe() }
    },
  }
  return { gateway, client }
}
