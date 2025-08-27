<script setup lang="ts">
import PageHeader from './PageHeader.vue'

interface Props {
  pageTitle: string
  showBreadcrumb?: boolean
}

withDefaults(defineProps<Props>(), {
  showBreadcrumb: true
})
</script>

<template>
  <div>
    <PageHeader :current-page="pageTitle" :show-breadcrumb="showBreadcrumb" />

    <div class="content-wrapper">
      <slot />
    </div>
  </div>
</template>
