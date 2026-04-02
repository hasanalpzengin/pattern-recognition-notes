# Viola–Jones Face Detection

## Overview

The **Viola–Jones detector** (2001) was a landmark in real-time face detection. It combines three key ideas: **Haar-like features** computed via an integral image, **AdaBoost** for feature selection, and an **attentional cascade** for efficient rejection.

::: tip Mock Exam Connection
Q2.1 in the 2025 mock exam asks which Haar-like feature templates (shown as images A–D) are used by Viola–Jones. The text extraction of the PDF could not recover the figures, but the conceptual answer is clear: Viola–Jones uses rectangular two-region, three-region, and four-region Haar contrast features.
:::

---

## Haar-like Features

A Haar feature computes the difference in pixel sum between adjacent rectangles. Three canonical templates:

### Edge features (2-rectangle)
$$h = \sum_{\text{white}} - \sum_{\text{black}}$$

```
┌──────┬──────┐      ┌──────┐
│      │▓▓▓▓▓▓│      │▓▓▓▓▓▓│
│      │▓▓▓▓▓▓│      ├──────┤
└──────┴──────┘      │      │
 Horizontal edge     └──────┘
                     Vertical edge
```

### Line features (3-rectangle)
```
┌────┬──────┬────┐
│    │▓▓▓▓▓▓│    │
└────┴──────┴────┘
  Center-surround
```

### Diagonal features (4-rectangle)
```
┌────┬────┐
│    │▓▓▓▓│
├────┼────┤
│▓▓▓▓│    │
└────┴────┘
```

Each template can be placed anywhere in the detection window and scaled to any size $\Rightarrow$ a $24\times24$ window yields over **160,000** candidate features.

---

## Integral Image

Brute-force feature computation would be too slow. The **integral image** $I$ at pixel $(x, y)$ stores the sum of all pixels above and to the left:

$$I(x, y) = \sum_{x' \leq x,\ y' \leq y} \text{img}(x', y')$$

Any rectangle sum $\sum_R$ is obtained in **exactly 4 lookups**:

$$\sum_R = I(D) - I(B) - I(C) + I(A)$$

where $A, B, C, D$ are the four corners. This makes all Haar features $O(1)$ to evaluate regardless of rectangle size.

---

## AdaBoost Feature Selection

With 160k+ candidate features but only 24×24 input, we need to select the most discriminative few.

**AdaBoost** trains a weighted ensemble of **weak classifiers** (each: threshold one feature):

$$H(x) = \text{sign}\!\left(\sum_{t=1}^T \alpha_t h_t(x)\right)$$

Each round $t$:
1. Train weak classifier $h_t$ on the current sample weights
2. Compute weighted error $\varepsilon_t$
3. Set $\alpha_t = \frac{1}{2} \ln\!\left(\frac{1 - \varepsilon_t}{\varepsilon_t}\right)$
4. Increase weight of misclassified samples

The final strong classifier combines $T$ weighted weak classifiers.

<SVMVisualizer />

---

## Classifier Cascade (Rejection Stages)

Most sub-windows in an image are background — not faces. The cascade allows early rejection:

```
Input patch
   ↓
[Stage 1: 2 features] → Reject (not face) ──────────────┐
   ↓ Pass                                                 │
[Stage 2: 5 features] → Reject (not face) ───────────────┤
   ↓ Pass                                                 │
[Stage 3: 20 features] → Reject ─────────────────────────┤
   ↓ ...                                                  │
[Final stage] → Accept as FACE                            │
                                                          ▼
                                                     Discarded
```

- Each stage has high **recall** (almost all faces pass).
- Successive stages provide higher **precision**.
- The vast majority of patches are rejected at stage 1 with minimal computation.

---

## Properties Summary

| Component | Contribution |
|---|---|
| Haar features | Fast rectangular contrast descriptors |
| Integral image | $O(1)$ feature evaluation |
| AdaBoost | Select most discriminative features |
| Cascade | Real-time speed via early rejection |

---

## Visualisation — Haar Feature as Plotly

The chart below renders the four Haar template types using filled rectangles. White rectangles contribute $+1$, dark rectangles $-1$ to the feature response.

<PlotlyChart
  :data="haarData"
  :layout="haarLayout"
  title="Haar-like Feature Templates"
  description="The four canonical rectangular feature templates used in Viola–Jones"
/>

---

## Connection to Boosting (Exam Q1.1 2025)

AdaBoost fits the **boosting** paradigm:
- Combines many **weak** (barely > random) classifiers
- Each weighted by its error rate $\alpha_t$
- Final prediction is a **weighted vote**

> **Correct statement:** Boosting creates a combined prediction out of many weighted **weak** classifiers.

The terms "strong classifiers" (option A) and "best single classifier predicts" (option C) are both wrong about boosting — they describe other ensemble strategies.

---

<script setup lang="ts">
import { reactive } from 'vue'

// Build 4 Haar template subplots as rectangle shapes in Plotly
const makeTemplate = (xOff: number, whiteRects: number[][], darkRects: number[][], label: string) => {
  const shapes: any[] = []
  for (const [x0, y0, x1, y1] of whiteRects) {
    shapes.push({ type: 'rect', xref: 'x', yref: 'y', x0: x0 + xOff, y0, x1: x1 + xOff, y1, fillcolor: '#f8fafc', line: { color: '#334155', width: 2 } })
  }
  for (const [x0, y0, x1, y1] of darkRects) {
    shapes.push({ type: 'rect', xref: 'x', yref: 'y', x0: x0 + xOff, y0, x1: x1 + xOff, y1, fillcolor: '#1e293b', line: { color: '#334155', width: 2 } })
  }
  return shapes
}

const allShapes = [
  // Template 1: horizontal edge (2-rect)
  ...makeTemplate(0, [[0,0,1,2]], [[1,0,2,2]], 'Edge H'),
  // Template 2: vertical edge (2-rect)
  ...makeTemplate(2.5, [[0,1,2,2]], [[0,0,2,1]], 'Edge V'),
  // Template 3: line (3-rect)
  ...makeTemplate(5.5, [[0,0,0.7,2],[1.4,0,2,2]], [[0.7,0,1.4,2]], 'Line'),
  // Template 4: 4-rect diagonal
  ...makeTemplate(8, [[0,1,1,2],[1,0,2,1]], [[0,0,1,1],[1,1,2,2]], 'Diagonal'),
]

const haarData = reactive([
  { x: [1, 3.5, 6.5, 9], y: [-0.4, -0.4, -0.4, -0.4], mode: 'text',
    text: ['Edge (H)', 'Edge (V)', 'Line', 'Diagonal'],
    textfont: { size: 13, color: '#334155' }, type: 'scatter' }
])

const haarLayout = reactive({
  title: '',
  shapes: allShapes,
  xaxis: { visible: false, range: [-0.3, 10.5] },
  yaxis: { visible: false, range: [-0.7, 2.3] },
  margin: { t: 20, b: 20, l: 20, r: 20 },
  height: 200,
  plot_bgcolor: '#f1f5f9',
  paper_bgcolor: 'transparent'
})
</script>
