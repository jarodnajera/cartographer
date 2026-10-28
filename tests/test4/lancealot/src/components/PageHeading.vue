<script setup lang="ts">defineProps<{ title: string; subtitle: string }>()</script>
<template><header class="page-head"><div><h1>{{ title }}</h1><p>{{ subtitle }}</p></div><div class="actions"><slot /></div></header></template>
