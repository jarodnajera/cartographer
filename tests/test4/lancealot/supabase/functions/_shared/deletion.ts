import { json } from './http.ts'
export interface DeletionIdentity { id:string; email:string; verified:boolean }
export interface PasswordProof { id:string; release():Promise<void> }
export interface DeletionDependencies {
  appUrl:string
  identify(token:string):Promise<DeletionIdentity|null>
  verify(email:string,password:string):Promise<PasswordProof|null>
  begin(owner:string):Promise<void>
}
// Each invocation gets isolated clients/proof state; callers cannot choose another owner.
export function createDeletionHandler(configure:()=>DeletionDependencies|null) {
 return async(req:Request):Promise<Response>=>{
  let proof:PasswordProof|null=null
  let cors:Record<string,string>={}
  try{
   const deps=configure()
   if(!deps)return json({error:'Account removal is not configured.'},503)
   const app=new URL(deps.appUrl)
   if(app.username||app.password||(app.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(app.hostname)))return json({error:'Account removal is not configured.'},503)
   const expectedOrigin=app.origin,origin=req.headers.get('Origin')
   if(origin&&origin!==expectedOrigin)return json({error:'Origin not allowed.'},403)
   if(origin)cors={'Access-Control-Allow-Origin':expectedOrigin,'Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin'}
   if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors})
   if(req.method!=='POST')return json({error:'Method not allowed.'},405,cors)
   const token=req.headers.get('Authorization')?.replace(/^Bearer /,'')
   if(!token)return json({error:'Sign in again.'},401,cors)
   const user=await deps.identify(token)
   if(!user?.id||!user.email||!user.verified)return json({error:'Sign in again.'},401,cors)
   let password:string
   try{const text=await req.text();if(text.length>4096)throw new Error();const body=JSON.parse(text);if(body.confirm!==true||typeof body.password!=='string'||!body.password.length||body.password.length>1024)throw new Error();password=body.password}catch{return json({error:'Enter your password and explicitly confirm deletion.'},400,cors)}
   proof=await deps.verify(user.email,password);password=''
   if(!proof||proof.id!==user.id)return json({error:'Password verification failed. Your account has not been changed.'},400,cors)
   await deps.begin(user.id)
   return json({state:'pending'},202,cors)
  }catch{return json({error:'Account removal could not be confirmed. If access is locked, contact support before retrying.'},503,cors)}
  finally{await proof?.release().catch(()=>undefined)}
 }
}
