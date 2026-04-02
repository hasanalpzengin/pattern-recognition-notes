<template>
  <div class="lr-container">
    <div class="controls">
      <label>w₁:
        <input v-model.number="w1" type="range" min="-4" max="4" step="0.1" @input="updateManual" />
        <span>{{ w1.toFixed(1) }}</span>
      </label>
      <label>w₂:
        <input v-model.number="w2" type="range" min="-4" max="4" step="0.1" @input="updateManual" />
        <span>{{ w2.toFixed(1) }}</span>
      </label>
      <label>bias b:
        <input v-model.number="bias" type="range" min="-4" max="4" step="0.1" @input="updateManual" />
        <span>{{ bias.toFixed(1) }}</span>
      </label>
      <button @click="runTraining">Train (Gradient Ascent)</button>
      <button @click="resetParams">Reset</button>
    </div>

    <div class="chart-row">
      <div class="chart-item">
        <h4>Sigmoid σ(z) = 1 / (1 + e⁻ᶻ)</h4>
        <div :id="`sig-${cid}`" class="chart"></div>
      </div>
      <div class="chart-item">
        <h4>Decision Boundary in Feature Space</h4>
        <div :id="`db-${cid}`" class="chart"></div>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-item">
        <h4>Log-Likelihood During Training</h4>
        <div :id="`ll-${cid}`" class="chart"></div>
      </div>
      <div class="lr-info info">
        <p><strong>Model:</strong> p(y=1|x) = σ(w₁x₁ + w₂x₂ + b)</p>
        <p><strong>Boundary:</strong> w₁x₁ + w₂x₂ + b = 0</p>
        <p><strong>Gradient:</strong> ∇L(θ) = Σᵢ (yᵢ − σ(θᵀxᵢ)) xᵢ</p>
        <p><strong>Accuracy:</strong> {{ accuracy }}%</p>
        <p><strong>Log-Likelihood:</strong> {{ logLikelihood.toFixed(3) }}</p>
        <hr/>
        <p>Drag sliders to move the decision boundary.<br/>Click <em>Train</em> to fit the boundary to the data.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const cid = ref(Math.random().toString(36).substr(2, 9))
const w1 = ref(1.0)
const w2 = ref(1.0)
const bias = ref(-3.0)
const accuracy = ref(0)
const logLikelihood = ref(0)

let dataset: { x1: number; x2: number; y: number }[] = []
let llHistory: number[] = []
let animId: ReturnType<typeof setInterval> | null = null

// ─── data generation ────────────────────────────────────────────────
function boxMuller(): number {
  const u1 = Math.random(), u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1 + 1e-12)) * Math.cos(2 * Math.PI * u2)
}

function generateData() {
  dataset = []
  for (let i = 0; i < 60; i++) {
    dataset.push({ x1: 1.5 + boxMuller() * 0.8, x2: 1.5 + boxMuller() * 0.8, y: 0 })
  }
  for (let i = 0; i < 60; i++) {
    dataset.push({ x1: 3.5 + boxMuller() * 0.8, x2: 3.5 + boxMuller() * 0.8, y: 1 })
  }
}

// ─── math helpers ───────────────────────────────────────────────────
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))

function computeAccuracyAndLL(): { acc: number; ll: number } {
  let correct = 0
  let ll = 0
  for (const p of dataset) {
    const z = w1.value * p.x1 + w2.value * p.x2 + bias.value
    const prob = sigmoid(z)
    const pred = prob >= 0.5 ? 1 : 0
    if (pred === p.y) correct++
    ll += p.y * Math.log(prob + 1e-15) + (1 - p.y) * Math.log(1 - prob + 1e-15)
  }
  return { acc: Math.round((correct / dataset.length) * 100), ll }
}

// ─── training ───────────────────────────────────────────────────────
function runTraining() {
  resetParams()
  llHistory = []
  const lr = 0.05
  const steps = 80
  let step = 0

  if (animId) clearInterval(animId)
  animId = setInterval(() => {
    let gw1 = 0, gw2 = 0, gb = 0
    for (const p of dataset) {
      const z = w1.value * p.x1 + w2.value * p.x2 + bias.value
      const diff = p.y - sigmoid(z)
      gw1 += diff * p.x1
      gw2 += diff * p.x2
      gb  += diff
    }
    w1.value += lr * gw1
    w2.value += lr * gw2
    bias.value += lr * gb

    const { acc, ll } = computeAccuracyAndLL()
    accuracy.value = acc
    logLikelihood.value = ll
    llHistory.push(ll)

    updateBoundaryPlot()
    updateLLPlot()

    step++
    if (step >= steps) {
      if (animId) clearInterval(animId)
      animId = null
    }
  }, 60)
}

function resetParams() {
  if (animId) { clearInterval(animId); animId = null }
  w1.value = 0.5; w2.value = 0.5; bias.value = -2.0
  llHistory = []
  updateManual()
}

