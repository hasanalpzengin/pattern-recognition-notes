# Norms and Norm-Dependent Linear Regression

## Overview

Different norms define different distance measures, leading to different regression solutions with various robustness properties.

## Norm Definitions

### Standard Norms in ℝⁿ

The $L_p$ norm is defined as:

$$\|x\|_p = \left(\sum_{i=1}^{n} |x_i|^p\right)^{1/p}$$

Special cases:

- **L₁ Norm**: $\|x\|_1 = \sum_{i=1}^{n} |x_i|$ (Manhattan distance)
- **L₂ Norm**: $\|x\|_2 = \sqrt{\sum_{i=1}^{n} x_i^2}$ (Euclidean distance)  
- **L∞ Norm**: $\|x\|_\infty = \max_i |x_i|$ (Maximum norm)

<PlotlyChart 
  :data="normVisualizationData"
  :layout="normLayout"
  title="Unit Ball Visualization"
  description="Shapes of unit balls for different norm definitions in 2D"
/>

## Regression Variants

### Least-Squares Regression (L₂)

Minimizes the sum of squared residuals:

$$\min_w \sum_{i=1}^{m} (y_i - w^T x_i)^2$$

**Advantages:**
- Closed-form solution: $w = (X^T X)^{-1} X^T y$
- Efficient computation
- Well-studied theory

**Disadvantages:**
- Sensitive to outliers (quadratic penalization)
- Not robust to heavy-tailed noise

<InteractiveDemo
  title="L₂ Regression with Outliers"
  :controls="{
    noise: { type: 'slider', label: 'Noise Level', min: 0.1, max: 2, step: 0.1, unit: '' },
    outliers: { type: 'number', label: 'Number of Outliers', min: 0, max: 10, step: 1 }
  }"
  :generator="generateL2Demo"
  description="Observe how L₂ regression is affected by outliers"
/>

### Chebyshev Regression (L∞)

Minimizes the maximum absolute residual:

$$\min_w \max_i |y_i - w^T x_i|$$

**Properties:**
- Minimizes worst-case error
- Linear programming solution
- Robust to outliers

### Least Absolute Residuals (L₁)

Minimizes sum of absolute residuals:

$$\min_w \sum_{i=1}^{m} |y_i - w^T x_i|$$

**Characteristics:**
- More robust than L₂
- Sparse solutions (feature selection)
- No closed-form solution

<PlotlyChart 
  :data="regressionComparisonData"
  :layout="regressionLayout"
  title="Regression Comparison"
  description="How L₁, L₂, and L∞ regressions handle data with outliers differently"
/>

## Regularization Techniques

### Ridge Regression (L₂ Penalty)

$$\min_w \sum_{i=1}^{m} (y_i - w^T x_i)^2 + \lambda \|w\|_2^2$$

- Shrinks coefficient magnitudes
- Handles multicollinearity
- Closed-form solution: $w = (X^T X + \lambda I)^{-1} X^T y$

### Lasso Regression (L₁ Penalty)

$$\min_w \sum_{i=1}^{m} (y_i - w^T x_i)^2 + \lambda \|w\|_1$$

- Automatic feature selection
- Sparse solutions (many coefficients become exactly zero)
- Solved via coordinate descent

<PlotlyChart 
  :data="regularizationData"
  :layout="regularizationLayout"
  title="Regularization Effects"
  description="L₁ (Lasso) produces sparse solutions, L₂ (Ridge) shrinks coefficients"
/>

## Penalty Function Design

The choice of penalty function affects model behavior:

- **Soft vs Hard**: Soft penalties have continuous solutions, hard constraints create boundaries
- **Robust Estimation**: Different penalties handle outliers differently
- **Sparsity**: L₁ induces sparsity, L₂ does not

## Applications

### Financial Forecasting
- Robust to market shocks (outliers)
- L₁ for feature selection

### Medical Data Analysis
- Sparse models for interpretability
- Ridge for correlated biomarkers

### Signal Processing
- Different norms for different noise types

## Comparison Table

| Regression | Objective | Robustness | Features | Computation |
|-----------|-----------|-----------|----------|------------|
| **L₂** | Energy-minimization | Low | Dense | Closed-form |
| **L₁** | Sparse | High | Selection | Iterative |
| **L∞** | Minimax | Very High | Dense | LP solver |
| **Ridge** | L₂ + penalty | Low | Dense | Closed-form |
| **Lasso** | L₂ + L₁ penalty | High | Sparse | Iterative |

