<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Props {
  currentPage: string
  showBreadcrumb?: boolean
}

withDefaults(defineProps<Props>(), {
  showBreadcrumb: true
})
</script>

<template>
  <header class="page-header">
    <div v-if="showBreadcrumb" class="breadcrumb">
      <RouterLink to="/" class="breadcrumb-link">HOME</RouterLink>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ currentPage }}</span>
    </div>
  </header>
</template>