// ─── plots ──────────────────────────────────────────────────────────
function plotSigmoid() {
  if (typeof window === 'undefined' || !window.Plotly) return
  const zs = Array.from({ length: 200 }, (_, i) => -6 + i * 0.06)
  const ys = zs.map(sigmoid)

  window.Plotly.newPlot(`sig-${cid.value}`, [
    { x: zs, y: ys, type: 'scatter', mode: 'lines', name: 'σ(z)', line: { color: '#4f46e5', width: 3 } },
    { x: [0], y: [0.5], type: 'scatter', mode: 'markers', name: 'σ(0)=0.5', marker: { size: 10, color: '#ef4444' } },
    { x: [-6, 6], y: [0.5, 0.5], type: 'scatter', mode: 'lines', name: 'threshold', line: { color: '#f59e0b', width: 2, dash: 'dash' } }
  ], {
    title: '', margin: { t: 20, b: 40, l: 50, r: 20 },
    xaxis: { title: 'z = θᵀx', zeroline: true },
    yaxis: { title: 'σ(z) = p(y=1|x)', range: [-0.05, 1.05] },
    showlegend: true, legend: { x: 0.05, y: 0.95 }
  }, { responsive: true })
}

function updateBoundaryPlot() {
  if (typeof window === 'undefined' || !window.Plotly) return

  const c0 = dataset.filter(p => p.y === 0)
  const c1 = dataset.filter(p => p.y === 1)

  // Decision boundary: w1*x1 + w2*x2 + b = 0  →  x2 = -(w1*x1 + b) / w2
  const x1range = [0, 6]
  let bx: number[] = []
  let by: number[] = []
  if (Math.abs(w2.value) > 0.01) {
    bx = x1range
    by = x1range.map(x => -(w1.value * x + bias.value) / w2.value)
  } else {
    const xConst = -bias.value / (w1.value + 1e-9)
    bx = [xConst, xConst]; by = [0, 6]
  }

  window.Plotly.newPlot(`db-${cid.value}`, [
    { x: c0.map(p => p.x1), y: c0.map(p => p.x2), mode: 'markers', type: 'scatter', name: 'y=0', marker: { size: 8, color: '#3b82f6', opacity: 0.7 } },
    { x: c1.map(p => p.x1), y: c1.map(p => p.x2), mode: 'markers', type: 'scatter', name: 'y=1', marker: { size: 8, color: '#ef4444', opacity: 0.7 } },
    { x: bx, y: by, mode: 'lines', type: 'scatter', name: 'boundary', line: { color: '#1a1a1a', width: 3, dash: 'dash' } }
  ], {
    title: '', margin: { t: 20, b: 40, l: 50, r: 20 },
    xaxis: { title: 'x₁', range: [0, 6] },
    yaxis: { title: 'x₂', range: [0, 6] },
    showlegend: true
  }, { responsive: true })
}

function updateLLPlot() {
  if (typeof window === 'undefined' || !window.Plotly) return
  const iters = Array.from({ length: llHistory.length }, (_, i) => i)
  window.Plotly.newPlot(`ll-${cid.value}`, [
    { x: iters, y: llHistory, type: 'scatter', mode: 'lines+markers', name: 'log-likelihood', line: { color: '#10b981', width: 2 }, marker: { size: 4 } }
  ], {
    title: '', margin: { t: 20, b: 40, l: 60, r: 20 },
    xaxis: { title: 'Gradient Ascent Step' },
    yaxis: { title: 'L(θ)' }
  }, { responsive: true })
}

function updateManual() {
  const { acc, ll } = computeAccuracyAndLL()
  accuracy.value = acc
  logLikelihood.value = ll
  llHistory = [ll]
  updateBoundaryPlot()
  updateLLPlot()
}

onMounted(() => {
  generateData()
  plotSigmoid()
  updateManual()
})

onBeforeUnmount(() => {
  if (animId) clearInterval(animId)
})
</script>

<style scoped>
.lr-container { padding: 1rem; }
.controls { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; padding: 0.75rem; background: var(--vp-c-bg-soft); border-radius: 8px; margin-bottom: 1rem; }
.controls label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; }
.controls button { padding: 0.4rem 0.8rem; border-radius: 6px; background: var(--vp-c-brand); color: #fff; border: none; cursor: pointer; }
.chart-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.chart-item { flex: 1 1 340px; }
.chart-item h4 { margin: 0 0 0.5rem; font-size: 0.9rem; color: var(--vp-c-text-2); }
.chart { width: 100%; height: 280px; }
.lr-info.info { flex: 1 1 260px; padding: 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; font-size: 0.88rem; line-height: 1.7; }
.lr-info.info hr { border: none; border-top: 1px solid var(--vp-c-divider); margin: 0.75rem 0; }
</style>
