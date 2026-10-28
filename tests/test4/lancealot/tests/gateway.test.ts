import { expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { liveGateway } from '../src/lib/gateway'
it('rejects a pending form if account identity changed before a mutation',async()=>{
  const client={auth:{getSession:vi.fn().mockResolvedValue({data:{session:{access_token:'sample-token'}},error:null}),getUser:vi.fn().mockResolvedValue({data:{user:{id:'other-user'}},error:null})}} as unknown as SupabaseClient
  const factory=vi.fn()
  await expect(liveGateway(client,'original-user',factory).save('client',{name:'Private draft'})).rejects.toMatchObject({code:'42501'})
  expect(factory).not.toHaveBeenCalled()
})
it('pins RPC dispatch to the verified token rather than a later global session',async()=>{
  const rpc=vi.fn().mockResolvedValue({data:null,error:null}),factory=vi.fn().mockReturnValue({rpc})
  const client={auth:{getSession:vi.fn().mockResolvedValue({data:{session:{access_token:'original-token'}},error:null}),getUser:vi.fn().mockImplementation(async()=>{client.auth.getSession=vi.fn().mockResolvedValue({data:{session:{access_token:'new-account-token'}},error:null});return {data:{user:{id:'original-user'}},error:null}})}} as unknown as SupabaseClient
  await liveGateway(client,'original-user',factory).save('client',{name:'Original account draft'})
  expect(factory).toHaveBeenCalledWith('original-token')
  expect(rpc).toHaveBeenCalledWith('save_record',expect.objectContaining({p_kind:'client'}))
})
