<script setup lang="ts">
defineProps<{ name: 'projects' | 'today' | 'clients' | 'invoices' | 'settings' | 'search' | 'plus' | 'back' }>()
const paths = {
  projects: 'M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z',
  today: 'M4 6h16v15H4ZM7 3v6m10-6v6M4 11h16m-11 5h2',
  clients: 'M15 20v-2a6 6 0 0 0-12 0v2m13-15a3 3 0 0 1 0 6m3 9v-2a6 6 0 0 0-3-5M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  invoices: 'M6 3h12v18l-3-2-3 2-3-2-3 2Zm3 5h6m-6 4h6',
  settings: 'M4 7h16M4 17h16M9 4v6m6 4v6',
  search: 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-1 5 5 5',
  plus: 'M12 5v14M5 12h14', back: 'm14 5-7 7 7 7',
}
</script>
<template><svg viewBox="0 0 24 24" aria-hidden="true" class="icon"><path :d="paths[name]" /></svg></template>
