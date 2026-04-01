# Support Vector Machines I

## Overview

Support Vector Machines (SVMs) are powerful supervised learning algorithms for classification based on margin maximization. This lecture covers the fundamental concepts of hard and soft margin SVMs.

## Linear Classification Problem

### Decision Boundaries

For binary classification, we seek a hyperplane:

$$\mathbf{w}^T \mathbf{x} + b = 0$$

that separates two classes:
- **Class 1**: points with $\mathbf{w}^T \mathbf{x} + b > 0$ (label $y_i = +1$)
- **Class 2**: points with $\mathbf{w}^T \mathbf{x} + b < 0$ (label $y_i = -1$)

### Hard Margin SVM

For linearly separable data, we seek the hyperplane with **maximum margin**.

**Optimization Problem**:

$$\min_{\mathbf{w}, b} \frac{1}{2}\|\mathbf{w}\|_2^2$$

subject to: $y_i(\mathbf{w}^T \mathbf{x}_i + b) \geq 1$ for all $i = 1, \ldots, m$

where $y_i \in \{-1, +1\}$ are class labels.

**Objective**: Minimize $\|\mathbf{w}\|$ to maximize margin

### Geometric Interpretation

**Margin**: Distance from hyperplane to nearest data point

The margin is: $\text{margin} = \frac{2}{\|\mathbf{w}\|}$

- **Support Vectors**: Points on the margin boundary  
  - Points for which $y_i(\mathbf{w}^T \mathbf{x}_i + b) = 1$
  - Only support vectors affect decision boundary
  
- **Decision Boundary**: The separating hyperplane  

- **Margin Boundaries**: Parallel hyperplanes at distance 1 from decision boundary

<SVMVisualizer />

### Why Maximize Margin?

**Generalization**: Larger margin typically gives better generalization to unseen data

**Robustness**: Margin provides buffer against small input perturbations

## Soft Margin SVM

### Problem: Non-linearly Separable Data

Real data often has overlapping classes—hard margin SVM has no solution!

### Solution: Slack Variables

Introduce slack variables $\xi_i \geq 0$ to allow violations:

$$\min_{\mathbf{w}, b, \boldsymbol{\xi}} \frac{1}{2}\|\mathbf{w}\|_2^2 + C\sum_{i=1}^{m} \xi_i$$

subject to:
- $y_i(\mathbf{w}^T \mathbf{x}_i + b) \geq 1 - \xi_i$ (margin constraint with slack)
- $\xi_i \geq 0$ (non-negative slack)

### Interpretation of Slack Variables

- $\xi_i = 0$: Point correctly classified outside margin
- $0 < \xi_i < 1$: Point inside margin but correctly classified
- $\xi_i > 1$: Point misclassified (on wrong side of boundary)

### The Regularization Parameter C

**Purpose**: Balance between margin size and training error

- **Large C** (e.g., $C = 10$):
  - Heavily penalizes misclassifications
  - Smaller margin, more precise fit to training data
  - Risk of overfitting
  
- **Small C** (e.g., $C = 0.1$):
  - Allows more violations
  - Larger margin, simpler model
  - Better generalization but higher training error

**Cross-validation** is essential to select optimal $C$

### Connection to Regularization

Equivalent form (without slack):

$$\min_{\mathbf{w}, b} \left[\frac{1}{C}\sum_{i=1}^{m} \max(0, 1 - y_i(\mathbf{w}^T \mathbf{x}_i + b))\right] + \frac{1}{2}\|\mathbf{w}\|_2^2$$

- First term: **Hinge loss** (measures margin violations)
- Second term: **Regularization** (complexity)
- $\frac{1}{C}$ weights relative importance

## Convex Optimization Properties

SVMs are formulated as **Quadratic Programs (QP)**:

$$\min_{\mathbf{x}} \frac{1}{2}\mathbf{x}^T P \mathbf{x} + \mathbf{q}^T \mathbf{x}$$

subject to: $G\mathbf{x} \leq \mathbf{h}$ (linear inequality constraints)

**Properties**:
- **Objective**: Strongly convex quadratic function
- **Constraints**: Linear (convex set)  
- **Global Optimum**: Unique solution guaranteed!
- **Solver**: Standard QP algorithms available

**Implication**: No local minima to get stuck in—always find global solution

## Support Vectors

### Definition

Support vectors are training points for which $\alpha_i > 0$ in the dual solution:

$$\mathbf{w} = \sum_{i=1}^{m} \alpha_i y_i \mathbf{x}_i$$

### Categories

1. **Margin support vectors**: On margin boundary ($0 < \alpha_i < C$)
   - Correctly classified but on or near margin
   
2. **Margin error support vectors**: Inside margin ($\alpha_i = C$)
   - Misclassified or barely inside margin

3. **Non-support vectors**: $\alpha_i = 0$
   - Far from decision boundary, no influence on solution

### Sparsity Property

**Key Advantage**: After training, most $\alpha_i = 0$

- Solution depends only on small subset (support vectors)
- Non-support vectors can be discarded
- Efficient prediction (only evaluate kernel with support vectors)

## Decision Function

Once trained, prediction on new sample $\mathbf{x}$:

$$f(\mathbf{x}) = \mathbf{w}^T \mathbf{x} + b = \sum_i \alpha_i y_i \mathbf{x}_i^T \mathbf{x} + b$$

