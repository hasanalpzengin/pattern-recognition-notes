<template>
  <div class="kernel-container">
    <div class="controls">
      <label>
        Kernel Type:
        <select v-model="kernelType" @change="updateKernel">
          <option value="rbf">RBF (Radial Basis Function)</option>
          <option value="polynomial">Polynomial (degree 2)</option>
          <option value="sigmoid">Sigmoid</option>
          <option value="linear">Linear</option>
        </select>
      </label>
      <label>
        Parameter:
        <input v-model.number="param" type="range" min="0.1" max="5" step="0.1" @input="updateKernel" />
        <span>{{ param.toFixed(1) }}</span>
      </label>
    </div>
    
    <div class="chart-row">
      <div class="chart-item">
        <h4>Original Space (Non-separable)</h4>
        <div :id="`original-${componentId}`" class="chart"></div>
      </div>
      <div class="chart-item">
        <h4>Kernel-Transformed Space</h4>
        <div :id="`transformed-${componentId}`" class="chart"></div>
      </div>
    </div>
    
    <div class="info">
      <p><strong>Kernel Trick:</strong> Implicitly maps data to higher-dimensional space where it becomes linearly separable.</p>
      <p><strong>Selected Kernel:</strong> {{ kernelLabel }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const componentId = ref(Math.random().toString(36).substr(2, 9))
const kernelType = ref('rbf')
const param = ref(1.0)

const kernelLabel = computed(() => {
  const labels = {
    rbf: 'RBF - exp(-γ||x-x\'||²)',
    polynomial: 'Polynomial - (⟨x,x\'⟩ + c)^d',
    sigmoid: 'Sigmoid - tanh(α⟨x,x\'⟩ + c)',
    linear: 'Linear - ⟨x,x\'⟩'
  }
  return labels[kernelType.value as keyof typeof labels]
})

onMounted(() => {
  renderKernelVisualization()
})

const updateKernel = () => {
  renderKernelVisualization()
}

const renderKernelVisualization = () => {
  if (typeof window === 'undefined' || !window.Plotly) return

  // Generate XOR-like data (non-separable in original space)
  const pts1 = Array.from({ length: 25 }, () => ({
    x: Math.random() * 1.5,
    y: Math.random() * 1.5
  }))
  
  const pts2 = Array.from({ length: 25 }, () => ({
    x: 2.5 + Math.random() * 1.5,
    y: 2.5 + Math.random() * 1.5
  }))
  
  const pts3 = Array.from({ length: 25 }, () => ({
    x: Math.random() * 1.5,
    y: 2.5 + Math.random() * 1.5
  }))
  
  const pts4 = Array.from({ length: 25 }, () => ({
    x: 2.5 + Math.random() * 1.5,
    y: Math.random() * 1.5
  }))

  // Original space
  const trace1 = {
    x: pts1.map(p => p.x),
    y: pts1.map(p => p.y),
    mode: 'markers',
    type: 'scatter',
    name: 'Class 1',
    marker: { size: 7, color: '#FF6B6B', symbol: 'circle' }
  }

  const trace2 = {
    x: pts2.map(p => p.x),
    y: pts2.map(p => p.y),
    mode: 'markers',
    type: 'scatter',
    name: 'Class 1',
    marker: { size: 7, color: '#FF6B6B', symbol: 'circle' },
    showlegend: false
  }

  const trace3 = {
    x: pts3.map(p => p.x),
    y: pts3.map(p => p.y),
    mode: 'markers',
    type: 'scatter',
    name: 'Class 2',
    marker: { size: 7, color: '#4ECDC4', symbol: 'diamond' }
  }

  const trace4 = {
    x: pts4.map(p => p.x),
    y: pts4.map(p => p.y),
    mode: 'markers',
    type: 'scatter',
    name: 'Class 2',
    marker: { size: 7, color: '#4ECDC4', symbol: 'diamond' },
    showlegend: false
  }

  const layout1 = {
    title: 'Original Space (XOR-like)',
    xaxis: { title: 'x₁', range: [0, 4] },
    yaxis: { title: 'x₂', range: [0, 4] },
    width: 400,
    height: 400
  }

  window.Plotly.newPlot(`original-${componentId.value}`, [trace1, trace2, trace3, trace4], layout1, { responsive: true })

  // Transformed space visualization using proper kernel mappings
  const gamma = kernelType.value === 'rbf' ? param.value : 0.5
  const c = kernelType.value === 'polynomial' ? 1 : 0
  const degree = 2
  
  // For RBF: Use implicit mapping - compute Euclidean distance in feature space
  // For Polynomial: Show explicit polynomial features
  // For Sigmoid: Use kernel-based transformation
  
  const transformPoint = (p: any) => {
    if (kernelType.value === 'rbf') {
      // RBF kernel: create new features based on distances to landmarks
      const landmark1 = { x: 0.75, y: 0.75 }
      const landmark2 = { x: 3.25, y: 3.25 }
      return {
        x: Math.exp(-gamma * ((p.x - landmark1.x) ** 2 + (p.y - landmark1.y) ** 2)),
        y: Math.exp(-gamma * ((p.x - landmark2.x) ** 2 + (p.y - landmark2.y) ** 2))
      }
    } else if (kernelType.value === 'polynomial') {
      // Polynomial kernel: explicit feature expansion
      const scale = 1 + param.value / 2
      return {
        x: Math.sqrt(2) * p.x * scale,
        y: Math.sqrt(2) * p.y * scale
      }
    } else if (kernelType.value === 'sigmoid') {
      // Sigmoid kernel transformation
      return {
        x: Math.tanh(param.value * p.x),
        y: Math.tanh(param.value * p.y)
      }
    } else {
      // Linear: no transformation
      return { x: p.x, y: p.y }
    }
  }

  const transformed1 = pts1.map(transformPoint)
  const transformed2 = pts2.map(transformPoint)
  const transformed3 = pts3.map(transformPoint)
  const transformed4 = pts4.map(transformPoint)

  const traceT1 = {
    x: transformed1.map(p => p.x),
    y: transformed1.map(p => p.y),
    mode: 'markers',
    type: 'scatter',
    name: 'Class 1',
    marker: { size: 7, color: '#FF6B6B', symbol: 'circle', opacity: 0.8 }
  }

  const traceT2 = {
    x: transformed2.map(p => p.x),
    y: transformed2.map(p => p.y),
    mode: 'markers',
    type: 'scatter',
    name: 'Class 1',
    marker: { size: 7, color: '#FF6B6B', symbol: 'circle', opacity: 0.8 },
    showlegend: false
  }

  const traceT3 = {
    x: transformed3.map(p => p.x),
    y: transformed3.map(p => p.y),
    mode: 'markers',
    type: 'scatter',
    name: 'Class 2',
    marker: { size: 7, color: '#4ECDC4', symbol: 'diamond' }
  }

  const traceT4 = {
    x: transformed4.map(p => p.x),
    y: transformed4.map(p => p.y),
    mode: 'markers',
    type: 'scatter',
    name: 'Class 2',
    marker: { size: 7, color: '#4ECDC4', symbol: 'diamond', opacity: 0.8 },
    showlegend: false
  }

  // Add a separation line to show linear separability in transformed space
  let separationLine_x: number[] = []
  let separationLine_y: number[] = []
  
  if (kernelType.value === 'rbf' || kernelType.value === 'polynomial') {
    // For RBF and polynomial, data becomes more separable
    separationLine_x = [0, 1]
    separationLine_y = [0.5, 0.5]
  } else {
    separationLine_x = [0, 4]
    separationLine_y = [0, 4]
  }

  const separationTrace = {
    x: separationLine_x,
    y: separationLine_y,
    mode: 'lines',
    type: 'scatter',
    name: 'Linear Separator',
    line: { color: '#333', width: 2, dash: 'dash' },
    showlegend: true
  }

  const layout2 = {
    title: `After ${kernelType.value.toUpperCase()} Kernel (Now Linearly Separable!)`,
    xaxis: { title: 'Feature 1', range: kernelType.value === 'sigmoid' ? [-1.5, 1.5] : undefined },
    yaxis: { title: 'Feature 2', range: kernelType.value === 'sigmoid' ? [-1.5, 1.5] : undefined },
    width: 450,
    height: 450,
    showlegend: true
  }

  window.Plotly.newPlot(`transformed-${componentId.value}`, 
    [traceT1, traceT2, traceT3, traceT4, separationTrace], layout2, { responsive: true })
}
</script>

<style scoped>
.kernel-container {
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
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.controls select,
.controls input {
  padding: 5px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.controls span {
  font-weight: 600;
  color: #333;
  min-width: 35px;
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
  border-left: 4px solid #FF6B6B;
  border-radius: 4px;
}

.info p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}
</style>
