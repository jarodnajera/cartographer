<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { accessState, accounts, callbackUrl, publicConfig, recoveryReady, refreshAccess } from '../accounts/runtime'

type Mode = 'sign-in' | 'sign-up' | 'verify-email' | 'forgot-password' | 'reset-password' | 'callback'
const props = withDefaults(defineProps<{ mode: Mode; preview?: boolean; previewState?: string }>(), { preview: false, previewState: 'default' })
const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const busy = ref(false)
const done = ref(false)
const notice = ref('')
const failed = ref(false)
const isPreview = computed(() => import.meta.env.DEV && props.preview)
const connected = computed(() => isPreview.value || publicConfig.status === 'ready')
const state = computed(() => isPreview.value ? props.previewState : 'default')
const recoveryExpired = computed(() => props.mode === 'reset-password' && !done.value && (state.value === 'expired' || (!isPreview.value && !recoveryReady.value)))
const accessFeedback = computed(() => {
  if (props.mode !== 'sign-in' || isPreview.value || !connected.value) return ''
  if (accessState.value.status === 'access-denied') return 'This account can’t access the workspace. Contact the person running private testing.'
  if (accessState.value.status === 'unavailable') return 'We couldn’t check workspace access. Please try signing in again.'
  return ''
})
const description = computed(() => ({
  'sign-in': ['Welcome back', 'Sign in to your private workspace.'],
  'sign-up': ['Create your account', 'Private testing is open to approved email addresses. Verify your email before accessing your workspace.'],
  'verify-email': ['Check your email', 'Open your verification link to continue to your workspace.'],
  'forgot-password': ['Reset your password', 'Enter your email to request a recovery link.'],
  'reset-password': [done.value ? 'Password updated' : recoveryExpired.value ? 'Recovery link expired' : 'Choose a new password', done.value ? 'You can sign in with your updated password.' : recoveryExpired.value ? 'Request a new link to continue.' : 'Update your password to return to your workspace.'],
  callback: ['Opening your workspace', 'We’re checking your account link.'],
})[props.mode])
const previewSuccess = computed(() => ({ 'sign-in': 'You’re signed in. Continue to the fictional workspace.', 'sign-up': 'Check your email to verify your account.', 'verify-email': 'Your email is verified. You can continue to your workspace.', 'forgot-password': 'If an account exists for that address, a recovery link will be sent.', 'reset-password': 'Your password has been updated.', callback: 'Account link checked.' })[props.mode])
const title = computed(() => props.mode === 'reset-password' && (done.value || state.value === 'success') ? 'Password updated' : props.mode === 'verify-email' && state.value === 'success' ? 'Email verified' : description.value?.[0] ?? 'Your account')
const subtitle = computed(() => props.mode === 'reset-password' && (done.value || state.value === 'success') ? 'You can sign in with your updated password.' : props.mode === 'verify-email' && state.value === 'success' ? 'Your private workspace is ready.' : description.value?.[1] ?? '')
const showEmail = computed(() => ['sign-in', 'sign-up', 'forgot-password', 'verify-email'].includes(props.mode))
const showPassword = computed(() => ['sign-in', 'sign-up', 'reset-password'].includes(props.mode) && !recoveryExpired.value)
const actionLabel = computed(() => ({ 'sign-in': 'Sign in', 'sign-up': 'Create account', 'forgot-password': 'Send recovery link', 'reset-password': 'Save new password', 'verify-email': 'Resend verification email', callback: 'Checking link…' })[props.mode])
const linkFor = (mode: string) => isPreview.value ? { path: '/__preview', query: { screen: mode, state: 'default' } } : `/${mode}`
watch(() => [props.mode, props.previewState], () => { notice.value = ''; failed.value = false; done.value = false; password.value = ''; confirmPassword.value = '' })

async function submit() {
  if (busy.value || !connected.value) return
  if (props.mode === 'reset-password' && password.value !== confirmPassword.value) {
    failed.value = true; notice.value = 'The passwords don’t match. Enter the same password in both fields.'; return
  }
  busy.value = true; failed.value = false; notice.value = ''
  try {
    if (isPreview.value) {
      if (state.value === 'error') { failed.value = true; notice.value = 'That request couldn’t be completed. Your entries are still here.'; return }
      if (props.mode === 'sign-in') { await router.push('/__preview?screen=workspace'); return }
      if (props.mode === 'sign-up') { await router.push('/__preview?screen=verify-email'); return }
      if (props.mode === 'reset-password') done.value = true
      notice.value = props.mode === 'forgot-password' ? 'If an account exists for that address, a recovery link will be sent.' : props.mode === 'reset-password' ? 'Your password has been updated.' : 'If verification is needed, a new email will be sent.'
      return
    }
    if (!accounts) return
    if (props.mode === 'sign-in') {
      const access = await accounts.signIn(email.value, password.value)
      accessState.value = access
      if (access.status === 'ready') { await refreshAccess(); await router.replace('/workspace'); return }
      if (access.status === 'verification-required') { await router.push('/verify-email'); return }
      failed.value = true
      notice.value = access.status === 'access-denied' ? 'This account can’t access the workspace. Contact the person running private testing.' : 'We couldn’t sign you in. Check your details and try again.'
    } else {
      const result = props.mode === 'sign-up' ? await accounts.signUp(email.value, password.value)
        : props.mode === 'forgot-password' ? await accounts.requestRecovery(email.value, callbackUrl)
        : props.mode === 'verify-email' ? await accounts.resendVerification(email.value, callbackUrl)
        : await accounts.completeRecovery(password.value)
      notice.value = result.message; failed.value = !result.ok
      if (result.ok && props.mode === 'sign-up') await router.push('/verify-email')
      if (result.ok && props.mode === 'reset-password') { done.value = true; recoveryReady.value = false; password.value = ''; confirmPassword.value = '' }
    }
  } catch {
    failed.value = true; notice.value = 'That request couldn’t be completed. Try again or request a new account link.'
  } finally { busy.value = false }
}

