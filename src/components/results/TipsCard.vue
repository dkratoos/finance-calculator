<script setup lang="ts">
interface Tip {
  icon?: string
  title: string
  description: string
}

interface Props {
  title?: string
  tips: Tip[]
}

withDefaults(defineProps<Props>(), {
  title: '💡 Dicas Importantes'
})
</script>

<template>
  <div class="tips-card">
    <h3>{{ title }}</h3>
    <div class="tips-content">
      <div v-for="(tip, index) in tips" :key="index" class="tip-item">
        <strong>
          <span v-if="tip.icon">{{ tip.icon }} </span>{{ tip.title }}:
        </strong>
        {{ tip.description }}
      </div>
    </div>
  </div>
</template>
