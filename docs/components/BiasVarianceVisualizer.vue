<template>
  <div class="bv-container">
    <div class="controls">
      <label>Polynomial Degree:
        <input v-model.number="degree" type="range" min="1" max="12" step="1" @input="fitAndPlot" />
        <span>{{ degree }}</span>
      </label>
      <label>Noise level:
        <input v-model.number="noiseLevel" type="range" min="0.05" max="0.6" step="0.05" @input="regenerate" />
        <span>{{ noiseLevel.toFixed(2) }}</span>
      </label>
      <label>Train samples:
        <input v-model.number="nTrain" type="range" min="8" max="40" step="4" @input="regenerate" />
        <span>{{ nTrain }}</span>
      </label>
      <button @click="regenerate">Resample</button>
    </div>

    <div class="chart-row">
      <div class="chart-item">
        <h4>Data &amp; Polynomial Fit (degree {{ degree }})</h4>
        <div :id="`fit-${cid}`" class="chart"></div>
      </div>
      <div class="chart-item">
        <h4>Train &amp; Test Error vs Polynomial Degree</h4>
        <div :id="`curve-${cid}`" class="chart"></div>
      </div>
    </div>

    <div class="bv-stats">
      <div class="stat-badge">
        <span class="sname">Train MSE</span>
        <span class="sval train">{{ trainMSE.toFixed(4) }}</span>
      </div>
      <div class="stat-badge">
        <span class="sname">Test MSE</span>
        <span class="sval test">{{ testMSE.toFixed(4) }}</span>
      </div>
      <div class="stat-badge">
        <span class="sname">Regime</span>
        <span class="sval" :class="regimeClass">{{ regime }}</span>
      </div>
      <div class="bv-hint info">
        <strong>Low degree</strong>: high bias, low variance — underfits.<br/>
        <strong>High degree</strong>: low bias, high variance — overfits.<br/>
        Ideal degree minimises <em>test</em> error.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const cid = ref(Math.random().toString(36).substr(2, 9))
const degree = ref(3)
const noiseLevel = ref(0.2)
const nTrain = ref(20)
const trainMSE = ref(0)
const testMSE = ref(0)

const regime = computed<string>(() => {
  if (trainMSE.value > 0.08) return 'Underfitting'
  if (testMSE.value > trainMSE.value * 3.5) return 'Overfitting'
  return 'Good fit'
})

const regimeClass = computed(() => ({
  under: regime.value === 'Underfitting',
  over: regime.value === 'Overfitting',
  good: regime.value === 'Good fit'
}))

const trueFunc = (x: number) => Math.sin(2 * Math.PI * x) * 0.8

let xTrain: number[] = []
let yTrain: number[] = []
let xTest: number[] = []
let yTest: number[] = []

function boxMuller(): number {
  return Math.sqrt(-2 * Math.log(Math.random() + 1e-12)) * Math.cos(2 * Math.PI * Math.random())
}

function generateData() {
  xTrain = Array.from({ length: nTrain.value }, () => Math.random())
  yTrain = xTrain.map(x => trueFunc(x) + noiseLevel.value * boxMuller())
  xTest = Array.from({ length: 60 }, () => Math.random())
  yTest = xTest.map(x => trueFunc(x) + noiseLevel.value * boxMuller())
}

// ── Vandermonde least-squares via normal equations ──────────────────
function vander(xs: number[], deg: number): number[][] {
  return xs.map(x => Array.from({ length: deg + 1 }, (_, i) => Math.pow(x, i)))
}

function matMul(A: number[][], B: number[][]): number[][] {
  const rows = A.length, cols = B[0].length, inner = B.length
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) =>
      Array.from({ length: inner }, (_, k) => A[i][k] * B[k][j]).reduce((a, b) => a + b, 0)
    )
  )
}

function transpose(A: number[][]): number[][] {
  return A[0].map((_, j) => A.map(row => row[j]))
}

function gaussSolve(A: number[][], b: number[]): number[] {
  const n = b.length
  const aug = A.map((row, i) => [...row.map((v, j) => v + (i === j ? 1e-8 : 0)), b[i]])
  for (let col = 0; col < n; col++) {
    let maxRow = col
    for (let r = col + 1; r < n; r++) if (Math.abs(aug[r][col]) > Math.abs(aug[maxRow][col])) maxRow = r;
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]]
    const piv = aug[col][col]
    if (Math.abs(piv) < 1e-12) continue
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const f = aug[r][col] / piv
      for (let j = col; j <= n; j++) aug[r][j] -= f * aug[col][j]
    }
    for (let j = col; j <= n; j++) aug[col][j] /= piv
  }
  return aug.map(row => row[n])
}

function polyFit(xs: number[], ys: number[], deg: number): number[] {
  const X = vander(xs, deg)
  const Xt = transpose(X)
  const XtX = matMul(Xt, X)
  const Xty = matMul(Xt, ys.map(y => [y])).map(r => r[0])
  return gaussSolve(XtX, Xty)
}

