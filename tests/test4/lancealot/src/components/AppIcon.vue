<script setup lang="ts">
withDefaults(defineProps<{ name?: string }>(), { name: 'projects' })
const paths: Record<string, string> = { today: 'M3 4h14v14H3z M6 2v4 M14 2v4 M3 8h14 M7 12h3', clients: 'M7 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M1 19v-2a6 6 0 0 1 12 0v2 M14 4a3 3 0 0 1 0 6 M16 13a5 5 0 0 1 3 5', projects: 'M2 6h6l2-3h8v14H2z', settings: 'M10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M10 1v3 M10 16v3 M1 10h3 M16 10h3 M4 4l2 2 M14 14l2 2 M4 16l2-2 M14 6l2-2', check: 'M4 10l4 4 8-9', mail: 'M2 4h16v12H2z M2 4l8 6 8-6' }
</script>
<template><svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><path :d="paths[name] || paths.projects" /></svg></template>
