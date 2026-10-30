import { expect, it } from 'vitest'
import { readPublicConfig } from './config'

it('rejects privileged credentials instead of creating a browser client', () => {
  expect(readPublicConfig({ VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_do-not-use' }).status).toBe('invalid')
})

it('accepts the public endpoint/key pair without requiring a privileged key', () => {
  expect(readPublicConfig({ VITE_SUPABASE_URL: 'https://example.supabase.co/', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fixture' })).toEqual({
    status: 'ready', url: 'https://example.supabase.co', key: 'sb_publishable_fixture',
  })
})

it('rejects a legacy service-role JWT and treats absent configuration as unavailable setup', () => {
  const payload = btoa(JSON.stringify({ role: 'service_role' }))
  expect(readPublicConfig({ VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: `header.${payload}.signature` }).status).toBe('invalid')
  expect(readPublicConfig({}).status).toBe('missing')
})
