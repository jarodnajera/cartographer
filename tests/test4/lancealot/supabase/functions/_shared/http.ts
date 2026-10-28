export async function secretMatches(actual: string, expected: string): Promise<boolean> {
  if (!expected || expected.length < 32) return false
  const bytes = new TextEncoder()
  const [a,b] = await Promise.all([crypto.subtle.digest('SHA-256',bytes.encode(actual)),crypto.subtle.digest('SHA-256',bytes.encode(expected))])
  const left=new Uint8Array(a),right=new Uint8Array(b)
  let difference=0;for(let i=0;i<left.length;i++)difference|=left[i]!^right[i]!
  return difference===0
}
export function json(body: unknown,status=200,headers:Record<string,string>={}) { return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store',...headers}}) }
