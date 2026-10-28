import { createClient } from 'npm:@supabase/supabase-js@2.118.0'
import { createDeletionHandler } from '../_shared/deletion.ts'
Deno.serve(createDeletionHandler(()=>{
 const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),publicKey=Deno.env.get('SUPABASE_ANON_KEY'),appUrl=Deno.env.get('APP_URL')
 if(!url||!key||!publicKey||!appUrl)return null
 const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
 return {
  appUrl,
  async identify(token:string){const {data:{user},error}=await admin.auth.getUser(token);return error||!user?.email?null:{id:user.id,email:user.email,verified:!!user.email_confirmed_at}},
  async verify(email:string,password:string){
   const isolated=createClient(url,publicKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})
   const {data,error}=await isolated.auth.signInWithPassword({email,password})
   if(error||!data.user)return null
   return {id:data.user.id,async release(){await isolated.auth.signOut({scope:'local'})}}
  },
  async begin(owner:string){const {error}=await admin.rpc('begin_account_deletion',{p_owner:owner});if(error)throw error},
 }
}))
