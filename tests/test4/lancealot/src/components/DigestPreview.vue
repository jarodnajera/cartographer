<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { workspace } from '@/lib/workspace'
import { dateLabel } from '@/lib/domain'
const emit = defineEmits<{ close: [] }>(), dialog = ref<HTMLDialogElement>()
onMounted(() => dialog.value?.showModal()); onBeforeUnmount(() => dialog.value?.close())
</script>
<template><dialog ref="dialog" class="modal email-preview" aria-labelledby="email-title" @cancel.prevent="emit('close')"><h2 id="email-title">Daily digest preview</h2><p class="secondary">A preview of your current attention list. This does not send an email.</p><hr class="divider" /><div class="wordmark"><span class="mark" aria-hidden="true">L</span>Lancealot</div><p class="secondary">Dates use {{ workspace.data?.settings.timezone }}</p><section v-for="group in [{kind:'task',name:'Task follow-ups'},{kind:'project',name:'Project deadlines'},{kind:'invoice',name:'Overdue invoices'}]" :key="group.kind"><template v-if="workspace.attention.some(i => i.kind === group.kind)"><h3>{{ group.name }}</h3><p v-for="item in workspace.attention.filter(i => i.kind === group.kind)" :key="item.id"><strong>{{ item.title }}</strong><br />{{ item.client_name }} / {{ item.project_name }}<br />{{ dateLabel(item.relevant_date) }}<br /><RouterLink :to="'/projects/' + item.project_id" @click="emit('close')">Open {{ item.kind }}</RouterLink></p></template></section><p v-if="!workspace.attention.length">No outstanding items. An empty digest would not be sent.</p><div class="modal-actions"><button @click="emit('close')">Close preview</button></div></dialog></template>
