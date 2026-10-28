import { reactive } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
export const account = reactive({ initialized: false, user: null as User | null, sample: false, recovery: false, deletionPending: false, deletionSample: false, problem: '' })
let started = false
export async function startAccount() {
  if (started) return
  started = true
  if (!supabase) { account.initialized = true; return }
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') account.recovery = true
    account.user = session?.user ?? null
    if (event === 'SIGNED_IN') account.problem = ''
    if (event === 'SIGNED_OUT') account.recovery = false
  })
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    if (session) { const { data, error } = await supabase.auth.getUser(); if (error) throw error; account.user = data.user }
  } catch { account.problem = 'Your previous session could not be restored. Sign in again.'; account.user = null }
  finally { account.initialized = true }
}
export function enterSample() { account.sample = true; account.problem = '' }
export async function signOut() {
  if (!account.sample && supabase) { const { error } = await supabase.auth.signOut(); if (error) throw error }
  account.user = null; account.sample = false; account.recovery = false; account.problem = ''
}
