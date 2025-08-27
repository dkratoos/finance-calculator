<script setup lang="ts">
interface Props {
  message: string
  show?: boolean
}

withDefaults(defineProps<Props>(), {
  show: true
})
</script>

<template>
  <Transition name="error-slide">
    <div v-if="show && message" class="error-message">
      <div class="error-content">
        <span>{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
