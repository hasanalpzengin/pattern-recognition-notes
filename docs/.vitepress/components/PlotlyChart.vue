<template>
  <div class="visualization-container">
    <h4 v-if="title" class="chart-title">{{ title }}</h4>
    <div :id="chartId" class="chart-wrapper" :style="{ height: height }"></div>
    <p v-if="description" class="chart-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  data: any[]
  layout?: any
  title?: string
  description?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '500px'
})

const chartId = computed(() => `chart-${Math.random().toString(36).substr(2, 9)}`)

onMounted(() => {
  if (window.Plotly) {
    const layout = {
      responsive: true,
      autosize: true,
      ...props.layout
    }
    
    window.Plotly.newPlot(chartId.value, props.data, layout, {
      responsive: true,
      displayModeBar: true
    })
  }
})

watch(() => props.data, (newData) => {
  if (window.Plotly) {
    const layout = {
      responsive: true,
      autosize: true,
      ...props.layout
    }
    
    window.Plotly.react(chartId.value, newData, layout, {
      responsive: true,
      displayModeBar: true
    })
  }
}, { deep: true })
</script>

<style scoped>
.visualization-container {
  margin: 2rem 0;
}

.chart-title {
  margin-top: 0;
  color: var(--vp-c-brand);
  font-size: 1.1rem;
  font-weight: 600;
}

.chart-wrapper {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dark .chart-wrapper {
  background: #2a2a2a;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.chart-description {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}
</style>
