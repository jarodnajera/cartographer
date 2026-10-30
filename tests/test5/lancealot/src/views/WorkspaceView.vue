<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import UiIcon from '../components/UiIcon.vue'
import { accessState, accounts } from '../accounts/runtime'
const props = withDefaults(defineProps<{ preview?: boolean; previewState?: string }>(), { preview: false, previewState: 'default' })
const router = useRouter()
const isPreview = computed(() => import.meta.env.DEV && props.preview)
const status = computed(() => isPreview.value ? props.previewState : 'empty')
const email = computed(() => isPreview.value ? 'alex@example.test' : accessState.value.status === 'ready' ? accessState.value.user.email : '')
const nav = ['Today', 'Clients', 'Projects', 'Invoices', 'Settings'] as const
const activeFilter = ref('Active')
const search = ref('')
const selected = ref(1)
const message = ref('')
const projectExamples = [
  { id: 1, title: 'Website refresh', client: 'Northline Studio', deadline: '2 Nov', longDate: 'Monday, 2 November', day: '02', status: 'Active' },
  { id: 2, title: 'Autumn catalog', client: 'Harbor Goods', deadline: '6 Nov', longDate: 'Friday, 6 November', day: '06', status: 'Active' },
  { id: 3, title: 'Portfolio build', client: 'Morrow Design', deadline: '12 Nov', longDate: 'Thursday, 12 November', day: '12', status: 'Active' },
  { id: 4, title: 'Editorial templates', client: 'Juniper Press', deadline: '18 Nov', longDate: 'Wednesday, 18 November', day: '18', status: 'Active' },
  { id: 5, title: 'Booking experience', client: 'Cove Wellness', deadline: '—', longDate: 'No deadline', day: '—', status: 'Active' },
  { id: 6, title: 'Identity handover', client: 'Northline Studio', deadline: '25 Oct', longDate: 'Sunday, 25 October', day: '25', status: 'Completed' },
  { id: 7, title: 'Launch materials', client: 'Harbor Goods', deadline: '20 Oct', longDate: 'Tuesday, 20 October', day: '20', status: 'Archived' },
]
const rows = computed(() => isPreview.value && status.value !== 'empty' ? projectExamples.filter(p => p.status === activeFilter.value && `${p.title} ${p.client}`.toLowerCase().includes(search.value.toLowerCase())) : [])
const project = computed(() => rows.value.find(p => p.id === selected.value) ?? rows.value[0])
const mobileDetail = ref(false)
const completion = ref<Record<number, boolean[]>>({ 1: [false, false, true], 2: [false], 3: [false], 4: [false], 5: [false], 6: [true], 7: [false] })
const tasks = computed(() => {
  if (project.value?.id === 1) return [
    { title: 'Confirm homepage copy', date: 'Follow up 29 Oct' },
    { title: 'Review responsive layouts', date: 'Follow up 30 Oct' },
    { title: 'Send first design draft', date: 'Follow up 28 Oct' },
  ]
  return [{ title: project.value?.id === 7 ? 'Follow up on remaining copy' : project.value?.id === 6 ? 'Send final assets' : 'Review the next project draft', date: 'No follow-up date' }]
})
const completedCount = computed(() => (completion.value[project.value?.id ?? 0] ?? []).filter(Boolean).length)
const invoice = computed(() => project.value?.id === 1 ? { ref: 'INV-1042', amount: 'USD 1,800.00', due: 'Due 27 Oct', state: 'Unpaid' }
  : project.value?.id === 2 ? { ref: 'INV-1043', amount: 'USD 950.00', due: 'Due 5 Nov', state: 'Unpaid' }
  : project.value?.id === 6 ? { ref: 'INV-1038', amount: 'USD 2,400.00', due: 'Due 24 Oct', state: 'Paid' }
  : project.value?.id === 7 ? { ref: 'INV-1035', amount: 'USD 600.00', due: 'Due 20 Oct', state: 'Unpaid' } : null)
const notes = computed(() => project.value?.id === 1 ? 'A clearer home for the studio’s work. Final content is ready for review.' : project.value?.id === 7 ? 'Archived work with an unresolved task and unpaid invoice.' : 'Project notes stay with this client’s work.')
function toggleTask(index: number, event: Event) {
  if (!isPreview.value || !project.value) return
  const id = project.value.id
  const values = completion.value[id] ?? []
  values[index] = (event.target as HTMLInputElement).checked
  completion.value[id] = values
}
async function openProject(id: number) {
  selected.value = id; mobileDetail.value = true
  if (window.matchMedia('(max-width: 940px)').matches) { await nextTick(); document.getElementById('project-title')?.focus() }
}
async function closeDetail() { mobileDetail.value = false; await nextTick(); document.getElementById('project-row-' + project.value?.id)?.focus() }

async function signOut() {
  if (isPreview.value) { await router.push('/__preview?screen=sign-in'); return }
  if (!accounts) return
  const result = await accounts.signOut()
  if (!result.ok) { message.value = result.message; return }
  accessState.value = { status: 'anonymous' }
  await router.replace('/sign-in')
}
</script>

