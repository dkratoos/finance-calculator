<script setup lang="ts">
interface Props {
  icon: string
  title: string
  value: string
  note?: string
  variant?: 'default' | 'highlight' | 'warning' | 'breakdown'
}

withDefaults(defineProps<Props>(), {
  note: '',
  variant: 'default'
})
</script>

<template>
  <div class="result-card" :class="[variant, { breakdown: variant === 'breakdown' }]">
    <div v-if="variant !== 'breakdown'" class="result-icon">{{ icon }}</div>
    <div class="result-content">
      <h3 v-if="variant === 'breakdown'">{{ title }}</h3>
      <h4 v-else>{{ title }}</h4>
      <p v-if="variant !== 'breakdown'" class="result-value">{{ value }}</p>
      <p v-if="note && variant !== 'breakdown'" class="result-note">{{ note }}</p>

      <!-- Conteúdo especial para breakdown -->
      <div v-if="variant === 'breakdown'">
        <slot />
      </div>
    </div>
  </div>
</template>
