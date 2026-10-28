<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import AuthView from './views/AuthView.vue'
import WorkspaceShell from './components/WorkspaceShell.vue'
import { account, startAccount, signOut } from './lib/account'
import { supabase } from './lib/supabase'
import { connectWorkspace, refresh, workspace } from './lib/workspace'
import { liveGateway } from './lib/gateway'
import { sampleGateway } from './lib/sample'
import { router } from './router'
const route=useRoute()
const actor=computed(()=>account.initialized?(account.sample?'sample':account.user?.id||''):'booting')
let request=0
const deletionExitError=ref('')
watch(actor,async id=>{
  const ticket=++request
  connectWorkspace(id==='sample'?sampleGateway():id&&id!=='booting'&&supabase?liveGateway(supabase,id):null)
  if(!id||id==='booting')return
  await refresh()
  if(ticket!==request||account.recovery)return
  if(workspace.data&&!workspace.data.settings.timezone)await router.replace('/settings')
  else if(route.path.startsWith('/auth'))await router.replace('/today')
},{immediate:true})
async function leaveDeletion() { try { await signOut(); account.deletionPending=false; account.deletionSample=false; await router.replace('/auth/signin') } catch { deletionExitError.value='Sign-out could not finish. Your workspace remains locked; check your connection and try again.' } }
onMounted(startAccount)
</script>
<template><main v-if="account.deletionPending" class="setup"><div class="wordmark"><span class="mark" aria-hidden="true">L</span>Lancealot</div><h1>{{ account.deletionSample ? "Sample deletion started." : "Deletion started." }}</h1><p v-if="account.deletionSample" class="notice">This is a demonstration. No real account or saved records were removed.</p><p>Your workspace is locked while cleanup finishes. No new reminders will be sent. This cannot be undone.</p><p class="secondary">This confirms the start of cleanup, not completed erasure. Contact support if you need help.</p><p v-if="deletionExitError" class="error-text" role="alert">{{ deletionExitError }}</p><button @click="leaveDeletion">Return to sign in</button></main><div v-else-if="!account.initialized" class="setup" role="status"><div class="wordmark"><span class="mark" aria-hidden="true">L</span>Lancealot</div><p>Opening your workspace…</p></div><AuthView v-else-if="!actor || (account.recovery && route.path === '/auth/password')" /><WorkspaceShell v-else /></template>