**Classification**:
- If $f(\mathbf{x}) > 0$: predict class +1
- If $f(\mathbf{x}) < 0$: predict class -1
- If $f(\mathbf{x}) \approx 0$: near decision boundary (uncertainty)

## Practical Considerations

### Feature Normalization

SVM performance highly sensitive to feature scaling
- Standardize features: $x_i \to \frac{x_i - \mu_i}{\sigma_i}$
- Ensures equal importance for all features
- Same scale for C parameter across problems

### Hyperparameter Selection

**C parameter**:
- Grid search over logarithmic range: $\{10^{-3}, 10^{-2}, \ldots, 10^3\}$
- Use cross-validation to select best C
- Typical range: $C \in [0.1, 100]$ depending on problem

### Computational Complexity

**Training**:
- Worst case: $O(m^3)$ for general QP solver
- Practice: $O(m^2)$ to $O(m^2.2)$ for optimized algorithms (SMO)
- Scales to tens of thousands of samples

**Prediction**: $O(n_s d)$ where $n_s$ = number of support vectors

### When to Use Hard vs Soft Margin

| Scenario | Use |
|----------|-----|
| Data perfectly separable | Hard margin |
| Data has noise/overlap | Soft margin |
| Many outliers | Soft margin (low C) |
| Perfect training accuracy needed | Hard margin (if possible) |
| Better generalization desired | Soft margin (tune C) |

## From Hard to Soft Margin

Hard margin is limiting case of soft margin as $C \to \infty$:

$$\text{Hard Margin} = \lim_{C \to \infty} \text{Soft Margin}$$

As C increases:
- Margin decreases
- Number of support vectors decreases  
- Training error decreases (but generalization may worsen)

## Next Steps

In SVM II, we will:
- Develop the **dual formulation** (enables kernel trick)
- Introduce **kernel methods** (handle non-linear boundaries)
- Study **the kernel trick** (compute in high dimensions efficiently)
| **Practical use** | Rarely | Common |

---

<script setup>
import { reactive } from 'vue'

// Hard margin visualization
const hardMarginData = reactive([
  {
    x: [1, 1.5, 2, 2.5, 3],
    y: [1, 1.3, 1.1, 2.2, 2.5],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 12, color: 'blue', symbol: 'circle' },
    name: 'Class 1'
  },
  {
    x: [6, 6.5, 7, 7.5, 8],
    y: [6, 6.3, 6.1, 7.2, 7.5],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 12, color: 'red', symbol: 'circle' },
    name: 'Class 2'
  },
  {
    x: [0, 10],
    y: [2, 6],
    mode: 'lines',
    type: 'scatter',
    line: { color: 'green', width: 2 },
    name: 'Decision boundary'
  }
])

const svmLayout = {
  title: '',
  xaxis: { title: 'Feature 1' },
  yaxis: { title: 'Feature 2' },
  showlegend: true
}

// Soft margin demo
function generateSVMDemo(values) {
  const c = values.c || 1
  const overlap = values.overlap || 0.3
  
  const traces = []
  
  // Class 1 points
  const x1 = []
  const y1 = []
  for (let i = 0; i < 15; i++) {
    x1.push(2 + (Math.random() - 0.5) * 2 * overlap)
    y1.push(2 + (Math.random() - 0.5) * 2)
  }
  
  // Class 2 points
  const x2 = []
  const y2 = []
  for (let i = 0; i < 15; i++) {
    x2.push(6 + (Math.random() - 0.5) * 2 * overlap)
    y2.push(6 + (Math.random() - 0.5) * 2)
  }
  
  traces.push({
    x: x1, y: y1,
    mode: 'markers',
    type: 'scatter',
    marker: { size: 8, color: 'blue' },
    name: 'Class 1'
  })
  
  traces.push({
    x: x2, y: y2,
    mode: 'markers',
    type: 'scatter',
    marker: { size: 8, color: 'red' },
    name: 'Class 2'
  })
  
  return {
    data: traces,
    layout: {
      title: '',
      xaxis: { title: 'Feature 1' },
      yaxis: { title: 'Feature 2' },
      showlegend: true
    },
    output: `Regularization C: ${c.toFixed(2)}\nData Overlap: ${(overlap * 100).toFixed(0)}%\nMargin affected by C parameter`
  }
}

// Support vector visualization
const supportVectorData = reactive([
  {
    x: [1, 1.5, 2, 2.5],
    y: [1, 1.3, 1.1, 2.2],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 10, color: 'blue' },
    name: 'Class 1'
  },
  {
    x: [3, 3.2],
    y: [2.5, 2.7],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 14, color: 'blue', symbol: 'diamond' },
    name: 'Support Vectors (Class 1)'
  },
  {
    x: [6, 6.5, 7, 7.5],
    y: [6, 6.3, 6.1, 7.2],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 10, color: 'red' },
    name: 'Class 2'
  },
  {
    x: [5.8, 6.2],
    y: [5.9, 6.2],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 14, color: 'red', symbol: 'diamond' },
    name: 'Support Vectors (Class 2)'
  }
])

const supportVectorLayout = {
  title: '',
  xaxis: { title: 'Feature 1' },
  yaxis: { title: 'Feature 2' },
  showlegend: true
}
</script>
