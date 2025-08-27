<script setup lang="ts">
import { ref, watch } from 'vue'
import { applyCurrencyMask } from '@/utils/formatters'

interface Props {
  modelValue: string
  placeholder?: string
  label?: string
  helperText?: string
  prefix?: string
  suffix?: string
  disabled?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'numericChange', numericValue: number): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  label: '',
  helperText: '',
  prefix: 'R$',
  suffix: '',
  disabled: false,
  readonly: false
})

const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue)

// Watch para sincronizar com o valor externo
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
}, { immediate: true })

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const maskedValue = applyCurrencyMask(target.value)
  localValue.value = maskedValue

  // Emitir o valor mascarado
  emit('update:modelValue', maskedValue)

  // Converter para número e emitir também
  const numericValue = maskedValue.replace(/\./g, '').replace(',', '.')
  emit('numericChange', parseFloat(numericValue) || 0)
}
</script>

<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="input-wrapper">
      <span v-if="prefix" class="input-prefix">{{ prefix }}</span>
      <input
        v-model="localValue"
        @input="handleInput"
        type="text"
        class="form-input"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
      >
      <span v-if="suffix" class="input-suffix">{{ suffix }}</span>
    </div>
    <small v-if="helperText" class="form-helper">{{ helperText }}</small>
  </div>
</template>
