<script setup lang="ts">
interface Props {
  title?: string
  icon?: string
  variant?: 'default' | 'cards' | 'section'
}

withDefaults(defineProps<Props>(), {
  title: '',
  icon: '',
  variant: 'default'
})
</script>

<template>
  <section class="results-section">
    <div v-if="title" class="section-header">
      <h2>
        <span v-if="icon" class="icon">{{ icon }}</span>
        {{ title }}
      </h2>
    </div>

    <div :class="{
      'results-grid': variant === 'default',
      'result-cards': variant === 'cards',
      'result-section': variant === 'section'
    }">
      <slot />
    </div>
  </section>
</template>
