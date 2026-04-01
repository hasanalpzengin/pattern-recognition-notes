<template>
  <div class="math-container">
    <div class="math-content" :style="{ textAlign: align }">
      <div 
        v-if="!isInline"
        class="math-block"
        v-html="renderedEquation"
      ></div>
      <span 
        v-else
        class="math-inline"
        v-html="renderedEquation"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  equation: string
  inline?: boolean
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  align: 'center'
})

const isInline = computed(() => props.inline)

const renderedEquation = computed(() => {
  if (window.MathJax) {
    return `\\(${props.equation}\\)` // For inline
  }
  return props.equation
})

onMounted(() => {
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise()
  }
})

watch(() => props.equation, () => {
  if (window.MathJax?.typesetPromise) {
    setTimeout(() => {
      window.MathJax.typesetPromise()
    }, 100)
  }
})
</script>

<style scoped>
.math-container {
  margin: 1.5rem 0;
}

.math-block {
  padding: 1.5rem;
  background: var(--vp-c-bg-muted);
  border-left: 4px solid var(--vp-c-brand);
  border-radius: 4px;
  overflow-x: auto;
  display: flex;
  justify-content: center;
  font-size: 1.1rem;
}

.math-inline {
  font-size: 1rem;
  padding: 0.2em 0.4em;
}

.dark .math-block {
  background: #2a2a2a;
  border-left-color: var(--vp-c-brand-highlight);
}
</style>
