<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import type { Entity, Kind, Invoice } from '@/lib/types'
import { amountValue, currencies, describeError } from '@/lib/domain'
import { save, workspace } from '@/lib/workspace'
const props = defineProps<{ kind: Kind; record?: Entity; parent?: string }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement>(), busy = ref(false), error = ref('')
const form = reactive({ name: '', client_id: props.kind === 'project' ? props.parent || '' : '', deadline: '', status: 'active', title: '', project_id: ['task', 'invoice'].includes(props.kind) ? props.parent || '' : '', followup_date: '', completed: false, reference: '', amount: '', currency: 'USD', due_date: '', paid: false, ...props.record })
onMounted(() => dialog.value?.showModal())
onBeforeUnmount(() => dialog.value?.close())
async function submit() {
  busy.value = true; error.value = ''
  try {
    const data = { ...form, deadline: form.deadline || null, followup_date: form.followup_date || null }
    if (props.kind === 'invoice') { const original = props.record as Invoice | undefined; data.amount = amountValue(form.amount, form.currency, original?.currency === form.currency ? original.currency_digits : undefined) }
    await save(props.kind, data, props.record); emit('close')
  } catch (e) { error.value = describeError(e) } finally { busy.value = false }
}
</script>
<template>
  <dialog ref="dialog" class="modal" aria-labelledby="record-title" @cancel.prevent="!busy && emit('close')">
    <h2 id="record-title">{{ record ? 'Edit' : 'Add' }} {{ kind }}</h2>
    <p class="secondary">{{ kind === 'invoice' ? 'Track an invoice issued elsewhere. Record its full amount and original currency.' : 'Keep the details you need to follow up.' }}</p>
    <form @submit.prevent="submit">
      <div class="fields">
        <div v-if="kind === 'client' || kind === 'project'" class="field full"><label for="name">{{ kind === 'client' ? 'Client name' : 'Project name' }}</label><input id="name" v-model="form.name" required maxlength="160" autofocus /></div>
        <div v-if="kind === 'project'" class="field full"><label for="client">Client</label><select id="client" v-model="form.client_id" required><option disabled value="">Choose a client</option><option v-for="c in workspace.data?.clients" :key="c.id" :value="c.id">{{ c.name }}</option></select></div>
        <div v-if="kind === 'project'" class="field"><label for="deadline">Deadline <span class="secondary">(optional)</span></label><input id="deadline" v-model="form.deadline" type="date" /></div>
        <div v-if="kind === 'project'" class="field"><label for="project-state">Project state</label><select id="project-state" v-model="form.status"><option value="active">Active</option><option value="completed">Completed</option><option value="archived">Archived</option></select></div>
        <div v-if="kind === 'task' || kind === 'invoice'" class="field full"><label for="project">Project</label><select id="project" v-model="form.project_id" required><option disabled value="">Choose a project</option><option v-for="p in workspace.data?.projects" :key="p.id" :value="p.id">{{ p.name }}</option></select></div>
        <template v-if="kind === 'task'">
          <div class="field full"><label for="title">Task title</label><input id="title" v-model="form.title" required maxlength="240" /></div>
          <div class="field full"><label for="followup">Follow-up date <span class="secondary">(optional)</span></label><input id="followup" v-model="form.followup_date" type="date" /><small>Without a date, this task won't appear in follow-up reminders.</small></div>
          <label class="toggle"><input v-model="form.completed" type="checkbox" />Completed</label>
        </template>
        <template v-if="kind === 'invoice'">
          <div class="field full"><label for="reference">Invoice reference</label><input id="reference" v-model="form.reference" required maxlength="120" /><small>References are unique per client, across their projects.</small></div>
          <div class="field"><label for="amount">Full amount</label><input id="amount" v-model="form.amount" inputmode="decimal" required placeholder="0.00" /></div>
          <div class="field"><label for="currency">Currency</label><select id="currency" v-model="form.currency" required><option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.code }} — {{ c.name }}{{ c.historical ? ' (historical)' : '' }}</option></select></div>
          <div class="field full"><label for="due-date">Due date</label><input id="due-date" v-model="form.due_date" type="date" required /></div>
          <label class="toggle"><input v-model="form.paid" type="checkbox" />Paid in full</label>
        </template>
      </div>
      <p v-if="error" class="error-text" role="alert">{{ error }}</p>
      <footer class="modal-actions"><button type="button" :disabled="busy" @click="emit('close')">Cancel</button><button class="primary" type="submit" :disabled="busy">{{ busy ? 'Saving…' : record ? 'Save changes' : 'Add ' + kind }}</button></footer>
    </form>
  </dialog>
</template>