function polyEval(coeffs: number[], x: number): number {
  return coeffs.reduce((acc, c, i) => acc + c * Math.pow(x, i), 0)
}

function mse(xs: number[], ys: number[], coeffs: number[]): number {
  const err = xs.reduce((s, x, i) => s + (ys[i] - polyEval(coeffs, x)) ** 2, 0)
  return err / xs.length
}

function fitAndPlot() {
  if (typeof window === 'undefined' || !window.Plotly) return

  const coeffs = polyFit(xTrain, yTrain, degree.value)
  trainMSE.value = mse(xTrain, yTrain, coeffs)
  testMSE.value = mse(xTest, yTest, coeffs)

  // Fit curve
  const xDense = Array.from({ length: 200 }, (_, i) => i / 199)
  const yTrue = xDense.map(trueFunc)
  const yFit = xDense.map(x => polyEval(coeffs, x))

  window.Plotly.newPlot(`fit-${cid.value}`, [
    { x: xDense, y: yTrue, mode: 'lines', name: 'True function', line: { color: '#10b981', width: 3 } },
    { x: xTrain, y: yTrain, mode: 'markers', name: 'Train data', marker: { size: 8, color: '#3b82f6' } },
    { x: xTest, y: yTest, mode: 'markers', name: 'Test data', marker: { size: 6, color: '#f59e0b', opacity: 0.6 } },
    { x: xDense, y: yFit, mode: 'lines', name: `Degree ${degree.value}`, line: { color: '#ef4444', width: 2 } }
  ], {
    title: '', margin: { t: 20, b: 40, l: 50, r: 20 },
    xaxis: { title: 'x', range: [-0.05, 1.05] },
    yaxis: { title: 'y', range: [-1.5, 1.5] },
    showlegend: true
  }, { responsive: true })

  updateCurvePlot()
}

function updateCurvePlot() {
  if (typeof window === 'undefined' || !window.Plotly) return

  const maxDeg = 12
  const degs = Array.from({ length: maxDeg }, (_, i) => i + 1)
  const trainErrs: number[] = []
  const testErrs: number[] = []

  for (const d of degs) {
    try {
      const c = polyFit(xTrain, yTrain, d)
      trainErrs.push(Math.min(mse(xTrain, yTrain, c), 2))
      testErrs.push(Math.min(mse(xTest, yTest, c), 2))
    } catch {
      trainErrs.push(2); testErrs.push(2)
    }
  }

  window.Plotly.newPlot(`curve-${cid.value}`, [
    { x: degs, y: trainErrs, mode: 'lines+markers', name: 'Train MSE', line: { color: '#3b82f6', width: 3 }, marker: { size: 7 } },
    { x: degs, y: testErrs, mode: 'lines+markers', name: 'Test MSE', line: { color: '#ef4444', width: 3 }, marker: { size: 7 } },
    { x: [degree.value], y: [testErrs[degree.value - 1]], mode: 'markers', name: `d=${degree.value}`, marker: { size: 14, color: '#f59e0b', symbol: 'star' } }
  ], {
    title: '', margin: { t: 20, b: 40, l: 60, r: 20 },
    xaxis: { title: 'Polynomial Degree', dtick: 1 },
    yaxis: { title: 'MSE' },
    shapes: [{ type: 'line', x0: degree.value, x1: degree.value, y0: 0, y1: 2, line: { color: '#f59e0b', dash: 'dash', width: 2 } }],
    showlegend: true
  }, { responsive: true })
}

function regenerate() {
  generateData()
  fitAndPlot()
}

onMounted(() => {
  generateData()
  fitAndPlot()
})
</script>

<style scoped>
.bv-container { padding: 1rem; }
.controls { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; padding: 0.75rem; background: var(--vp-c-bg-soft); border-radius: 8px; margin-bottom: 1rem; }
.controls label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; }
.controls button { padding: 0.4rem 0.8rem; background: var(--vp-c-brand); color: #fff; border: none; border-radius: 6px; cursor: pointer; }
.chart-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.chart-item { flex: 1 1 340px; }
.chart-item h4 { margin: 0 0 0.5rem; font-size: 0.9rem; color: var(--vp-c-text-2); }
.chart { width: 100%; height: 300px; }
.bv-stats { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
.stat-badge { display: flex; flex-direction: column; align-items: center; padding: 0.6rem 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; }
.sname { font-size: 0.78rem; color: var(--vp-c-text-2); }
.sval { font-size: 1.15rem; font-weight: bold; }
.sval.train { color: #3b82f6; }
.sval.test { color: #ef4444; }
.sval.good { color: #10b981; }
.sval.over { color: #ef4444; }
.sval.under { color: #f59e0b; }
.bv-hint.info { flex: 1 1 280px; padding: 0.75rem 1rem; background: var(--vp-c-bg-soft); border-radius: 8px; font-size: 0.88rem; line-height: 1.7; }
</style>
