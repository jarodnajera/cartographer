<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthView from './AuthView.vue'
import WorkspaceView from './WorkspaceView.vue'
const isDevelopment = import.meta.env.DEV
const route = useRoute()
const router = useRouter()
const screens = ['sign-in', 'sign-up', 'verify-email', 'forgot-password', 'reset-password', 'workspace'] as const
const screen = computed(() => screens.find(s => s === route.query.screen) ?? 'sign-in')
const authMode = computed(() => screen.value === 'workspace' ? 'sign-in' : screen.value)
const state = computed(() => ['default', 'empty', 'loading', 'error', 'success', 'expired', 'unapproved'].includes(String(route.query.state)) ? String(route.query.state) : 'default')
function choose(key: string, value: string) { void router.replace({ path: '/__preview', query: { screen: screen.value, state: state.value, [key]: value } }) }
</script>
<template>
  <template v-if="isDevelopment">
    <WorkspaceView v-if="screen === 'workspace'" preview :preview-state="state" />
    <AuthView v-else :mode="authMode" preview :preview-state="state" />
    <aside class="review-controls" aria-label="Development frontend preview controls"><div><strong>Frontend review</strong><span>Fictional data. No backend calls.</span></div><label>Screen<select :value="screen" @change="choose('screen', ($event.target as HTMLSelectElement).value)"><option v-for="s in screens" :key="s" :value="s">{{ s }}</option></select></label><label>State<select :value="state" @change="choose('state', ($event.target as HTMLSelectElement).value)"><option v-for="s in ['default', 'empty', 'loading', 'error', 'success', 'expired', 'unapproved']" :key="s">{{ s }}</option></select></label><a href="/sign-in">Leave preview</a></aside>
  </template>
</template>
