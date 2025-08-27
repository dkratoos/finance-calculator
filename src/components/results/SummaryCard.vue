<script setup lang="ts">
interface Props {
  title: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  icon: ''
})
</script>

<template>
  <div class="summary-card">
    <h3>
      <span v-if="icon">{{ icon }} </span>{{ title }}
    </h3>
    <div class="summary-content">
      <slot />
    </div>
  </div>
</template>
