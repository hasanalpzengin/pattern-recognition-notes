<template>
  <div class="plotly-container">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div v-if="description" class="chart-description">{{ description }}</div>
    <div :id="chartId" class="plotly-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  data?: any[]
  layout?: any
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  layout: () => ({})
})

const chartId = ref(`plotly-${Math.random().toString(36).substr(2, 9)}`)

onMounted(() => {
  renderChart()
})

watch(() => [props.data, props.layout], () => {
  renderChart()
}, { deep: true })

const renderChart = () => {
  if (typeof window !== 'undefined' && window.Plotly) {
    const defaultLayout = {
      autosize: true,
      margin: { l: 50, r: 50, t: 50, b: 50 },
      paper_bgcolor: '#f9f9f9',
      plot_bgcolor: '#fff',
      font: { family: 'sans-serif', size: 12 },
      ...props.layout
    }
    
    window.Plotly.newPlot(chartId.value, props.data, defaultLayout, {
      responsive: true,
      displayModeBar: true,
      displaylogo: false
    })
  }
}
</script>

<style scoped>
.plotly-container {
  margin: 20px 0;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.chart-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.plotly-chart {
  width: 100%;
  min-height: 400px;
}

@media (max-width: 768px) {
  .plotly-chart {
    min-height: 300px;
  }
}
</style>
