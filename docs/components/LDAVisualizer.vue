<template>
  <div class="demo-container">
    <div class="controls">
      <label>
        <input v-model="selectedClass" type="number" min="0" max="2" step="1" />
        Class Focus (0=Both, 1=Class 1, 2=Class 2)
      </label>
    </div>
    
    <div class="chart-row">
      <div class="chart-item">
        <h4>Original Space</h4>
        <div :id="`scatter-${componentId}`" class="chart"></div>
      </div>
      <div class="chart-item">
        <h4>LDA Projection</h4>
        <div :id="`projection-${componentId}`" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const componentId = ref(Math.random().toString(36).substr(2, 9))
const selectedClass = ref(0)

onMounted(() => {
  generateLDASamples()
})

const generateLDASamples = () => {
  if (typeof window === 'undefined' || !window.Plotly) return

  // Generate sample data for 2 classes
  const class1X = Array.from({ length: 100 }, () => 2 + Math.random() * 1.5)
  const class1Y = Array.from({ length: 100 }, () => 2 + Math.random() * 1.5)
  
  const class2X = Array.from({ length: 100 }, () => 5 + Math.random() * 1.5)
  const class2Y = Array.from({ length: 100 }, () => 5 + Math.random() * 1.5)

  // Compute LDA discriminant
  // Mean vectors
  const m1x = class1X.reduce((a, b) => a + b) / class1X.length
  const m1y = class1Y.reduce((a, b) => a + b) / class1Y.length
  const m2x = class2X.reduce((a, b) => a + b) / class2X.length
  const m2y = class2Y.reduce((a, b) => a + b) / class2Y.length
  
  // Between-class scatter matrix (simplified)
  const Sb_xx = (m1x - m2x) ** 2
  const Sb_yy = (m1y - m2y) ** 2
  const Sb_xy = (m1x - m2x) * (m1y - m2y)
  
  // Within-class scatter matrix (simplified)
  let Sw_xx = 0, Sw_yy = 0, Sw_xy = 0
  class1X.forEach((x, i) => {
    Sw_xx += (x - m1x) ** 2
    Sw_yy += (class1Y[i] - m1y) ** 2
    Sw_xy += (x - m1x) * (class1Y[i] - m1y)
  })
  class2X.forEach((x, i) => {
    Sw_xx += (x - m2x) ** 2
    Sw_yy += (class2Y[i] - m2y) ** 2
    Sw_xy += (x - m2x) * (class2Y[i] - m2y)
  })
  
  // LDA direction: w ∝ Sw^(-1)(m2 - m1)
  // Simplified: use between-class direction
  const det = Sw_xx * Sw_yy - Sw_xy * Sw_xy
  const wx = (Sw_yy * (m2x - m1x) - Sw_xy * (m2y - m1y)) / (det + 1e-6)
  const wy = (-Sw_xy * (m2x - m1x) + Sw_xx * (m2y - m1y)) / (det + 1e-6)
  const w_norm = Math.sqrt(wx * wx + wy * wy)
  
  // Project data onto LDA direction
  const lda1 = class1X.map((x, i) => (x * wx + class1Y[i] * wy) / w_norm)
  const lda2 = class2X.map((x, i) => (x * wx + class2Y[i] * wy) / w_norm)

  // Original space scatter
  const trace1 = {
    x: class1X,
    y: class1Y,
    mode: 'markers',
    type: 'scatter',
    name: 'Class 1',
    marker: { size: 8, color: '#FF6B6B', opacity: 0.7 }
  }

  const trace2 = {
    x: class2X,
    y: class2Y,
    mode: 'markers',
    type: 'scatter',
    name: 'Class 2',
    marker: { size: 8, color: '#4ECDC4', opacity: 0.7 }
  }

  // LDA direction vector
  const arrow_scale = 2
  const directionTrace = {
    x: [m1x + m2x, m1x + m2x + wx / w_norm * arrow_scale],
    y: [m1y + m2y, m1y + m2y + wy / w_norm * arrow_scale],
    mode: 'lines+markers',
    type: 'scatter',
    name: 'LDA Direction',
    line: { color: '#333', width: 3 },
    marker: { size: 10, symbol: 'arrow', angleref: 'previous' },
    showlegend: true
  }

  const layout = {
    title: 'Original Feature Space with LDA Direction',
    xaxis: { title: 'Feature 1' },
    yaxis: { title: 'Feature 2' },
    width: 450,
    height: 450,
    showlegend: true
  }

  window.Plotly.newPlot(`scatter-${componentId.value}`, [trace1, trace2, directionTrace], layout, { responsive: true })

  // LDA Projection (1D)
  const trace3 = {
    y: lda1,
    x: Array.from({ length: lda1.length }, (_, i) => i),
    mode: 'markers',
    type: 'scatter',
    name: 'Class 1',
    marker: { size: 8, color: '#FF6B6B', opacity: 0.7 }
  }

  const trace4 = {
    y: lda2,
    x: Array.from({ length: lda2.length }, (_, i) => 100 + i),
    mode: 'markers',
    type: 'scatter',
    name: 'Class 2',
    marker: { size: 8, color: '#4ECDC4', opacity: 0.7 }
  }

  // Add class means
  const mean1LDA = lda1.reduce((a, b) => a + b) / lda1.length
  const mean2LDA = lda2.reduce((a, b) => a + b) / lda2.length

  const meanTrace1 = {
    x: [50],
    y: [mean1LDA],
    mode: 'markers',
    type: 'scatter',
    name: 'Class 1 Mean',
    marker: { size: 15, color: '#FF6B6B', symbol: 'line', line: { color: '#333', width: 2 } },
    showlegend: true
  }

  const meanTrace2 = {
    x: [150],
    y: [mean2LDA],
    mode: 'markers',
    type: 'scatter',
    name: 'Class 2 Mean',
    marker: { size: 15, color: '#4ECDC4', symbol: 'line', line: { color: '#333', width: 2 } },
    showlegend: true
  }

  const layout2 = {
    title: 'LDA 1D Projection (Maximizes Class Separability)',
    xaxis: { title: 'Sample Index' },
    yaxis: { title: 'LDA Projection' },
    width: 450,
    height: 450,
    showlegend: true
  }

  window.Plotly.newPlot(`projection-${componentId.value}`, [trace3, trace4, meanTrace1, meanTrace2], layout2, { responsive: true })
}
</script>

<style scoped>
.demo-container {
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.controls {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 4px;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.controls input {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.chart-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.chart-item {
  background: white;
  border-radius: 4px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-item h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
}

.chart {
  min-height: 300px;
}
</style>
