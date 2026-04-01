# Discriminant Analysis II

## Overview

Discriminant Analysis is a fundamental technique for dimensionality reduction and classification. This lecture covers Linear Discriminant Analysis (LDA), Principal Component Analysis (PCA), and their variations.

## Linear Discriminant Analysis (LDA)

LDA seeks to find linear projections that maximize the separation between classes while minimizing within-class variance.

### Mathematical Formulation

The LDA criterion is given by:

$$J(w) = \frac{w^T S_B w}{w^T S_W w}$$

where:
- $S_B$ = Between-class scatter matrix: $S_B = \sum_k n_k (\mu_k - \mu)(\mu_k - \mu)^T$
- $S_W$ = Within-class scatter matrix: $S_W = \sum_k \sum_{i \in \text{class}_k} (x_i - \mu_k)(x_i - \mu_k)^T$
- $w$ = Projection vector to find

### Geometric Interpretation

LDA finds the projection direction that:
1. **Maximizes** between-class separation (spread of class means)
2. **Minimizes** within-class scatter (spread within each class)

The result is a projection that makes classes as separated and compact as possible.

<LDAVisualizer />

### Generalized Eigenvalue Problem

The optimal projection vectors are solutions to the generalized eigenvalue problem:

$$S_B w = \lambda S_W w$$

This can be rewritten as:

$$S_W^{-1} S_B w = \lambda w$$

**Solution Method:**
- Compute $S_B$ and $S_W$ from training data
- Solve eigenvalue problem of $S_W^{-1} S_B$
- Select eigenvectors corresponding to largest eigenvalues
- Use eigenvectors as projection directions

### Key Properties

- **Supervised**: Uses class labels (unlike PCA)
- **Discriminative**: Directly optimizes class separation
- **At most $K-1$ components**: For $K$ classes, maximum discriminant vectors is $K-1$
- **Dimensionality reduction**: Projects $d$-dimensional data to $(K-1)$-dimensional space

## Principal Component Analysis (PCA)

PCA is an unsupervised dimensionality reduction method that finds directions of maximum variance.

### PCA Algorithm

1. **Standardize** data: compute mean and standard deviation for each feature
2. **Center data**: subtract mean from each sample
3. **Compute** covariance matrix: $\Sigma = \frac{1}{m}X^T X$ (for centered data)
4. **Find** eigendecomposition: $\Sigma = U \Lambda U^T$
5. **Select** top $k$ eigenvectors (principal components)
6. **Project** data: $Z = X \cdot U_k$

### Mathematical Foundations

The eigendecomposition of the covariance matrix gives:

$$\Sigma = U \Lambda U^T$$

where:
- $U$ = Matrix of eigenvectors (principal components)
- $\Lambda$ = Diagonal matrix of eigenvalues
- Eigenvalues: $\lambda_i$ = variance explained by component $i$

### Variance Explained

The proportion of variance explained by the $k$-th component:

$$\text{Variance Ratio}_k = \frac{\lambda_k}{\sum_{i=1}^{d} \lambda_i}$$

Cumulative variance with top $k$ components:

$$\text{Cumulative Variance} = \frac{\sum_{i=1}^{k} \lambda_i}{\sum_{i=1}^{d} \lambda_i}$$

## Rank Reduced Linear Discriminant Analysis (RRDA)

RRDA addresses the problem when features exceed samples ($d > m$).

### Two-Stage Approach

**Stage 1**: PCA dimensionality reduction to $k$ dimensions  
**Stage 2**: LDA projection onto discriminant space

```
Original Space (d dimensions)
        ↓ PCA
Reduced Space (k dimensions)
        ↓ LDA  
Discriminant Space (c-1 dimensions)
```

### Computational Benefits

- **Memory**: Reduced matrix sizes
- **Stability**: Better numerical properties
- **Speed**: Faster computation

<PlotlyChart 
  :data="rrldaData"
  :layout="rrldaLayout"
  title="RRDA: Two-Stage Dimensionality Reduction"
  description="Visualization of RRDA pipeline in 3D space"
/>

## Fisher Transform

Fisher's method directly optimizes the LDA criterion through Lagrange multipliers.

### Optimization Problem

$$\text{maximize}_{w} J(w) = \frac{w^T S_B w}{w^T S_W w}$$

### Lagrangian Formulation

$$L(w, \lambda) = w^T S_B w - \lambda(w^T S_W w - 1)$$

Taking derivatives:

$$S_B w = \lambda S_W w$$

This gives the generalized eigenvalue problem.

## Applications

### Face Recognition
- **Challenge**: High-dimensional image data (thousands of pixels)
- **Solution**: PCA for initial reduction → LDA for class discrimination
- **Result**: Powerful face identification system

