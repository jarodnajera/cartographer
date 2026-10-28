<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import type { Entity, Kind } from '@/lib/types'
import { describeError } from '@/lib/domain'
import { remove } from '@/lib/workspace'
const props = defineProps<{ kind: Kind; record: Entity; label: string }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement>(), busy = ref(false), error = ref('')
onMounted(() => dialog.value?.showModal()); onBeforeUnmount(() => dialog.value?.close())
async function confirm() { busy.value = true; error.value = ''; try { await remove(props.kind, props.record); emit('close') } catch (e) { error.value = describeError(e) } finally { busy.value = false } }
</script>
<template><dialog ref="dialog" class="modal" aria-labelledby="delete-title" @cancel.prevent="!busy && emit('close')"><h2 id="delete-title">Delete {{ kind }}?</h2><p><strong>{{ label }}</strong> will be permanently removed. This cannot be undone.</p><p class="secondary">Clients and projects with linked records cannot be deleted. You can archive projects instead.</p><p v-if="error" role="alert" class="error-text">{{ error }}</p><div class="modal-actions"><button :disabled="busy" @click="emit('close')">Keep {{ kind }}</button><button class="danger" :disabled="busy" @click="confirm">{{ busy ? 'Deleting…' : 'Delete ' + kind }}</button></div></dialog></template>
