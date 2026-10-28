import rawCurrencies from '@/data/currencies.json'
import type { Attention, Snapshot } from './types'
export const currencies = rawCurrencies
export function amountValue(input: string, code: string, savedDigits?: number): string {
  const currency = currencies.find(c => c.code === code)
  if (!currency) throw new Error('Choose a supported currency.')
  const digits = savedDigits ?? currency.digits
  if (!/^\d{1,18}(\.\d{1,8})?$/.test(input.trim()) || !/[1-9]/.test(input)) throw new Error('Enter a positive decimal amount, without an exponent.')
  const [integer = '', fraction = ''] = input.trim().split('.')
  if (fraction.replace(/0+$/, '').length > digits) throw new Error(`${code} supports ${digits} decimal places. The amount has not been rounded.`)
  const whole = integer.replace(/^0+(?=\d)/, '')
  return whole + (digits ? '.' + fraction.slice(0, digits).padEnd(digits, '0') : '')
}
export function localDate(instant = new Date(), timezone = 'UTC'): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(instant)
  const read = (type: string) => parts.find(p => p.type === type)?.value
  return `${read('year')}-${read('month')}-${read('day')}`
}
export function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10)
}
export function dateLabel(date: string | null): string {
  return date ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z')) : 'Not set'
}
export function money(amount: string, code: string): string {
  const [whole = '', fraction] = amount.split('.')
  return `${code} ${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${fraction !== undefined ? '.' + fraction : ''}`
}
// Sample adapter only. The live adapter always calls the shared PostgreSQL eligibility function.
export function sampleAttention(data: Snapshot, date: string): Attention[] {
  const result: Attention[] = []
  const add = (kind: Attention['kind'], id: string, title: string, relevant_date: string, projectId: string) => {
    const p = data.projects.find(p => p.id === projectId), c = data.clients.find(c => c.id === p?.client_id)
    if (p && c) result.push({ kind, id, title, relevant_date, project_id: p.id, project_name: p.name, client_name: c.name, project_status: p.status })
  }
  data.tasks.filter(t => !t.completed && t.followup_date && t.followup_date <= date).forEach(t => add('task', t.id, t.title, t.followup_date!, t.project_id))
  data.projects.filter(p => p.status === 'active' && p.deadline && p.deadline <= shiftDate(date, 3)).forEach(p => add('project', p.id, p.name, p.deadline!, p.id))
  data.invoices.filter(i => !i.paid && i.due_date < date).forEach(i => add('invoice', i.id, i.reference, i.due_date, i.project_id))
  return result.sort((a, b) => a.relevant_date.localeCompare(b.relevant_date) || a.title.localeCompare(b.title))
}
export function describeError(error: unknown): string {
  const e = error as { code?: string; message?: string }
  if (e.code === '23505') return 'This reference is already used for this client. Choose another reference.'
  if (e.code === '23503') return 'This record has linked records, or the selected parent is unavailable. Keep the linked records or choose an available parent.'
  if (e.code === '40001') return 'This record changed since you opened it. Your input is kept; close this form, refresh and try again.'
  if (e.code === '42501') return 'Your workspace is unavailable. Sign in again or contact support.'
  if (e.code === '23514' || e.code === '23502') return 'Check required fields, dates and amount precision before saving.'
  return e.message || 'The change could not be saved. Check your connection and try again.'
}
