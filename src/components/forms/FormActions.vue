<script setup lang="ts">
interface Props {
  clearText?: string
  submitText?: string
  clearIcon?: string
  submitIcon?: string
  isLoading?: boolean
}

interface Emits {
  (e: 'clear'): void
  (e: 'submit'): void
}

withDefaults(defineProps<Props>(), {
  clearText: 'LIMPAR',
  submitText: 'CALCULAR',
  clearIcon: '🗑️',
  submitIcon: '📊',
  isLoading: false
})

const emit = defineEmits<Emits>()

const handleClear = () => {
  emit('clear')
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<template>
  <div class="form-actions">
    <button
      type="button"
      @click="handleClear"
      class="btn btn-secondary"
      :disabled="isLoading"
    >
      {{ clearIcon }} {{ clearText }}
    </button>
    <button
      type="submit"
      @click="handleSubmit"
      class="btn btn-primary"
      :disabled="isLoading"
    >
      {{ submitIcon }} {{ submitText }}
    </button>
  </div>
</template>
