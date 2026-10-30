<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { publicConfig } from './accounts/runtime'
const route = useRoute()
const showDevNotice = computed(() => import.meta.env.DEV && route.name !== 'ui-preview')
</script>

<template>
  <div v-if="showDevNotice" class="development-notice">
    <span>Development · {{ publicConfig.status === 'ready' ? 'Backend configuration present; live checks pending' : 'Backend not configured' }}</span>
    <a href="/__preview">Review frontend with fictional data</a>
  </div>
  <RouterView />
</template>
