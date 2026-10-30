import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createSupabaseGateway } from '../../src/accounts/supabase-gateway'
import { createAccountService } from '../../src/accounts/service'
import { readPublicConfig } from '../../src/lib/config'

const enabled = process.env.RUN_SUPABASE_INTEGRATION === '1'
type Connection = ReturnType<typeof createSupabaseGateway>
let a: Connection, b: Connection
let ownerA: string, ownerB: string

describe.skipIf(!enabled)('real Supabase private-workspace isolation', () => {
  beforeAll(async () => {
    const required = ['TEST_SUPABASE_URL', 'TEST_SUPABASE_PUBLISHABLE_KEY', 'TEST_ACCOUNT_A_EMAIL', 'TEST_ACCOUNT_A_PASSWORD', 'TEST_ACCOUNT_B_EMAIL', 'TEST_ACCOUNT_B_PASSWORD']
    if (required.some(key => !process.env[key])) throw new Error('The isolated integration environment is incomplete; follow docs/TESTING.md.')
    const config = readPublicConfig({ VITE_SUPABASE_URL: process.env.TEST_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY: process.env.TEST_SUPABASE_PUBLISHABLE_KEY })
    if (config.status !== 'ready') throw new Error('Integration requires a valid public endpoint and publishable/anon key, never a privileged key.')
    a = createSupabaseGateway(config, 'http://localhost:5173', false)
    b = createSupabaseGateway(config, 'http://localhost:5173', false)
    await a.gateway.signIn(process.env.TEST_ACCOUNT_A_EMAIL!, process.env.TEST_ACCOUNT_A_PASSWORD!)
    await b.gateway.signIn(process.env.TEST_ACCOUNT_B_EMAIL!, process.env.TEST_ACCOUNT_B_PASSWORD!)
    const aa = await createAccountService(a.gateway).access()
    const bb = await createAccountService(b.gateway).access()
    if (aa.status !== 'ready' || bb.status !== 'ready') throw new Error('Both synthetic accounts must be approved, verified and have active workspaces.')
    ownerA = aa.user.id; ownerB = bb.user.id
    if (ownerA === ownerB) throw new Error('Integration accounts must be distinct.')
  })

  afterAll(async () => {
    const results = await Promise.allSettled([a?.gateway.signOut(), b?.gateway.signOut()])
    if (results.some(result => result.status === 'rejected')) throw new Error('Synthetic test-session cleanup failed; inspect the isolated backend without logging credentials.')
  })

  it('each verified account can read its own workspace through the real adapter', async () => {
    expect((await a.gateway.workspace())?.ownerId).toBe(ownerA)
    expect((await b.gateway.workspace())?.ownerId).toBe(ownerB)
  })

  it('one account cannot read or update another account’s preferences', async () => {
    const read = await a.client.from('workspaces').select('owner_id').eq('owner_id', ownerB)
    expect(read.error).toBeNull(); expect(read.data).toEqual([])
    const write = await a.client.from('workspaces').update({ timezone: 'UTC' }).eq('owner_id', ownerB).select('owner_id')
    expect(write.error).toBeNull(); expect(write.data).toEqual([])
  })

  it('a browser account cannot change workspace ownership or its access state', async () => {
    const owner = await a.client.from('workspaces').update({ owner_id: ownerB }).eq('owner_id', ownerA)
    const state = await a.client.from('workspaces').update({ status: 'deleting' }).eq('owner_id', ownerA)
    expect(owner.error?.code).toBe('42501'); expect(state.error?.code).toBe('42501')
  })
})
