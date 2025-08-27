<script setup lang="ts">
interface Props {
  title: string
  icon?: string
  isSubsection?: boolean
}

withDefaults(defineProps<Props>(), {
  icon: '',
  isSubsection: false
})
</script>

<template>
  <section :class="isSubsection ? 'form-subsection' : 'form-section'">
    <div v-if="!isSubsection" class="section-header">
      <h2>
        <span v-if="icon" class="icon">{{ icon }}</span>
        {{ title }}
      </h2>
    </div>
    <div v-else class="subsection-header">
      <h3 class="subsection-title">
        <span v-if="icon" class="subsection-icon">{{ icon }}</span>
        {{ title }}
      </h3>
    </div>

    <slot />
  </section>
</template>
