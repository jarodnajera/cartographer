import { ref } from 'vue'
import { readPublicConfig } from '../lib/config'
import { createSupabaseGateway } from './supabase-gateway'
import { createAccountService } from './service'
import type { Access } from './types'

export const publicConfig = readPublicConfig(import.meta.env)
const isolatedPreview = import.meta.env.DEV && window.location.pathname.replace(/\/+$/, '') === '/__preview'
export const connection = publicConfig.status === 'ready' && !isolatedPreview
  ? createSupabaseGateway(publicConfig, window.location.origin) : null
export const accounts = connection ? createAccountService(connection.gateway) : null
export const accessState = ref<Access>({ status: 'anonymous' })
export const recoveryReady = ref(false)
export const callbackUrl = new URL('/auth/callback', window.location.origin).href

export async function refreshAccess(): Promise<Access> {
  const result: Access = accounts ? await accounts.access() : { status: 'unavailable' }
  accessState.value = result
  return result
}
