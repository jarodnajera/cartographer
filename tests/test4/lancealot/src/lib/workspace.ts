import { reactive } from 'vue'
import type { Gateway, Snapshot, Attention, Kind, Entity, Features } from './types'
import { describeError } from './domain'
export const workspace = reactive({ data: null as Snapshot | null, attention: [] as Attention[], loading: false, problem: '', notice: '', stale: false, features: {digest: false, deletion: false} as Features })
let gateway: Gateway | null = null, generation = 0
export function connectWorkspace(value: Gateway | null) { generation++; gateway = value; workspace.data = null; workspace.attention = []; workspace.problem = ''; workspace.notice = ''; workspace.stale = false; workspace.loading = false; workspace.features = {digest: false, deletion: false} }
export async function refresh() {
  const api = gateway, ticket = generation
  if (!api) return
  workspace.loading = true; workspace.problem = ''
  try {
    const [data, attention, features] = await Promise.all([api.load(), api.attention(), api.features()])
    if (ticket !== generation) return
    workspace.data = data; workspace.attention = attention; workspace.features = features; workspace.stale = false
  } catch (e) { if (ticket === generation) { workspace.problem = describeError(e); if ((e as {code?: string}).code === '42501') { workspace.data = null; workspace.attention = [] }; workspace.stale = Boolean(workspace.data) } }
  finally { if (ticket === generation) workspace.loading = false }
}
export async function save(kind: Kind, data: Record<string, unknown>, record?: Entity) {
  const api = gateway, ticket = generation
  if (!api) throw new Error('Sign in before saving.')
  await api.save(kind, data, record?.id, record?.version)
  if (ticket !== generation) throw new Error('Your session changed. Reopen the form in the current workspace.')
  await refresh(); workspace.notice = 'Changes saved.'
}
export async function remove(kind: Kind, record: Entity) {
  const api = gateway, ticket = generation
  if (!api) throw new Error('Sign in before deleting.')
  await api.remove(kind, record.id, record.version)
  if (ticket !== generation) return
  await refresh(); workspace.notice = 'Record deleted.'
}
export async function saveSettings(zone: string, time: string | null, enabled: boolean) {
  if (!gateway || !workspace.data) throw new Error('Load your workspace first.')
  const api = gateway, ticket = generation
  await api.settings(zone, time, enabled, workspace.data.settings.version)
  if (ticket !== generation) return
  await refresh(); workspace.notice = 'Reminder settings saved.'
}
export async function exportData() {
  const api = gateway, ticket = generation
  if (!api) throw new Error('Sign in to export.')
  const value = await api.export()
  if (ticket !== generation || !value) throw new Error('Your session changed or your workspace is unavailable.')
  return value
}

export async function removeAccount(password: string) {
  const api = gateway, ticket = generation
  if (!api || !workspace.features.deletion) throw new Error('Account removal is not available yet.')
  await api.removeAccount(password)
  if (ticket !== generation) throw new Error('Your session changed. Check account status before retrying.')
}
