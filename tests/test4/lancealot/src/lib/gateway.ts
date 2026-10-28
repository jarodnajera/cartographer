import type { SupabaseClient } from '@supabase/supabase-js'
import { requestClient } from './supabase'
import type { Gateway, Snapshot, Attention, Kind, Features } from './types'
export function liveGateway(client: SupabaseClient, expectedUserId: string, forToken: (token: string) => SupabaseClient = requestClient): Gateway {
  async function authorized() {
    const { data: { session }, error: sessionError } = await client.auth.getSession()
    if (sessionError || !session) throw { code: '42501' }
    const token = session.access_token
    const { data: identity, error: identityError } = await client.auth.getUser(token)
    if (identityError || identity.user?.id !== expectedUserId) throw { code: '42501' }
    return forToken(token)
  }
  async function rpc<T>(name: string, args?: Record<string, unknown>): Promise<T> {
    const { data, error } = await (await authorized()).rpc(name, args)
    if (error) throw error
    return data as T
  }
  return {
    features: async () => await rpc<Features | null>('feature_status') || {digest: false, deletion: false},
    async removeAccount(password) {
      const client = await authorized()
      const { data, error } = await client.functions.invoke('delete-account', { body: { password, confirm: true } })
      if (error || data?.state !== 'pending') throw new Error('Account removal could not be confirmed. If your account is locked, contact support before retrying.')
    },
    async load() {
      await rpc('bootstrap_workspace')
      const data = await rpc<Snapshot | null>('workspace_snapshot')
      if (!data) throw { code: '42501' }
      return data
    },
    attention: () => rpc<Attention[]>('attention_items'),
    save: (kind: Kind, data, id, version) => rpc('save_record', { p_kind: kind, p_data: data, p_id: id ?? null, p_version: version ?? null }),
    remove: (kind, id, version) => rpc('delete_record', { p_kind: kind, p_id: id, p_version: version }),
    settings: (timezone, time, enabled, version) => rpc('save_settings', { p_timezone: timezone, p_time: time, p_enabled: enabled, p_version: version }),
    export: () => rpc('export_workspace'),
  }
}