---

<script setup>
import { reactive } from 'vue'

// Norm unit ball visualization
const normVisualizationData = reactive([
  {
    x: [1, 0.707, 0, -0.707, -1, -0.707, 0, 0.707, 1],
    y: [0, 0.707, 1, 0.707, 0, -0.707, -1, -0.707, 0],
    name: 'L₂ (Euclidean)',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: 'blue', width: 2 }
  },
  {
    x: [1, 1, 0, -1, -1, -1, 0, 1, 1],
    y: [0, 1, 1, 1, 0, -1, -1, -1, 0],
    name: 'L₁ (Manhattan)',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: 'red', width: 2 }
  },
  {
    x: [1, 1, -1, -1, 1],
    y: [1, -1, -1, 1, 1],
    name: 'L∞ (Max)',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: 'green', width: 2 }
  }
])

const normLayout = {
  title: '',
  xaxis: { title: 'x₁', scaleanchor: 'y', scaleratio: 1 },
  yaxis: { title: 'x₂', scaleanchor: 'x', scaleratio: 1 },
  showlegend: true
}

// L2 regression demo
function generateL2Demo(values) {
  const noise = values.noise || 0.5
  const outliers = values.outliers || 0
  
  const x = []
  const y = []
  const yLine = []
  
  for (let i = 0; i < 20; i++) {
    const xi = i / 20 * 10
    x.push(xi)
    y.push(2 * xi + 1 + (Math.random() - 0.5) * noise * 2)
    yLine.push(2 * xi + 1)
  }
  
  // Add outliers
  for (let i = 0; i < outliers; i++) {
    x.push(Math.random() * 10)
    y.push((Math.random() - 0.5) * 20)
  }
  
  return {
    data: [
      {
        x: x.slice(0, 20),
        y: y.slice(0, 20),
        mode: 'markers',
        type: 'scatter',
        marker: { color: 'blue', size: 8 },
        name: 'Data'
      },
      {
        x: y.slice(20).length > 0 ? x.slice(20) : [],
        y: y.slice(20),
        mode: 'markers',
        type: 'scatter',
        marker: { color: 'red', size: 10 },
        name: 'Outliers'
      },
      {
        x: [0, 10],
        y: [1, 21],
        mode: 'lines',
        type: 'scatter',
        line: { color: 'green' },
        name: 'True line'
      }
    ],
    layout: {
      title: '',
      xaxis: { title: 'x' },
      yaxis: { title: 'y' },
      showlegend: true
    },
    output: `Noise: ${noise.toFixed(2)}\nOutliers: ${outliers}\nMSE affected by magnitude of residuals`
  }
}

// Regression comparison
const regressionComparisonData = reactive([
  {
    x: [-3, -2, -1, 0, 1, 2, 3],
    y: [0.3, 0.15, 0.05, 0, 0.05, 0.15, 0.3],
    name: 'L₂ Error',
    type: 'scatter',
    mode: 'lines+markers'
  },
  {
    x: [-3, -2, -1, 0, 1, 2, 3],
    y: [3, 2, 1, 0, 1, 2, 3],
    name: 'L₁ Error',
    type: 'scatter',
    mode: 'lines+markers'
  },
  {
    x: [-3, -2, -1, 0, 1, 2, 3],
    y: [3, 2, 1, 0, 1, 2, 3],
    name: 'L∞ Error',
    type: 'scatter',
    mode: 'lines+markers'
  }
])

const regressionLayout = {
  title: '',
  xaxis: { title: 'Residual' },
  yaxis: { title: 'Penalty' },
  showlegend: true
}

// Regularization effects
const regularizationData = reactive([
  {
    x: ['w₁', 'w₂', 'w₃', 'w₄', 'w₅'],
    y: [0.8, 0.2, 0, 0.5, 0.1],
    name: 'Lasso (L₁)',
    type: 'bar'
  },
  {
    x: ['w₁', 'w₂', 'w₃', 'w₄', 'w₅'],
    y: [0.7, 0.4, 0.3, 0.5, 0.2],
    name: 'Ridge (L₂)',
    type: 'bar'
  }
])

const regularizationLayout = {
  title: '',
  xaxis: { title: 'Coefficient' },
  yaxis: { title: 'Magnitude' },
  barmode: 'group'
}
</script>