### Medical Diagnosis
- **Data**: Biomarkers and clinical parameters
- **Goal**: Separate disease classes from healthy controls
- **Advantage**: Interpretable linear transformations

<PlotlyChart 
  :data="applicationData"
  :layout="applicationLayout"
  title="Application Domains"
  description="Examples of LDA and PCA applications in real-world problems"
/>

## Summary Table

| Method | Supervised | Goal | Output |
|--------|-----------|------|--------|
| **PCA** | No | Max variance | Principal components |
| **LDA** | Yes | Max class separation | Discriminant directions |
| **RRDA** | Yes | Combine both | Stable classification |

## Code Example

```python
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.decomposition import PCA

# Apply PCA first
pca = PCA(n_components=10)
X_pca = pca.fit_transform(X)

# Then apply LDA
lda = LinearDiscriminantAnalysis(n_components=2)
X_lda = lda.fit_transform(X_pca, y)

# Predictions
predictions = lda.predict(X_test_pca)
```

---

<script setup>
import { reactive } from 'vue'

// LDA Visualization
const ldaVisualizationData = reactive([
  {
    x: [1, 2, 3, 2.5, 3.5, 1.5],
    y: [1, 1.5, 1.2, 2.8, 3, 2.7],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 10, color: 'blue' },
    name: 'Class 1'
  },
  {
    x: [8, 8.5, 9, 8.2, 9.2],
    y: [8, 8.5, 8.2, 9, 9.2],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 10, color: 'red' },
    name: 'Class 2'
  }
])

const ldaLayout = {
  title: '',
  xaxis: { title: 'Feature 1' },
  yaxis: { title: 'Feature 2' },
  showlegend: true,
  hovermode: 'closest'
}

// PCA Variance Explained
const pcaVarianceData = reactive([
  {
    x: ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC6', 'PC7', 'PC8', 'PC9', 'PC10'],
    y: [0.45, 0.75, 0.88, 0.96, 1.01, 1.05, 1.08, 1.10, 1.11, 1.12],
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Cumulative Variance',
    line: { color: '#4f46e5', width: 3 }
  }
])

const pcaLayout = {
  title: '',
  xaxis: { title: 'Principal Component' },
  yaxis: { title: 'Cumulative Variance Explained' },
  showlegend: false
}

// RRDA visualization
const rrldaData = reactive([
  {
    type: 'scatter3d',
    mode: 'markers',
    x: [1, 2, 3, 1.5, 2.5],
    y: [1, 1.5, 1.2, 2, 2.2],
    z: [1, 1.2, 0.9, 1.8, 2.1],
    marker: { size: 8, color: 'blue' },
    name: 'Original Space'
  }
])

const rrldaLayout = {
  title: '',
  scene: {
    xaxis: { title: 'Feature 1' },
    yaxis: { title: 'Feature 2' },
    zaxis: { title: 'Feature 3' }
  }
}

// Application data
const applicationData = reactive([
  {
    labels: ['Face Recognition', 'Medical Diagnosis', 'Iris Classification', 'Document Analysis', 'Biometrics'],
    values: [95, 88, 98, 85, 92],
    type: 'bar',
    marker: { color: '#4f46e5' }
  }
])

const applicationLayout = {
  title: '',
  xaxis: { title: 'Application Domain' },
  yaxis: { title: 'Accuracy (%)' },
  showlegend: false
}

// Interactive demo generator
function generateLDADemo(values) {
  const classes = values.classes || 2
  const overlap = values.overlap || 0.3
  const variance = values.variance || 1
  
  const traces = []
  const colors = ['blue', 'red', 'green', 'purple', 'orange']
  
  for (let c = 0; c < classes; c++) {
    const baseX = c * 4
    const baseY = c * 4
    const x = []
    const y = []
    
    for (let i = 0; i < 20; i++) {
      x.push(baseX + (Math.random() - 0.5) * variance * (2 - overlap))
      y.push(baseY + (Math.random() - 0.5) * variance * (2 - overlap))
    }
    
    traces.push({
      x,
      y,
      mode: 'markers',
      type: 'scatter',
      marker: { size: 8, color: colors[c] },
      name: `Class ${c + 1}`
    })
  }
  
  return {
    data: traces,
    layout: {
      title: '',
      xaxis: { title: 'Feature 1' },
      yaxis: { title: 'Feature 2' },
      showlegend: true
    },
    output: `Classes: ${classes}\nOverlap: ${overlap.toFixed(2)}\nWithin-class Variance: ${variance.toFixed(2)}`
  }
}
</script>
