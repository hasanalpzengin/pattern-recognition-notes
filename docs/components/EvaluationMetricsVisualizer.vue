<template>
  <div class="eval-container">
    <div class="controls">
      <label>Classification Threshold θ:
        <input v-model.number="threshold" type="range" min="0" max="1" step="0.01" @input="recompute" />
        <span>{{ threshold.toFixed(2) }}</span>
      </label>
      <label>Overlap σ (class separation):
        <input v-model.number="sigma" type="range" min="0.05" max="0.3" step="0.01" @input="regenerate" />
        <span>{{ sigma.toFixed(2) }}</span>
      </label>
      <button @click="regenerate">Regenerate Data</button>
    </div>

    <div class="chart-row">
      <div class="chart-item">
        <h4>Score Distributions &amp; Threshold</h4>
        <div :id="`dist-${cid}`" class="chart"></div>
      </div>
      <div class="chart-item">
        <h4>ROC Curve (AUC = {{ rocAUC.toFixed(3) }})</h4>
        <div :id="`roc-${cid}`" class="chart"></div>
      </div>
    </div>

    <div class="bottom-row">
      <div class="confusion-matrix">
        <h4>Confusion Matrix</h4>
        <table>
          <thead>
            <tr><th></th><th>Pred −</th><th>Pred +</th></tr>
          </thead>
          <tbody>
            <tr>
              <th>True −</th>
              <td class="tn">TN = {{ cm.tn }}</td>
              <td class="fp">FP = {{ cm.fp }}</td>
            </tr>
            <tr>
              <th>True +</th>
              <td class="fn">FN = {{ cm.fn }}</td>
              <td class="tp">TP = {{ cm.tp }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="metrics-grid">
        <div class="metric"><span class="mname">TPR / Recall</span><span class="mval">{{ m.tpr }}</span></div>
        <div class="metric"><span class="mname">FPR</span><span class="mval">{{ m.fpr }}</span></div>
        <div class="metric"><span class="mname">Specificity</span><span class="mval">{{ m.spec }}</span></div>
        <div class="metric"><span class="mname">Precision</span><span class="mval">{{ m.prec }}</span></div>
        <div class="metric"><span class="mname">F₁-Score</span><span class="mval">{{ m.f1 }}</span></div>
        <div class="metric"><span class="mname">Accuracy</span><span class="mval">{{ m.acc }}</span></div>
        <div class="metric"><span class="mname">NPV</span><span class="mval">{{ m.npv }}</span></div>
        <div class="metric"><span class="mname">AUC</span><span class="mval">{{ rocAUC.toFixed(3) }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const cid = ref(Math.random().toString(36).substr(2, 9))
const threshold = ref(0.5)
const sigma = ref(0.14)

interface CM { tp: number; fp: number; tn: number; fn: number }
const cm = reactive<CM>({ tp: 0, fp: 0, tn: 0, fn: 0 })
const m = reactive({ tpr: '0', fpr: '0', spec: '0', prec: '0', f1: '0', acc: '0', npv: '0' })
const rocAUC = ref(0)

let scores: { score: number; y: number }[] = []
let rocPts: { fpr: number; tpr: number }[] = []

function boxMuller(): number {
  const u1 = Math.random() + 1e-12, u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function clamp(v: number) { return Math.max(0, Math.min(1, v)) }

function generateData() {
  scores = []
  for (let i = 0; i < 150; i++) {
    scores.push({ score: clamp(0.35 + boxMuller() * sigma.value), y: 0 })
    scores.push({ score: clamp(0.65 + boxMuller() * sigma.value), y: 1 })
  }
  buildROC()
}

function buildROC() {
  const thresholds = Array.from({ length: 201 }, (_, i) => i / 200)
  rocPts = thresholds.map(t => {
    let tp = 0, fp = 0, fn = 0, tn = 0
    for (const s of scores) {
      const pred = s.score >= t ? 1 : 0
      if (s.y === 1 && pred === 1) tp++
      else if (s.y === 0 && pred === 1) fp++
      else if (s.y === 1 && pred === 0) fn++
      else tn++
    }
    const fpr = fp / ((fp + tn) || 1)
    const tpr = tp / ((tp + fn) || 1)
    return { fpr, tpr }
  }).reverse()

  // AUC via trapezoidal rule
  let auc = 0
  for (let i = 1; i < rocPts.length; i++) {
    const dx = rocPts[i].fpr - rocPts[i - 1].fpr
    auc += dx * (rocPts[i].tpr + rocPts[i - 1].tpr) / 2
  }
  rocAUC.value = Math.abs(auc)
}

function recompute() {
  let tp = 0, fp = 0, fn = 0, tn = 0
  for (const s of scores) {
    const pred = s.score >= threshold.value ? 1 : 0
    if (s.y === 1 && pred === 1) tp++
    else if (s.y === 0 && pred === 1) fp++
    else if (s.y === 1 && pred === 0) fn++
    else tn++
  }
  cm.tp = tp; cm.fp = fp; cm.fn = fn; cm.tn = tn

  const tpr = tp / ((tp + fn) || 1)
  const fpr = fp / ((fp + tn) || 1)
  const spec = tn / ((tn + fp) || 1)
  const prec = tp / ((tp + fp) || 1)
  const f1 = 2 * prec * tpr / ((prec + tpr) || 1)
  const acc = (tp + tn) / scores.length
  const npv = tn / ((tn + fn) || 1)

  const fmt = (v: number) => (v * 100).toFixed(1) + '%'
  m.tpr = fmt(tpr); m.fpr = fmt(fpr); m.spec = fmt(spec)
  m.prec = fmt(prec); m.f1 = fmt(f1); m.acc = fmt(acc); m.npv = fmt(npv)

  updateDistPlot()
  updateROCPlot(fpr, tpr)
}

function updateDistPlot() {
  if (typeof window === 'undefined' || !window.Plotly) return
  const neg = scores.filter(s => s.y === 0).map(s => s.score)
  const pos = scores.filter(s => s.y === 1).map(s => s.score)

  window.Plotly.newPlot(`dist-${cid.value}`, [
    { x: neg, type: 'histogram', name: 'Negative (y=0)', opacity: 0.6,
      marker: { color: '#3b82f6' }, histnorm: 'probability density', xbins: { size: 0.04 } },
    { x: pos, type: 'histogram', name: 'Positive (y=1)', opacity: 0.6,
      marker: { color: '#ef4444' }, histnorm: 'probability density', xbins: { size: 0.04 } },
    { x: [threshold.value, threshold.value], y: [0, 8], type: 'scatter', mode: 'lines',
      name: `θ = ${threshold.value.toFixed(2)}`, line: { color: '#f59e0b', width: 3, dash: 'dash' } }
  ], {
    title: '', barmode: 'overlay', margin: { t: 20, b: 40, l: 50, r: 20 },
    xaxis: { title: 'Classifier Score s(x)', range: [0, 1] },
    yaxis: { title: 'Density' }, showlegend: true
  }, { responsive: true })
}

function updateROCPlot(curFpr: number, curTpr: number) {
  if (typeof window === 'undefined' || !window.Plotly) return

  window.Plotly.newPlot(`roc-${cid.value}`, [
    { x: rocPts.map(p => p.fpr), y: rocPts.map(p => p.tpr), type: 'scatter', mode: 'lines',
      name: `ROC (AUC=${rocAUC.value.toFixed(3)})`, line: { color: '#4f46e5', width: 3 } },
    { x: [0, 1], y: [0, 1], type: 'scatter', mode: 'lines', name: 'Random',
      line: { color: '#9ca3af', width: 2, dash: 'dash' } },
    { x: [curFpr], y: [curTpr], type: 'scatter', mode: 'markers',
      name: `θ=${threshold.value.toFixed(2)}`, marker: { size: 14, color: '#f59e0b', symbol: 'diamond' } }
  ], {
    title: '', margin: { t: 20, b: 40, l: 50, r: 20 },
    xaxis: { title: 'FPR (1 - Specificity)', range: [0, 1] },
    yaxis: { title: 'TPR (Recall, Sensitivity)', range: [0, 1] },
    showlegend: true
  }, { responsive: true })
}

function regenerate() {
  generateData()
  recompute()
}

onMounted(() => {
  generateData()
  recompute()
})
</script>

<style scoped>
.eval-container { padding: 1rem; }
.controls { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; padding: 0.75rem; background: var(--vp-c-bg-soft); border-radius: 8px; margin-bottom: 1rem; }
.controls label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; }
.controls button { padding: 0.4rem 0.8rem; background: var(--vp-c-brand); color: #fff; border: none; border-radius: 6px; cursor: pointer; }
.chart-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.chart-item { flex: 1 1 340px; }
.chart-item h4 { margin: 0 0 0.5rem; font-size: 0.9rem; color: var(--vp-c-text-2); }
.chart { width: 100%; height: 280px; }
.bottom-row { display: flex; gap: 1rem; flex-wrap: wrap; }

.confusion-matrix { flex: 0 0 auto; }
.confusion-matrix h4 { margin: 0 0 0.5rem; font-size: 0.9rem; color: var(--vp-c-text-2); }
.confusion-matrix table { border-collapse: collapse; font-size: 0.88rem; }
.confusion-matrix th { padding: 0.5rem 0.75rem; background: var(--vp-c-bg-soft); }
.confusion-matrix td { padding: 0.75rem 1.25rem; font-weight: bold; text-align: center; border: 2px solid var(--vp-c-bg); }
.tp { background: #dcfce7; color: #166534; }
.tn { background: #dbeafe; color: #1e3a8a; }
.fp { background: #fee2e2; color: #991b1b; }
.fn { background: #fef9c3; color: #854d0e; }

.metrics-grid { flex: 1 1 320px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
.metric { display: flex; flex-direction: column; align-items: center; padding: 0.6rem; background: var(--vp-c-bg-soft); border-radius: 6px; }
.mname { font-size: 0.75rem; color: var(--vp-c-text-2); }
.mval { font-size: 1.1rem; font-weight: bold; color: var(--vp-c-brand); }
</style>
