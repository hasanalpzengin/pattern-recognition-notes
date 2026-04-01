<template>
  <div class="optimization-container">
    <div class="controls">
      <label>
        Learning Rate:
        <input v-model.number="learningRate" type="range" min="0.001" max="0.2" step="0.01" @input="resetOptimization" />
        <span>{{ learningRate.toFixed(3) }}</span>
      </label>
      <label>
        Optimization Method:
        <select v-model="method" @change="resetOptimization">
          <option value="gd">Gradient Descent</option>
          <option value="momentum">Momentum</option>
          <option value="nesterov">Nesterov</option>
        </select>
      </label>
      <button @click="stepOptimization">Step</button>
      <button @click="toggleAnimation">{{ isAnimating ? 'Pause' : 'Animate' }}</button>
      <button @click="resetOptimization">Reset</button>
    </div>

    <div class="chart-row">
      <div class="chart-item">
        <h4>Loss Function (Contour)</h4>
        <div :id="`contour-${componentId}`" class="chart"></div>
      </div>
      <div class="chart-item">
        <h4>Loss Over Iterations</h4>
        <div :id="`loss-${componentId}`" class="chart"></div>
      </div>
    </div>

    <div class="stats">
      <p><strong>Iteration:</strong> {{ iteration }}</p>
      <p><strong>Current Loss:</strong> {{ currentLoss.toFixed(6) }}</p>
      <p><strong>Method:</strong> {{ methodLabel }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const componentId = ref(Math.random().toString(36).substr(2, 9))
const learningRate = ref(0.1)
const method = ref('gd')
const isAnimating = ref(false)
const iteration = ref(0)
const currentLoss = ref(0)

const methodLabel = computed(() => {
  const labels = {
    gd: 'Gradient Descent',
    momentum: 'Momentum (β=0.9)',
    nesterov: 'Nesterov Accelerated Gradient'
  }
  return labels[method.value as keyof typeof labels]
})

let animationId: NodeJS.Timeout | null = null
let x = 4.5
let y = 4.5
let vx = 0
let vy = 0
let lossHistory: number[] = []

// Non-convex loss function: Beale's function (with modifications for better visualization)
const nonConvexLoss = (px: number, py: number) => {
  const a = px - 3
  const b = py - 2
  return (1.5 - px + px * py) ** 2 + (2.25 - px + px * py * py) ** 2 + (2.625 - px + px * py ** 3) ** 2 + 0.1 * (a * a + b * b)
}

// Gradient of the loss function (numerical approximation for accuracy)
const gradientLoss = (px: number, py: number) => {
  const eps = 1e-5
  const dx = (nonConvexLoss(px + eps, py) - nonConvexLoss(px - eps, py)) / (2 * eps)
  const dy = (nonConvexLoss(px, py + eps) - nonConvexLoss(px, py - eps)) / (2 * eps)
  return { dx, dy }
}

const stepOptimization = () => {
  const grad = gradientLoss(x, y)
  
  if (method.value === 'gd') {
    x -= learningRate.value * grad.dx
    y -= learningRate.value * grad.dy
  } else if (method.value === 'momentum') {
    const beta = 0.9
    vx = beta * vx - learningRate.value * grad.dx
    vy = beta * vy - learningRate.value * grad.dy
    x += vx
    y += vy
  } else if (method.value === 'nesterov') {
    const beta = 0.9
    const gradAhead = gradientLoss(x - beta * vx, y - beta * vy)
    vx = beta * vx - learningRate.value * gradAhead.dx
    vy = beta * vy - learningRate.value * gradAhead.dy
    x += vx
    y += vy
  }

  currentLoss.value = nonConvexLoss(x, y)
  lossHistory.push(currentLoss.value)
  iteration.value++
  updateVisualizations()
}

const toggleAnimation = () => {
  if (isAnimating.value) {
    if (animationId) clearInterval(animationId)
    isAnimating.value = false
  } else {
    isAnimating.value = true
    animationId = setInterval(() => {
      if (iteration.value < 100) {
        stepOptimization()
      } else {
        isAnimating.value = false
        if (animationId) clearInterval(animationId)
      }
    }, 100)
  }
}

const resetOptimization = () => {
  if (animationId) clearInterval(animationId)
  isAnimating.value = false
  x = 4.5
  y = 4.5
  vx = 0
  vy = 0
  lossHistory = []
  iteration.value = 0
  currentLoss.value = nonConvexLoss(x, y)
  lossHistory.push(currentLoss.value)
  updateVisualizations()
}

const updateVisualizations = () => {
  if (typeof window === 'undefined' || !window.Plotly) return

  // Contour plot - wider range to see the non-convex landscape
  const xRange = Array.from({ length: 35 }, (_, i) => -0.5 + (i / 34) * 6.5)
  const yRange = Array.from({ length: 35 }, (_, i) => -0.5 + (i / 34) * 6.5)
  
  const z = xRange.map(xi => yRange.map(yi => nonConvexLoss(xi, yi)))

  const contourTrace = {
    x: xRange,
    y: yRange,
    z: z,
    type: 'contour',
    colorscale: 'Viridis',
    showscale: true,
    colorbar: { title: 'Loss' },
    contours: { coloring: 'heatmap', showlabels: false }
  }

  const pathTrace = {
    x: [x],
    y: [y],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 12, color: '#FF6B6B', symbol: 'star' },
    name: 'Current Position'
  }

  const layout1 = {
    title: 'Optimization Path',
    xaxis: { title: 'x' },
    yaxis: { title: 'y' },
    width: 400,
    height: 400
  }

  window.Plotly.newPlot(`contour-${componentId.value}`, [contourTrace, pathTrace], layout1, { responsive: true })

  // Loss curve
  const iterationArray = Array.from({ length: lossHistory.length }, (_, i) => i)
  const lossTrace = {
    x: iterationArray,
    y: lossHistory,
    mode: 'lines+markers',
    type: 'scatter',
    name: 'Loss',
    line: { color: '#4ECDC4', width: 2 },
    marker: { size: 4 }
  }

  const layout2 = {
    title: 'Loss Convergence',
    xaxis: { title: 'Iteration' },
    yaxis: { title: 'Loss Value' },
    width: 400,
    height: 400,
    yaxis2: { type: 'log' }
  }

  window.Plotly.newPlot(`loss-${componentId.value}`, [lossTrace], layout2, { responsive: true })
}

onMounted(() => {
  resetOptimization()
})

watch(() => learningRate.value, () => {
  resetOptimization()
})
</script>

<style scoped>
.optimization-container {
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
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.controls input,
.controls select {
  padding: 5px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.controls button {
  padding: 6px 16px;
  background: #4ECDC4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.controls button:hover {
  background: #3ab9b0;
}

.controls button:active {
  transform: scale(0.98);
}

.controls span {
  font-weight: 600;
  color: #333;
  min-width: 50px;
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

.stats {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-left: 4px solid #4ECDC4;
  border-radius: 4px;
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.stats p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.stats strong {
  color: #333;
}
</style>
