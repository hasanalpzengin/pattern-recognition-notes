<template>
  <div class="svm-container">
    <div class="controls">
      <label>
        Regularization C:
        <input v-model.number="C" type="range" min="0.1" max="10" step="0.1" @input="updateSVM" />
        <span>{{ C.toFixed(1) }}</span>
      </label>
    </div>
    
    <div class="chart-row">
      <div class="chart-item">
        <h4>Hard Margin SVM (Linearly Separable)</h4>
        <div :id="`hard-margin-${componentId}`" class="chart"></div>
      </div>
      <div class="chart-item">
        <h4>Soft Margin SVM (C={{ C.toFixed(1) }})</h4>
        <div :id="`soft-margin-${componentId}`" class="chart"></div>
      </div>
    </div>
    
    <div class="info">
      <p><strong>Hard Margin:</strong> Only works with perfectly linearly separable data. Maximizes margin = 2/||w||.</p>
      <p><strong>Soft Margin:</strong> Allows violations controlled by C. Larger C = stricter margin enforcement, smaller C = more tolerance.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const componentId = ref(Math.random().toString(36).substr(2, 9))
const C = ref(1.0)

onMounted(() => {
  renderSVMs()
})

const updateSVM = () => {
  renderSVMs()
}

// Helper function to find optimal separating hyperplane
const findSeparatingHyperplane = (x1: number[], y1: number[], x2: number[], y2: number[]) => {
  // Compute centroids
  const c1x = x1.reduce((a, b) => a + b) / x1.length
  const c1y = y1.reduce((a, b) => a + b) / y1.length
  const c2x = x2.reduce((a, b) => a + b) / x2.length
  const c2y = y2.reduce((a, b) => a + b) / y2.length
  
  // Direction perpendicular to line connecting centroids
  const dx = c2x - c1x
  const dy = c2y - c1y
  const norm = Math.sqrt(dx * dx + dy * dy)
  
  // Normal to decision boundary (from class 1 to class 2)
  const nx = dx / norm
  const ny = dy / norm
  
  // Decision boundary passes through midpoint
  const mid_x = (c1x + c2x) / 2
  const mid_y = (c1y + c2y) / 2
  
  // Distance from each point to hyperplane
  const distances1 = x1.map((x, i) => (x - mid_x) * nx + (y1[i] - mid_y) * ny)
  const distances2 = x2.map((x, i) => (x - mid_x) * nx + (y2[i] - mid_y) * ny)
  
  // Find margin (distance to closest point)
  const minDist1 = Math.min(...distances1.map(Math.abs))
  const minDist2 = Math.min(...distances2.map(Math.abs))
  const margin = Math.min(minDist1, minDist2)
  
  return { nx, ny, mid_x, mid_y, margin, norm }
}

