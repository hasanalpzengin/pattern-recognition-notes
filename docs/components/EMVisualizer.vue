<template>
  <div class="em-container">
    <div class="controls">
      <label>
        Number of Clusters:
        <input v-model.number="k" type="range" min="2" max="4" step="1" @input="resetEM" />
        <span>{{ k }}</span>
      </label>
      <button @click="emStep">EM Step</button>
      <button @click="toggleAnimation">{{ isAnimating ? 'Pause' : 'Animate' }}</button>
      <button @click="resetEM">Reset</button>
    </div>

    <div class="chart-row">
      <div class="chart-item">
        <h4>Data with Cluster Assignments</h4>
        <div :id="`clusters-${componentId}`" class="chart"></div>
      </div>
      <div class="chart-item">
        <h4>Log-Likelihood</h4>
        <div :id="`likelihood-${componentId}`" class="chart"></div>
      </div>
    </div>

    <div class="stats">
      <p><strong>Iteration:</strong> {{ iteration }}</p>
      <p><strong>Log-Likelihood:</strong> {{ logLikelihood.toFixed(2) }}</p>
      <p><strong>Phase:</strong> {{ currentPhase }}</p>
    </div>

    <div class="info">
      <p><strong>EM Algorithm:</strong></p>
      <p><strong>E-step:</strong> Compute responsibilities (soft assignments)</p>
      <p><strong>M-step:</strong> Update cluster means, covariances, and mixing coefficients</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Cluster {
  mean: [number, number]
  cov: [[number, number], [number, number]]
  pi: number
}

const componentId = ref(Math.random().toString(36).substr(2, 9))
const k = ref(2)
const iteration = ref(0)
const logLikelihood = ref(0)
const isAnimating = ref(false)
const currentPhase = ref('E-step')

let animationId: NodeJS.Timeout | null = null
let data: [number, number][] = []
let clusters: Cluster[] = []
let responsibilities: number[][] = []
let likelihood_history: number[] = []

const generateData = () => {
  data = []
  // Generate data from k clusters
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
  
  for (let c = 0; c < k.value; c++) {
    const cx = (Math.random() + c) * (4 / k.value)
    const cy = (Math.random() + c) * (4 / k.value)
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * 2 * Math.PI
      const r = Math.random() * 0.4
      data.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)])
    }
  }
}

const initializeClusters = () => {
  clusters = []
  for (let c = 0; c < k.value; c++) {
    clusters.push({
      mean: [(Math.random() * 4), (Math.random() * 4)],
      cov: [[1, 0], [0, 1]],
      pi: 1 / k.value
    })
  }
  responsibilities = data.map(() => Array(k.value).fill(1 / k.value))
}

const multivarGaussian = (x: [number, number], mean: [number, number], cov: [[number, number], [number, number]]) => {
  const dx = x[0] - mean[0]
  const dy = x[1] - mean[1]
  const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0]
  const inv00 = cov[1][1] / det
  const inv01 = -cov[0][1] / det
  const inv11 = cov[0][0] / det
  const quad = inv00 * dx * dx + 2 * inv01 * dx * dy + inv11 * dy * dy
  return Math.exp(-0.5 * quad) / (2 * Math.PI * Math.sqrt(Math.abs(det)))
}

const estep = () => {
  for (let i = 0; i < data.length; i++) {
    let sum = 0
    for (let c = 0; c < k.value; c++) {
      const prob = clusters[c].pi * multivarGaussian(data[i], clusters[c].mean, clusters[c].cov)
      responsibilities[i][c] = prob
      sum += prob
    }
    for (let c = 0; c < k.value; c++) {
      responsibilities[i][c] /= sum || 1
    }
  }
  currentPhase.value = 'M-step'
}

const mstep = () => {
  for (let c = 0; c < k.value; c++) {
    let nk = 0
    let meanX = 0, meanY = 0
    
    for (let i = 0; i < data.length; i++) {
      nk += responsibilities[i][c]
      meanX += responsibilities[i][c] * data[i][0]
      meanY += responsibilities[i][c] * data[i][1]
    }
    
    clusters[c].pi = nk / data.length
    clusters[c].mean = [meanX / nk, meanY / nk]
    
    let covX2 = 0, covY2 = 0, covXY = 0
    for (let i = 0; i < data.length; i++) {
      const dx = data[i][0] - clusters[c].mean[0]
      const dy = data[i][1] - clusters[c].mean[1]
      covX2 += responsibilities[i][c] * dx * dx
      covY2 += responsibilities[i][c] * dy * dy
      covXY += responsibilities[i][c] * dx * dy
    }
    clusters[c].cov = [[covX2 / nk, covXY / nk], [covXY / nk, covY2 / nk]]
  }
  
  let ll = 0
  for (let i = 0; i < data.length; i++) {
    let prob = 0
    for (let c = 0; c < k.value; c++) {
      prob += clusters[c].pi * multivarGaussian(data[i], clusters[c].mean, clusters[c].cov)
    }
    ll += Math.log(prob + 1e-10)
  }
  logLikelihood.value = ll
  likelihood_history.push(ll)
  
  iteration.value++
  currentPhase.value = 'E-step'
  updateVisualizations()
}

