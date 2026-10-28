import { expect, it, vi } from 'vitest'
import { digestContent, resendDriver, runJobs, type Envelope, type JobStore } from '../supabase/functions/_shared/jobs'
import { secretMatches } from '../supabase/functions/_shared/http'
const envelope:Envelope={id:'job',token:'claim',to:'owner@example.test',date:'2026-10-28',timezone:'UTC',attempt:1,items:[{kind:'invoice',id:'i',title:'INV-1 <script>',relevant_date:'2026-10-27',project_id:'p',project_name:'Project & work',client_name:'Client',}]}
function store():JobStore{return {claimDigests:vi.fn().mockResolvedValue([{id:'job',token:'claim'}]),authorize:vi.fn().mockResolvedValue(envelope),finishDigest:vi.fn().mockResolvedValue(undefined),claimDeletions:vi.fn().mockResolvedValue([]),purge:vi.fn().mockResolvedValue(true),deleteIdentity:vi.fn().mockResolvedValue(undefined),finishDeletion:vi.fn().mockResolvedValue(undefined)}}
it('renders escaped linked digest content without carrying invoice amounts',()=>{
 const content=digestContent(envelope,'https://lancealot.example.test')
 expect(content.html).toContain('INV-1 &lt;script&gt;');expect(content.html).not.toContain('<script>')
 expect(content.html).toContain('https://lancealot.example.test/projects/p')
 expect(content.text).toContain('Overdue invoices');expect(content.html).not.toContain('amount')
 expect(()=>digestContent(envelope,'http://remote.example.test')).toThrow()
})
it('does not claim email work when no provider is configured',async()=>{
 const api=store();await runJobs(api,null);expect(api.claimDigests).not.toHaveBeenCalled()
})
it('records an ambiguous send as unknown rather than calling the provider again',async()=>{
 const api=store(),driver={send:vi.fn().mockRejectedValue(new Error('timeout after possible acceptance'))}
 expect((await runJobs(api,driver)).unknown).toBe(1)
 expect(driver.send).toHaveBeenCalledTimes(1);expect(api.finishDigest).toHaveBeenCalledWith({id:'job',token:'claim'},{outcome:'unknown'})
})
it('does not send after authorization rejects a claim and retries partial erasure safely',async()=>{
 const api=store();vi.mocked(api.claimDeletions).mockResolvedValue([{id:'delete',token:'fence',owner:'owner'}]);vi.mocked(api.deleteIdentity).mockRejectedValue(new Error('temporary'))
 vi.mocked(api.authorize).mockResolvedValue(null);const driver={send:vi.fn()}
 const result=await runJobs(api,driver);expect(result.cleanupPending).toBe(1);expect(driver.send).not.toHaveBeenCalled()
 expect(api.finishDeletion).toHaveBeenCalledWith({id:'delete',token:'fence',owner:'owner'},false)
})
it('classifies provider failures conservatively and uses attempt-scoped idempotency',async()=>{
 const send=vi.fn().mockResolvedValueOnce(new Response('oops',{status:503})).mockResolvedValueOnce(new Response('{}',{status:429,headers:{'Retry-After':'90'}})).mockResolvedValueOnce(new Response('{"id":"provider-id"}',{status:200}))
 const driver=resendDriver('synthetic-key','Lancealot <sender@example.test>','https://lancealot.example.test',send)
 expect((await driver.send(envelope)).outcome).toBe('unknown')
 expect(await driver.send(envelope)).toEqual({outcome:'temporary',retrySeconds:90})
 expect((await driver.send(envelope)).outcome).toBe('accepted')
 expect(send).toHaveBeenCalledWith('https://api.resend.com/emails',expect.objectContaining({headers:expect.objectContaining({'Idempotency-Key':'lancealot/job/1'})}))
})
it('requires a configured high-entropy worker secret',async()=>{
 const secret='a'.repeat(40);expect(await secretMatches(secret,secret)).toBe(true);expect(await secretMatches('wrong',secret)).toBe(false);expect(await secretMatches('short','short')).toBe(false)
})
