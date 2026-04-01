# Kernel Methods

## Overview

Kernel methods provide a powerful framework for extending linear algorithms to non-linear problems without explicitly computing high-dimensional feature transformations. This enables handling of non-linear patterns efficiently.

## The Kernel Trick

### Motivation

Many machine learning algorithms depend only on **inner products** of data:

$$\langle \mathbf{x}_i, \mathbf{x}_j \rangle = \mathbf{x}_i^T \mathbf{x}_j$$

**Key Insight**: We can replace inner products with kernel functions!

### Kernel Function Definition

A kernel function $k(\mathbf{x}, \mathbf{x}')$ computes inner product in feature space **implicitly**:

$$k(\mathbf{x}, \mathbf{x}') = \langle \boldsymbol{\phi}(\mathbf{x}), \boldsymbol{\phi}(\mathbf{x}') \rangle$$

where $\boldsymbol{\phi}$ is a mapping to a high-dimensional feature space.

**Advantage**: Compute kernel without knowing $\boldsymbol{\phi}$ explicitly!

### Kernel Trick in Algorithms

For any algorithm using inner products:

$$\text{Replace } \langle \mathbf{x}_i, \mathbf{x}_j \rangle \text{ with } k(\mathbf{x}_i, \mathbf{x}_j)$$

Examples:
- SVM: $\langle \mathbf{x}_i, \mathbf{x}_j \rangle \to k(\mathbf{x}_i, \mathbf{x}_j)$
- PCA: Kernel PCA using kernel matrix
- Linear regression: Kernel ridge regression

<KernelVisualizer />

## Mercer's Theorem

### Statement

A symmetric function $k(\mathbf{x}, \mathbf{x}')$ is a valid kernel (positive semi-definite) if and only if:

$$k(\mathbf{x}, \mathbf{x}') = \sum_{i=1}^{\infty} \lambda_i \psi_i(\mathbf{x})\psi_i(\mathbf{x}')$$

where:
- $\lambda_i \geq 0$ (non-negative eigenvalues)
- $\psi_i$ are orthonormal eigenfunctions

### Practical Implication

**If** $k$ is positive semi-definite, **then** an equivalent feature space $\boldsymbol{\phi}$ exists!

This justifies any PSD kernel in machine learning algorithms.

### Checking Validity

A symmetric kernel is PSD if and only if its **kernel matrix** has all non-negative eigenvalues:

$$\mathbf{K} = \begin{bmatrix} k(\mathbf{x}_1, \mathbf{x}_1) & \cdots & k(\mathbf{x}_1, \mathbf{x}_m) \\ \vdots & \ddots & \vdots \\ k(\mathbf{x}_m, \mathbf{x}_1) & \cdots & k(\mathbf{x}_m, \mathbf{x}_m) \end{bmatrix}$$

All eigenvalues $\lambda_i(\mathbf{K}) \geq 0$ for valid kernel.

## Common Kernel Functions

### Linear Kernel

$$k(\mathbf{x}, \mathbf{x}') = \langle \mathbf{x}, \mathbf{x}' \rangle = \mathbf{x}^T \mathbf{x}'$$

**Feature map**: Identity (no transformation)  
**Use**: Linearly separable problems  
**Computational cost**: Very low

### Polynomial Kernel

$$k(\mathbf{x}, \mathbf{x}') = \left(\langle \mathbf{x}, \mathbf{x}' \rangle + c\right)^d$$

**Feature map**: All monomials of degree $\leq d$  
**Parameters**:
- $d$ = polynomial degree
- $c$ = bias parameter (typically $c=1$)

**Example** ($d=2$, $c=0$):
$$k(\mathbf{x}, \mathbf{x}') = \left(\mathbf{x}^T \mathbf{x}'\right)^2 = \sum_{i} \sum_{j} x_i x_j x'_i x'_j$$

Implicit features: $\{x_i x_j\}$ (all degree-2 monomials)

### Radial Basis Function (RBF/Gaussian)

$$k(\mathbf{x}, \mathbf{x}') = \exp\left(-\gamma \|\mathbf{x} - \mathbf{x}'\|^2\right)$$

**Feature map**: Infinite-dimensional  
**Parameter**: $\gamma = \frac{1}{2\sigma^2}$ (bandwidth/width)

**Interpretation**:
- $\gamma$ large (narrow RBF): very local, complex boundaries
- $\gamma$ small (wide RBF): smooth, global patterns

**Properties**:
- Extremely flexible (universal approximator)
- Default choice for many applications
- Most popular kernel

### Sigmoid Kernel

$$k(\mathbf{x}, \mathbf{x}') = \tanh(\alpha \langle \mathbf{x}, \mathbf{x}' \rangle + c)$$

**Properties**:
- Similar to neural network hidden layer
- Not always positive semi-definite (caution!)
- Parameters: $\alpha$, $c$

### String Kernels

For sequence/string data:

**Spectrum Kernel**: Count matches of all substring of length $k$

**Mismatch Kernel**: Allow up to $m$ mismatches in substring matching

**Applications**: DNA/protein sequence analysis, text classification

## Kernel Matrix Properties

### Definition

For dataset $\{\mathbf{x}_1, \ldots, \mathbf{x}_m\}$, kernel matrix $\mathbf{K}$ is:

$$\mathbf{K}_{ij} = k(\mathbf{x}_i, \mathbf{x}_j)$$

### Properties

**Symmetric**: $\mathbf{K}^T = \mathbf{K}$

**Positive Semi-Definite**: All eigenvalues $\lambda_i \geq 0$

**Gram Matrix**: Contains all pairwise inner products

### Computational Considerations

**Storage**: $m \times m$ matrix for $m$ samples
- Problem: Memory scales as $O(m^2)$
- Limited to ~50,000 samples in practice

**Computation**: Evaluating $k(\mathbf{x}_i, \mathbf{x}_j)$ each entry
- Typical cost: $O(d)$ per kernel evaluation
- Total: $O(m^2 d)$ to compute full kernel matrix

**Efficiency**: Pre-compute and cache kernel matrix, reuse in algorithms

## Kernel Matrix Centering

### Issue

In feature space, features may not be centered (mean ≠ 0)

For PCA and other algorithms needing centered data:

### Centered Kernel Matrix

$$\tilde{\mathbf{K}} = \mathbf{H} \mathbf{K} \mathbf{H}$$

where:
$$\mathbf{H} = \mathbf{I} - \frac{1}{m}\mathbf{1}\mathbf{1}^T$$

**Effect**: Removes mean from feature space  
**Application**: Essential for Kernel PCA

## Kernel PCA

### Problem

Standard PCA requires explicit features. For kernel methods:

$$\Sigma = \frac{1}{m}\sum_{i=1}^m \boldsymbol{\phi}(\mathbf{x}_i)\boldsymbol{\phi}(\mathbf{x}_i)^T$$

Eigendecomposition impossible without knowing $\boldsymbol{\phi}$!

### Solution: Kernel PCA

Work directly with kernel matrix through Gram matrix approach:

**Algorithm:**
1. Compute kernel matrix $\mathbf{K}$
2. Center: $\tilde{\mathbf{K}} = \mathbf{H}\mathbf{K}\mathbf{H}$
3. Eigendecomposition: $\tilde{\mathbf{K}} = \mathbf{V}\boldsymbol{\Lambda}\mathbf{V}^T$
4. Select top $k$ eigenvectors $\mathbf{v}_1, \ldots, \mathbf{v}_k$
5. Project new points: computed via kernel evaluations

### Advantages

- Discovers **non-linear manifolds** in high-dimensional spaces
- **Efficient**: Only requires kernel evaluations
- **Flexible**: Works with any kernel function

### Applications

- Image analysis (find non-linear subspaces)
- Gene expression analysis
- Face recognition with non-linear variations

## Kernel Design and Composition

### Composition Rules

If $k_1$ and $k_2$ are valid kernels:

**Sum**: $k = k_1 + k_2$ is valid ✓  
**Product**: $k = k_1 \cdot k_2$ is valid ✓  
**Scalar**: $k = c \cdot k_1$ valid if $c > 0$ ✓  
**Power**: $k = k_1^c$ is valid for $c > 0$ ✓

**Examples**:
- Mix kernels: $k = 0.7 k_{\text{RBF}} + 0.3 k_{\text{poly}}$
- Combine different information types

### Domain-Specific Kernel Design

Create kernels reflecting data structure:

**Graph Kernels**: For structured data  
**Tree Kernels**: For hierarchical data  
**Combination Kernels**: For multi-modal data

## Kernel Parameter Selection

### Cross-Validation

For RBF kernel with parameter $\gamma$:

1. Define search range: $\gamma \in \{10^{-3}, 10^{-2}, \ldots, 10^1\}$
2. For each $\gamma$:
   - k-fold cross-vali dation
   - Measure accuracy/error
3. Select $\gamma$ with best CV performance

### Grid Search

Systematic parameter search:

```
for C in [0.1, 1, 10, 100]:
  for gamma in [0.001, 0.01, 0.1, 1]:
    score = cross_val_score(SVC(C=C, gamma=gamma), X, y)
    record (C, gamma, score)
```

Select parameters with best average score

### Tuning Guidelines

| Kernel | Parameters | Tuning |
|--------|-----------|--------|
| RBF | $\gamma$ | Logarithmic range |
| Polynomial | $d$, $c$ | Small integer range |
| String | substring length $k$ | Domain knowledge |

## Applications

### Support Vector Machines

Non-linear SVM using kernel trick
- Classical: linear $\to$ use linear kernel
- Non-linear: XOR problem $\to$ use RBF kernel

### Kernel Ridge Regression

Linear regression in kernel space
- Implicit feature transformation
- Regularization via parameter $\lambda$

### Kernel Methods for Unsupervised Learning

- **Kernel PCA**: Non-linear dimensionality reduction
- **Spectral Clustering**: Using kernel similarity matrix
- **Kernel K-means**: Non-linear clustering

## Practical Considerations

### When to Use Kernels

**Use kernels when**:
- Features are high-dimensional already
- Non-linear separation needed
- Domain knowledge suggests non-linear patterns

**Avoid kernels when**:
- Dataset very large ($m > 100,000$)
- Memory limited
- Explicit features work well

### Computational Efficiency

**For large datasets**:
- Use Nyström approximation (random sample kernel matrix)
- Use approximate kernels
- Consider explicit feature approximations (Random Kitchen Sinks)

**For structured data**:
- Design specialized kernels
- Use tree/graph kernel algorithms

## Summary

| Concept | Key Idea |
|---------|----------|
| **Kernel Trick** | Replace dot products with kernels |
| **Mercer's Theorem** | PSD kernels correspond to feature spaces |
| **Linear Kernel** | No transformation, baseline |
| **RBF Kernel** | Infinite-dimensional, most flexible |
| **Kernel PCA** | Non-linear manifold discovery |
| **Composition** | Combine kernels for flexibility |