onMounted(async () => {
  if (props.mode !== 'callback' || isPreview.value) return
  if (!accounts || typeof route.query.code !== 'string') {
    failed.value = true; notice.value = 'That account link can’t be used. Request a new verification or recovery link.'
    if (route.query.code) await router.replace({ name: 'auth-callback' })
    return
  }
  busy.value = true
  try {
    const kind = await accounts.finishCallback(route.query.code)
    if (kind === 'recovery') { recoveryReady.value = true; await router.replace('/reset-password') }
    else {
      const access = await refreshAccess()
      if (access.status === 'ready') await router.replace('/workspace')
      else { failed.value = true; notice.value = 'Your account link was checked, but this workspace isn’t available. Try signing in again.' }
    }
  } catch { failed.value = true; notice.value = 'That link is invalid or expired. Request a new link to continue.' }
  finally {
    busy.value = false
    if (route.name === 'auth-callback' && route.query.code) await router.replace({ name: 'auth-callback' })
  }
})
</script>

<template>
  <main class="auth-page">
    <a class="skip-link" href="#auth-title">Skip to account form</a>
    <div class="auth-layout">
      <section class="auth-brand" aria-label="Lancealot">
        <span class="wordmark">Lancealot</span>
        <div><h2>Your work,<br>in focus.</h2><p>Client projects, deadlines and unpaid invoices in your own private workspace.</p></div>
      </section>
      <section class="auth-panel" aria-labelledby="auth-title" :aria-busy="busy">
        <div class="auth-heading"><h1 id="auth-title" tabindex="-1">{{ title }}</h1><p>{{ subtitle }}</p></div>
        <p v-if="!connected" class="feedback" role="status">Your workspace isn’t ready yet. Account access will be available when the service is connected.</p>
        <p v-if="accessFeedback && !notice" class="feedback feedback-error" role="alert">{{ accessFeedback }}</p>
        <p v-if="notice" class="feedback" :class="{ 'feedback-error': failed }" :role="failed ? 'alert' : 'status'">{{ notice }}</p>
        <p v-if="state === 'unapproved'" class="feedback" role="alert">Registration is currently limited to approved addresses.</p>
        <p v-if="state === 'error' && !notice" class="feedback feedback-error" role="alert">That request couldn’t be completed. Check your details and try again.</p>
        <p v-if="state === 'expired' && mode === 'verify-email'" class="feedback feedback-error" role="alert">That verification link has expired. Request a new email below.</p>
        <p v-if="state === 'loading'" class="feedback" role="status">Checking your account…</p>
        <p v-if="state === 'success'" class="feedback" role="status">{{ previewSuccess }}</p>
        <form v-if="mode !== 'callback' && !recoveryExpired && !done && state !== 'success'" @submit.prevent="submit">
          <div v-if="showEmail" class="field"><label for="account-email">Email</label><input id="account-email" v-model="email" type="email" name="email" required autocomplete="email" :disabled="busy || state === 'loading'" placeholder="you@example.com"></div>
          <div v-if="showPassword" class="field"><label for="account-password">{{ mode === 'reset-password' ? 'New password' : 'Password' }}</label><input id="account-password" v-model="password" type="password" name="password" required :autocomplete="mode === 'sign-in' ? 'current-password' : 'new-password'" :disabled="busy || state === 'loading'"></div>
          <div v-if="mode === 'reset-password'" class="field"><label for="confirm-password">Confirm new password</label><input id="confirm-password" v-model="confirmPassword" type="password" required autocomplete="new-password" :disabled="busy || state === 'loading'"></div>
          <button class="button auth-submit" type="submit" :disabled="!connected || busy || state === 'loading'">{{ busy ? 'Please wait…' : actionLabel }}</button>
        </form>
        <RouterLink v-if="state === 'success' && ['sign-in', 'verify-email'].includes(mode) && isPreview" class="button" to="/__preview?screen=workspace">Continue to workspace</RouterLink>
        <RouterLink v-if="recoveryExpired" class="button" :to="linkFor('forgot-password')">Request a new recovery link</RouterLink>
        <div class="auth-links">
          <RouterLink v-if="mode === 'sign-in'" :to="linkFor('forgot-password')">Forgot password?</RouterLink>
          <RouterLink v-if="mode === 'sign-in'" :to="linkFor('sign-up')">Create account</RouterLink>
          <RouterLink v-else :to="linkFor('sign-in')">Back to sign in</RouterLink>
          <RouterLink v-if="mode === 'callback'" :to="linkFor('forgot-password')">Request recovery link</RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>
