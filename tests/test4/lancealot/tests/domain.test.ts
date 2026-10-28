import { describe, expect, it } from 'vitest'
import { amountValue, money, localDate, shiftDate } from '../src/lib/domain'
import { sampleGateway } from '../src/lib/sample'
describe('exact amounts and calendar dates',()=>{
  it('keeps unsafe-for-Number values exact and rejects rounding/exponents',()=>{
    expect(amountValue('9007199254740993.01','USD')).toBe('9007199254740993.01')
    expect(money('9007199254740993.01','USD')).toBe('USD 9,007,199,254,740,993.01')
    expect(amountValue('19','JPY')).toBe('19')
    expect(amountValue('1.234','BHD')).toBe('1.234')
    expect(amountValue('1.234','USD',3)).toBe('1.234') // An existing invoice retains its saved precision snapshot.
    for(const value of ['0','-1','NaN','Infinity','1e3','1.001'])expect(()=>amountValue(value,'USD')).toThrow()
    expect(()=>amountValue('1.5','JPY')).toThrow()
  })
  it('computes local dates around daylight-saving transitions without adding 24-hour days',()=>{
    expect(localDate(new Date('2026-11-01T08:30:00Z'),'America/Los_Angeles')).toBe('2026-11-01')
    expect(localDate(new Date('2026-03-08T07:30:00Z'),'America/Los_Angeles')).toBe('2026-03-07')
    expect(shiftDate('2028-02-28',1)).toBe('2028-02-29')
    expect(shiftDate('2026-12-31',1)).toBe('2027-01-01')
  })
})
describe('explicit sample adapter',()=>{
  it('keeps children active under archived parents and rejects reference-collision moves atomically',async()=>{
    const api=sampleGateway();let data=await api.load();const p=data.projects[2]!
    await api.save('project',{...p,status:'archived'},p.id,p.version)
    expect((await api.attention()).some(x=>x.kind==='invoice'&&x.project_id===p.id)).toBe(true)
    data=await api.load();const i=data.invoices[1]!
    await api.save('invoice',{...i,reference:'INV-024'},i.id,i.version)
    data=await api.load();const updated=data.projects[2]!
    await expect(api.save('project',{...updated,client_id:'c2'},updated.id,updated.version)).rejects.toMatchObject({code:'23505'})
    expect((await api.load()).projects[2]!.client_id).toBe('c3')
  })
})
