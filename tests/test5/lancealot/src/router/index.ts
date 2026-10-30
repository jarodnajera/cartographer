import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { connection, refreshAccess } from '../accounts/runtime'
import AuthView from '../views/AuthView.vue'
import WorkspaceView from '../views/WorkspaceView.vue'

const modes = ['sign-in', 'sign-up', 'verify-email', 'forgot-password', 'reset-password'] as const
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/workspace' },
  ...modes.map(mode => ({ path: `/${mode}`, name: mode, component: AuthView, props: { mode } })),
  { path: '/auth/callback', name: 'auth-callback', component: AuthView, props: { mode: 'callback' } },
  { path: '/workspace', name: 'workspace', component: WorkspaceView, meta: { requiresAuth: true } },
]
// The review route is never registered in a production build.
if (import.meta.env.DEV) routes.push({ path: '/__preview', name: 'ui-preview', component: () => import('../views/UiPreviewView.vue') })
routes.push({ path: '/:pathMatch(.*)*', redirect: '/sign-in' })

export const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach(async to => {
  if (!to.meta.requiresAuth) return true
  const access = await refreshAccess()
  if (access.status === 'ready') return true
  return access.status === 'verification-required' ? '/verify-email' : '/sign-in'
})
connection?.client.auth.onAuthStateChange(() => {
  // Defer SDK calls until the auth callback/lock has returned.
  window.setTimeout(async () => {
    if (!router.currentRoute.value.meta.requiresAuth) return
    const access = await refreshAccess()
    if (access.status !== 'ready') await router.replace(access.status === 'verification-required' ? '/verify-email' : '/sign-in')
  }, 0)
})
