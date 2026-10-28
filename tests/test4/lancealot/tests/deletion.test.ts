import { expect, it, vi } from 'vitest'
import { createDeletionHandler, type DeletionDependencies } from '../supabase/functions/_shared/deletion'
function dependencies():DeletionDependencies{return {appUrl:'https://lancealot.example.test',identify:vi.fn().mockResolvedValue({id:'owner-a',email:'a@example.test',verified:true}),verify:vi.fn().mockResolvedValue({id:'owner-a',release:vi.fn().mockResolvedValue(undefined)}),begin:vi.fn().mockResolvedValue(undefined)}}
function request(body:unknown={password:'synthetic-only',confirm:true,owner:'owner-b'},token='session-a'){return new Request('https://edge.example.test/delete-account',{method:'POST',headers:{Authorization:'Bearer '+token,Origin:'https://lancealot.example.test','Content-Type':'application/json'},body:JSON.stringify(body)})}
it('binds deletion to the verified caller and password proof, ignoring a supplied other-owner ID',async()=>{
 const deps=dependencies(),response=await createDeletionHandler(()=>deps)(request())
 expect(response.status).toBe(202);expect(await response.json()).toEqual({state:'pending'})
 expect(deps.verify).toHaveBeenCalledWith('a@example.test','synthetic-only');expect(deps.begin).toHaveBeenCalledWith('owner-a')
})
it('rejects wrong/cross-user password proof or missing confirmation without beginning deletion',async()=>{
 for(const proof of [null,{id:'owner-b',release:vi.fn().mockResolvedValue(undefined)}]){
  const deps=dependencies();vi.mocked(deps.verify).mockResolvedValue(proof)
  expect((await createDeletionHandler(()=>deps)(request())).status).toBe(400);expect(deps.begin).not.toHaveBeenCalled()
 }
 const deps=dependencies();expect((await createDeletionHandler(()=>deps)(request({password:'synthetic-only',confirm:false}))).status).toBe(400);expect(deps.verify).not.toHaveBeenCalled()
})
it('fails closed for unconfigured/unverified/origin-mismatched calls and reports no false erasure success',async()=>{
 expect((await createDeletionHandler(()=>null)(request())).status).toBe(503)
 const insecure=dependencies();insecure.appUrl='http://remote.example.test';expect((await createDeletionHandler(()=>insecure)(request())).status).toBe(503)
 const deps=dependencies();vi.mocked(deps.identify).mockResolvedValue({id:'owner-a',email:'a@example.test',verified:false})
 expect((await createDeletionHandler(()=>deps)(request())).status).toBe(401);expect(deps.begin).not.toHaveBeenCalled()
 const originRequest=new Request('https://edge.example.test/delete-account',{method:'POST',headers:{Origin:'https://wrong.example.test'}})
 expect((await createDeletionHandler(()=>dependencies())(originRequest)).status).toBe(403)
 const failing=dependencies();vi.mocked(failing.begin).mockRejectedValue(new Error('locked after response loss'))
 const response=await createDeletionHandler(()=>failing)(request());expect(response.status).toBe(503);expect(await response.json()).not.toHaveProperty('state','done')
})