const renderSVMs = () => {
  if (typeof window === 'undefined' || !window.Plotly) return

  // Hard margin (linearly separable)
  const x1 = Array.from({ length: 30 }, () => 1 + Math.random() * 0.8)
  const y1 = Array.from({ length: 30 }, () => 1 + Math.random() * 0.8)
  
  const x2 = Array.from({ length: 30 }, () => 3.5 + Math.random() * 0.8)
  const y2 = Array.from({ length: 30 }, () => 3.5 + Math.random() * 0.8)

  const { nx: nx1, ny: ny1, mid_x: mx1, mid_y: my1, margin: margin1 } = findSeparatingHyperplane(x1, y1, x2, y2)
  
  // Perpendicular direction to normal (parallel to hyperplane)
  const px1 = -ny1
  const py1 = nx1

  // Boundary line endpoints
  const t = 2
  const x_boundary_hard = [mx1 - px1 * t, mx1 + px1 * t]
  const y_boundary_hard = [my1 - py1 * t, my1 + py1 * t]

  const trace1 = {
    x: x1,
    y: y1,
    mode: 'markers',
    type: 'scatter',
    name: 'Class 1',
    marker: { size: 8, color: '#FF6B6B', symbol: 'circle', opacity: 0.8 }
  }

  const trace2 = {
    x: x2,
    y: y2,
    mode: 'markers',
    type: 'scatter',
    name: 'Class 2',
    marker: { size: 8, color: '#4ECDC4', symbol: 'circle', opacity: 0.8 }
  }

  // Decision boundary
  const boundaryTrace = {
    x: x_boundary_hard,
    y: y_boundary_hard,
    mode: 'lines',
    type: 'scatter',
    name: 'Decision Boundary',
    line: { color: '#333', width: 3, dash: 'solid' },
    showlegend: true
  }

  // Margin lines (perpendicular offset)
  const margin_offset1_x = [mx1 - px1 * t - nx1 * margin1, mx1 + px1 * t - nx1 * margin1]
  const margin_offset1_y = [my1 - py1 * t - ny1 * margin1, my1 + py1 * t - ny1 * margin1]
  
  const margin_offset2_x = [mx1 - px1 * t + nx1 * margin1, mx1 + px1 * t + nx1 * margin1]
  const margin_offset2_y = [my1 - py1 * t + ny1 * margin1, my1 + py1 * t + ny1 * margin1]

  const marginTrace1 = {
    x: margin_offset1_x,
    y: margin_offset1_y,
    mode: 'lines',
    type: 'scatter',
    name: 'Margin',
    line: { color: '#999', width: 2, dash: 'dash' },
    showlegend: true
  }

  const marginTrace2 = {
    x: margin_offset2_x,
    y: margin_offset2_y,
    mode: 'lines',
    type: 'scatter',
    name: 'Margin',
    line: { color: '#999', width: 2, dash: 'dash' },
    showlegend: false
  }

  const layout = {
    title: 'Hard Margin SVM (Linearly Separable)',
    xaxis: { title: 'Feature 1', range: [0, 5] },
    yaxis: { title: 'Feature 2', range: [0, 5] },
    showlegend: true,
    hovermode: 'closest',
    width: 450,
    height: 450
  }

  window.Plotly.newPlot(`hard-margin-${componentId.value}`, 
    [trace1, trace2, boundaryTrace, marginTrace1, marginTrace2], layout, { responsive: true })

  // Soft margin with overlapping data
  const x3 = Array.from({ length: 35 }, (_, i) => i < 30 ? 1.2 + Math.random() * 1 : 2 + Math.random() * 0.8)
  const y3 = Array.from({ length: 35 }, (_, i) => i < 30 ? 1.2 + Math.random() * 1 : 2 + Math.random() * 0.8)
  
  const x4 = Array.from({ length: 35 }, (_, i) => i < 30 ? 3.3 + Math.random() * 1 : 2.5 + Math.random() * 0.8)
  const y4 = Array.from({ length: 35 }, (_, i) => i < 30 ? 3.3 + Math.random() * 1 : 2.5 + Math.random() * 0.8)

  const { nx: nx2, ny: ny2, mid_x: mx2, mid_y: my2, margin: margin2 } = findSeparatingHyperplane(x3, y3, x4, y4)
  
  const px2 = -ny2
  const py2 = nx2

  const x_boundary_soft = [mx2 - px2 * t, mx2 + px2 * t]
  const y_boundary_soft = [my2 - py2 * t, my2 + py2 * t]

  // Adjusted margin based on C parameter
  const margin_soft = margin2 * (10 / C.value) * 0.5

  const trace3 = {
    x: x3,
    y: y3,
    mode: 'markers',
    type: 'scatter',
    name: 'Class 1',
    marker: { size: 8, color: '#FF6B6B', symbol: 'circle', opacity: 0.8 },
    showlegend: false
  }

  const trace4 = {
    x: x4,
    y: y4,
    mode: 'markers',
    type: 'scatter',
    name: 'Class 2',
    marker: { size: 8, color: '#4ECDC4', symbol: 'circle', opacity: 0.8 },
    showlegend: false
  }

  const boundaryTrace2 = {
    x: x_boundary_soft,
    y: y_boundary_soft,
    mode: 'lines',
    type: 'scatter',
    name: 'Decision Boundary',
    line: { color: '#333', width: 3, dash: 'solid' },
    showlegend: false
  }

  const margin_soft_1_x = [mx2 - px2 * t - nx2 * margin_soft, mx2 + px2 * t - nx2 * margin_soft]
  const margin_soft_1_y = [my2 - py2 * t - ny2 * margin_soft, my2 + py2 * t - ny2 * margin_soft]
  
  const margin_soft_2_x = [mx2 - px2 * t + nx2 * margin_soft, mx2 + px2 * t + nx2 * margin_soft]
  const margin_soft_2_y = [my2 - py2 * t + ny2 * margin_soft, my2 + py2 * t + ny2 * margin_soft]

  const marginTrace3 = {
    x: margin_soft_1_x,
    y: margin_soft_1_y,
    mode: 'lines',
    type: 'scatter',
    line: { color: '#999', width: 2, dash: 'dash' },
    showlegend: false
  }

  const marginTrace4 = {
    x: margin_soft_2_x,
    y: margin_soft_2_y,
    mode: 'lines',
    type: 'scatter',
    line: { color: '#999', width: 2, dash: 'dash' },
    showlegend: false
  }

  const layout2 = {
    title: `Soft Margin SVM (C=${C.value.toFixed(1)}) - Larger C ⟹ Smaller Margin`,
    xaxis: { title: 'Feature 1', range: [0, 5] },
    yaxis: { title: 'Feature 2', range: [0, 5] },
    showlegend: false,
    hovermode: 'closest',
    width: 450,
    height: 450
  }

  window.Plotly.newPlot(`soft-margin-${componentId.value}`, 
    [trace3, trace4, boundaryTrace2, marginTrace3, marginTrace4], layout2, { responsive: true })
}
</script>

<style scoped>
.svm-container {
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
  flex: 1;
  max-width: 200px;
}

.controls span {
  font-weight: 600;
  color: #333;
  min-width: 40px;
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

.info {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-left: 4px solid #4ECDC4;
  border-radius: 4px;
}

.info p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}
</style>