const emStep = () => {
  estep()
  mstep()
}

const toggleAnimation = () => {
  if (isAnimating.value) {
    if (animationId) clearInterval(animationId)
    isAnimating.value = false
  } else {
    isAnimating.value = true
    animationId = setInterval(() => {
      if (iteration.value < 30) {
        emStep()
      } else {
        isAnimating.value = false
        if (animationId) clearInterval(animationId)
      }
    }, 200)
  }
}

const resetEM = () => {
  if (animationId) clearInterval(animationId)
  isAnimating.value = false
  iteration.value = 0
  logLikelihood.value = 0
  likelihood_history = []
  generateData()
  initializeClusters()
  updateVisualizations()
}

const updateVisualizations = () => {
  if (typeof window === 'undefined' || !window.Plotly) return

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
  
  // Cluster plot with soft assignments and covariance ellipses
  const traces = []
  
  for (let c = 0; c < k.value; c++) {
    // Plot all points with opacity based on responsibility
    const xs: number[] = []
    const ys: number[] = []
    const opacities: number[] = []
    
    for (let i = 0; i < data.length; i++) {
      xs.push(data[i][0])
      ys.push(data[i][1])
      opacities.push(0.3 + 0.6 * responsibilities[i][c])
    }
    
    traces.push({
      x: xs,
      y: ys,
      mode: 'markers',
      type: 'scatter',
      name: `Cluster ${c + 1}`,
      marker: { 
        size: 6, 
        color: colors[c],
        opacity: 0.6
      },
      showlegend: true,
      hovertemplate: `Responsibility: %{customdata.toFixed(2)}<extra></extra>`,
      customdata: responsibilities.map(r => r[c])
    })
    
    // Add cluster center (star marker)
    traces.push({
      x: [clusters[c].mean[0]],
      y: [clusters[c].mean[1]],
      mode: 'markers',
      type: 'scatter',
      marker: { size: 14, color: colors[c], symbol: 'star', line: { color: '#333', width: 2 } },
      showlegend: false,
      name: `Center ${c + 1}`
    })
    
    // Add covariance ellipse (1 standard deviation)
    const cov = clusters[c].cov
    const eigvals_approx = [(cov[0][0] + cov[1][1]) / 2, (cov[0][0] - cov[1][1]) / 2]
    const eig1 = Math.sqrt(Math.max(0, eigvals_approx[0] + eigvals_approx[1]))
    const eig2 = Math.sqrt(Math.max(0, eigvals_approx[0] - eigvals_approx[1]))
    
    // Draw ellipse
    const angle_step = Math.PI / 20
    const ellipse_x: number[] = []
    const ellipse_y: number[] = []
    
    for (let angle = 0; angle < 2 * Math.PI; angle += angle_step) {
      const x_ell = eig1 * Math.cos(angle)
      const y_ell = eig2 * Math.sin(angle)
      ellipse_x.push(clusters[c].mean[0] + x_ell)
      ellipse_y.push(clusters[c].mean[1] + y_ell)
    }
    ellipse_x.push(ellipse_x[0])
    ellipse_y.push(ellipse_y[0])
    
    traces.push({
      x: ellipse_x,
      y: ellipse_y,
      mode: 'lines',
      type: 'scatter',
      line: { color: colors[c], width: 2, dash: 'dash' },
      showlegend: false
    })
  }

  const layout1 = {
    title: `Gaussian Mixture Model (k=${k.value}, Iteration ${iteration.value})`,
    xaxis: { title: 'Feature 1', range: [-0.5, 4.5] },
    yaxis: { title: 'Feature 2', range: [-0.5, 4.5] },
    width: 450,
    height: 450,
    showlegend: true
  }

  window.Plotly.newPlot(`clusters-${componentId.value}`, traces, layout1, { responsive: true })

  // Likelihood plot with proper convergence tracking
  const iterArray = Array.from({ length: likelihood_history.length }, (_, i) => i)
  const llTrace = {
    x: iterArray,
    y: likelihood_history,
    mode: 'lines+markers',
    type: 'scatter',
    name: 'Log-Likelihood',
    line: { color: '#4ECDC4', width: 2 },
    marker: { size: 5, color: '#4ECDC4' }
  }

  const layout2 = {
    title: 'Log-Likelihood Convergence (Should be monotonically increasing)',
    xaxis: { title: 'EM Iteration' },
    yaxis: { title: 'Log-Likelihood' },
    width: 450,
    height: 450,
    showlegend: true
  }

  window.Plotly.newPlot(`likelihood-${componentId.value}`, [llTrace], layout2, { responsive: true })
}

onMounted(() => {
  resetEM()
})
</script>

<style scoped>
.em-container {
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

.controls input {
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

.controls span {
  font-weight: 600;
  color: #333;
  min-width: 30px;
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
  border-left: 4px solid #45B7D1;
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

.info {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-left: 4px solid #FFA07A;
  border-radius: 4px;
}

.info p {
  margin: 6px 0;
  font-size: 14px;
  color: #666;
}
</style>
