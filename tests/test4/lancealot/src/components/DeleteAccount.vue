<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { account, signOut } from '@/lib/account'
import { removeAccount, connectWorkspace } from '@/lib/workspace'
import { describeError } from '@/lib/domain'
const emit=defineEmits<{close:[]}>(), dialog=ref<HTMLDialogElement>(), password=ref(''), confirmed=ref(false),busy=ref(false),error=ref('')
onMounted(()=>dialog.value?.showModal());onBeforeUnmount(()=>dialog.value?.close())
async function submit(){
  if(!confirmed.value)return
  busy.value=true;error.value=''
  try{
    await removeAccount(password.value);password.value='';account.deletionSample=account.sample;account.deletionPending=true;connectWorkspace(null)
    try{await signOut()}catch{/* Access is already locked server-side; keep the known pending state. */}
    emit('close')
  }catch(e){password.value='';error.value=describeError(e)}finally{busy.value=false}
}
</script>
<template><dialog ref="dialog" class="modal" aria-labelledby="delete-account-title" @cancel.prevent="!busy && emit('close')"><h2 id="delete-account-title">Delete your account?</h2><p>Your clients, projects, tasks, invoices and account will be removed. Access and new reminder sends stop when cleanup begins. There is no undo.</p><p v-if="account.sample" class="notice">Sample only: enter <strong>demo</strong>. Do not enter a real password. No real account will be removed.</p><form @submit.prevent="submit"><div class="fields"><div class="field full"><label for="current-password">{{ account.sample?'Demo password':'Current password' }}</label><input id="current-password" v-model="password" type="password" :autocomplete="account.sample?'off':'current-password'" required /></div></div><label class="toggle"><input v-model="confirmed" type="checkbox" required />I understand this permanently removes my account.</label><p v-if="error" class="error-text" role="alert">{{ error }}</p><div class="modal-actions"><button type="button" :disabled="busy" @click="emit('close')">Keep account</button><button type="submit" class="danger" :disabled="busy || !confirmed">{{ busy?'Confirming…':'Delete account' }}</button></div></form></dialog></template>