<template>
  <div v-if="isPreview || accessState.status === 'ready'" class="workspace-layout">
    <a class="skip-link" href="#workspace-title">Skip to projects</a>
    <aside class="sidebar">
      <span class="wordmark">Lancealot</span>
      <nav aria-label="Workspace navigation"><button v-for="item in nav" :key="item" type="button" :class="{ active: item === 'Projects' }" :aria-current="item === 'Projects' ? 'page' : undefined" :disabled="item !== 'Projects'" :title="item !== 'Projects' ? 'Not available yet' : undefined"><UiIcon :name="item.toLowerCase() as 'today' | 'clients' | 'projects' | 'invoices' | 'settings'" />{{ item }}</button></nav>
      <div class="workspace-profile"><span class="profile-avatar" aria-hidden="true">{{ isPreview ? 'AM' : email.slice(0, 2).toUpperCase() }}</span><div><strong>{{ isPreview ? 'Alex Morgan' : email }}</strong><span>Private workspace</span><button type="button" @click="signOut">Sign out</button></div></div>
    </aside>
    <main class="workspace-content">
      <header class="page-heading"><div><h1 id="workspace-title" tabindex="-1">Projects</h1><p>Your client work, with room to focus.</p></div><div class="page-actions"><button class="mobile-signout" type="button" @click="signOut">Sign out</button><button class="button" type="button" disabled title="Project entry is not available yet"><UiIcon name="plus" />Add project</button></div></header>
      <p v-if="message" class="feedback feedback-error" role="alert">{{ message }}</p>
      <div class="workspace-filters"><div class="filter-tabs" role="group" aria-label="Filter projects"><button v-for="filter in ['Active', 'Completed', 'Archived']" :key="filter" type="button" :aria-pressed="activeFilter === filter" @click="activeFilter = filter; mobileDetail = false">{{ filter }}</button></div><label class="search"><span class="sr-only">Search projects or clients</span><UiIcon name="search" /><input v-model="search" type="search" placeholder="Find a project"></label></div>
      <div class="project-split" :class="{ 'detail-open': mobileDetail }">
        <section class="project-list" aria-label="Projects">
          <div v-if="status === 'loading'" class="empty-state" role="status"><h2>Loading your projects…</h2><p>Your saved work hasn’t changed.</p></div>
          <div v-else-if="status === 'error'" class="empty-state" role="alert"><h2>Projects couldn’t load</h2><p>Try again to get the latest information.</p><button class="button secondary" type="button" @click="message = 'Choose Populated in preview controls to review the normal state.'">Try again</button></div>
          <template v-else-if="rows.length"><div class="list-heading"><span>Project &amp; client</span><span>Deadline</span></div><button v-for="p in rows" :key="p.id" :id="'project-row-' + p.id" class="project-row" type="button" :aria-current="project?.id === p.id ? 'true' : 'false'" @click="openProject(p.id)"><span><strong>{{ p.title }}</strong><span class="client-name">{{ p.client }}</span></span><span class="row-deadline">{{ p.deadline }}<small>{{ p.status }}</small></span></button><p class="list-footer">{{ rows.length }} {{ activeFilter.toLowerCase() }} projects</p></template>
          <div v-else class="empty-state"><h2>{{ search ? 'No matching projects' : `No ${activeFilter.toLowerCase()} projects` }}</h2><p>{{ search ? 'Try a different project or client name.' : 'Your client work will appear here when project tracking is available.' }}</p></div>
        </section>
        <section v-if="project && status !== 'loading' && status !== 'error'" class="project-detail" aria-labelledby="project-title">
          <button class="mobile-back" type="button" @click="closeDetail"><UiIcon name="back" />Back to projects</button>
          <div class="detail-top"><span class="badge">{{ project.status }}</span><button type="button" disabled>Edit project</button></div>
          <p class="client-label">{{ project.client }}</p><h2 id="project-title" tabindex="-1">{{ project.title }}</h2>
          <div class="deadline-block"><span>{{ project.day }}</span><div><strong>{{ project.longDate }}</strong><p>{{ project.status === 'Active' ? 'Project deadline' : `Project ${project.status.toLowerCase()}` }}</p></div></div>
          <div class="section-title"><h3>Tasks</h3><span>{{ completedCount }} of {{ tasks.length }} complete</span></div>
          <label v-for="(task, index) in tasks" :key="task.title" class="task" :class="{ completed: completion[project.id]?.[index] }"><input type="checkbox" :checked="completion[project.id]?.[index]" @change="toggleTask(index, $event)"><span>{{ task.title }}<small>{{ completion[project.id]?.[index] ? 'Completed' : task.date }}</small></span></label>
          <section class="invoice-block"><h3>Linked invoices</h3><div v-if="invoice"><span><strong>{{ invoice.ref }}</strong><small>{{ invoice.due }}</small></span><span><strong>{{ invoice.amount }}</strong><small>{{ invoice.state }}</small></span></div><p v-else class="detail-caption">No invoice linked to this project.</p></section>
          <section class="project-notes"><h3>Notes</h3><p>{{ notes }}</p></section>
          <div class="record-actions"><button type="button" disabled>Complete project</button><button type="button" disabled>Archive project</button></div>
        </section>
        <section v-else class="detail-placeholder"><p>Choose a project to see its details.</p></section>
      </div>
    </main>
  </div>
  <main v-else class="unavailable"><h1>Workspace unavailable</h1><p>Sign in again to check your access.</p></main>
</template>
