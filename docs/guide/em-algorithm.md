# Expectation Maximization Algorithm

## Overview

The Expectation Maximization (EM) algorithm is a fundamental technique for parameter estimation in probabilistic models with **latent (hidden) variables**. It iteratively estimates parameters by alternating between:
- **E-step**: Infer latent variable posteriors
- **M-step**: Update parameters maximizing expected likelihood

## Setting with Latent Variables

### Problem Formulation

We observe:
- **Observed data**: $\mathbf{x} = \{\mathbf{x}_1, \ldots, \mathbf{x}_m\}$
- **Unobserved (latent) variables**: $\mathbf{z} = \{\mathbf{z}_1, \ldots, \mathbf{z}_m\}$
- **Unknown parameters**: $\theta$ to estimate

### Marginalized Likelihood

The likelihood of observed data requires summing over all latent variables:

$$p(\mathbf{x}|\theta) = \sum_{\mathbf{z}} p(\mathbf{x}, \mathbf{z}|\theta) = \sum_{\mathbf{z}} p(\mathbf{x}|\mathbf{z}, \theta) p(\mathbf{z}|\theta)$$

**Problem**: This sum is intractable for large latent variable spaces

**Solution**: EMalgorithm provides efficient iterative approach

### Complete Data Likelihood

If latent variables were observed, MLE would be easy:

$$p(\mathbf{x}, \mathbf{z}|\theta) \text{ (complete-data likelihood)}$$

EM uses this as a proxy by taking expectation.

## Expectation Maximization Algorithm

### Iterative Procedure

Starting with initial guess $\theta^{(0)}$, repeat:

**Expectation (E) Step:**
$$Q(\theta|\theta^{t}) = \mathbb{E}_{\mathbf{z}|\mathbf{x}, \theta^{(t)}}[\log p(\mathbf{x}, \mathbf{z}|\theta)]$$

**Maximization (M) Step:**
$$\theta^{(t+1)} = \arg\max_\theta Q(\theta|\theta^{t})$$

### E-Step: Expected Complete-Data Log-Likelihood

$$Q(\theta|\theta^{(t)}) = \sum_{\mathbf{z}} p(\mathbf{z}|\mathbf{x}, \theta^{(t)}) \log p(\mathbf{x}, \mathbf{z}|\theta)$$

**Interpretation:**
- $p(\mathbf{z}|\mathbf{x}, \theta^{(t)})$ = posterior probability of latent variables given current parameters
- Weight complete-data likelihood by posterior probabilities

### M-Step: Parameter Update

$$\theta^{(t+1)} = \arg\max_\theta Q(\theta|\theta^{t})$$

**Key Property**: Often has **closed-form solution**!
- No inner optimization loop needed
- Computationally efficient

### Convergence Guarantee

**Theorem**: EM increases observed data likelihood at each iteration:

$$\log p(\mathbf{x}|\theta^{(t+1)}) \geq \log p(\mathbf{x}|\theta^{(t)})$$

**Implication:**
- Sequence of likelihoods is monotonically non-decreasing
- Converges to local maximum (possibly not global)

<EMVisualizer />

## Gaussian Mixture Models (GMM)

### Model Definition

$$p(\mathbf{x}|\theta) = \sum_{k=1}^{K} \pi_k \mathcal{N}(\mathbf{x}|\boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)$$

**Components:**
- $K$ = number of clusters
- $\pi_k$ = mixture weight (prior probability of cluster $k$)
- $\mathcal{N}(\mathbf{x}|\boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)$ = Gaussian component with mean $\boldsymbol{\mu}_k$ and covariance $\boldsymbol{\Sigma}_k$

### Latent Variables

**Latent indicator**: $z_i \in \{1, \ldots, K\}$
- Indicates which cluster generated sample $i$
- Unobserved in data

**Prior**: $P(z_i = k) = \pi_k$ (mixing coefficient)

### EM for GMM

#### E-Step: Compute Responsibilities

Responsibility of cluster $k$ for sample $i$:

$$\gamma_{ik} = p(z_i = k|\mathbf{x}_i, \theta) = \frac{\pi_k \mathcal{N}(\mathbf{x}_i|\boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(\mathbf{x}_i|\boldsymbol{\mu}_j, \boldsymbol{\Sigma}_j)}$$

**Interpretation:**
- $\gamma_{ik} = 1$: sample $i$ certainly from cluster $k$
- $\gamma_{ik} = 0.5$: sample $i$ equally likely from clusters
- Soft assignment (fractional membership)

#### M-Step: Update Parameters

Effective cluster size:
$$N_k = \sum_{i=1}^m \gamma_{ik}$$

**Update mixture weight**:
$$\pi_k^{new} = \frac{N_k}{m}$$

**Update cluster mean**:
$$\boldsymbol{\mu}_k^{new} = \frac{1}{N_k} \sum_{i=1}^m \gamma_{ik} \mathbf{x}_i$$

**Update cluster covariance**:
$$\boldsymbol{\Sigma}_k^{new} = \frac{1}{N_k} \sum_{i=1}^m \gamma_{ik} (\mathbf{x}_i - \boldsymbol{\mu}_k^{new})(\mathbf{x}_i - \boldsymbol{\mu}_k^{new})^T$$

**Observations:**
- Mean: Weighted average of data points
- Covariance: Weighted scatter matrix
- Weights: Responsibilities from E-step

### Log-Likelihood for GMM

After M-step, compute:

$$\log p(\mathbf{x}|\theta) = \sum_{i=1}^m \log\left(\sum_{k=1}^K \pi_k \mathcal{N}(\mathbf{x}_i|\boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)\right)$$

Check for convergence: $|\log p^{new} - \log p^{old}| < \epsilon$

## Kullback-Leibler Divergence

### Definition

$$D_{\text{KL}}(p \| q) = \sum_x p(x) \log \frac{p(x)}{q(x)} \geq 0$$

**Properties:**
- Always non-negative
- Zero iff $p = q$
- Asymmetric: $D_{\text{KL}}(p \| q) \neq D_{\text{KL}}(q \| p)$

### Role in EM

**E-step minimizes KL divergence**:

E-step finds best approximation $q(\mathbf{z})$ to true posterior $p(\mathbf{z}|\mathbf{x}, \theta)$

**M-step maximizes likelihood**:

Increases observed-data log-likelihood

**Together**: Each iteration improves observable likelihood

## Convergence Analysis

### Monotonic Likelihood Increase

**Guaranteed property**:

$$\log p(\mathbf{x}|\theta^{(t+1)}) \geq \log p(\mathbf{x}|\theta^{(t)})$$

**Consequence**: Sequence bounded above, so converges

### Convergence Rate

- **Linear convergence**: Near optimum, typical convergence rate
- **Variable**: Depends on overlap between components
- **Slow in overlapping regions**: Many components in similar regions slow convergence

### Local vs Global Optima

**EM converges to local maximum** (not necessarily global!)

**Workaround**: Multiple random initializations
- Run EM with different random starting parameters
- Select best solution (highest likelihood)

### Stopping Criteria

**Likelihood-based**:
$$|\ell^{(t+1)} - \ell^{(t)}| < \epsilon_{\text{likelihood}}$$

**Parameter-based**:
$$\|\theta^{(t+1)} - \theta^{(t)}\| < \epsilon_{\text{parameter}}$$

**Fixed iterations**: Stop after max iterations

## Comparison: EM vs K-means

| Aspect | K-means | EM/GMM |
|--------|---------|--------|
| **Assignment** | Hard (winner-take-all) | Soft (probabilistic) |
| **Objective** | Minimize within-cluster variance | Maximum likelihood |
| **Probabilistic** | No | Yes |
| **Uncertainty** | None | Provided via responsibilities |
| **Convergence** | Fast | Slower but guaranteed |
| **Model** | Geometric | Probabilistic |

**K-means**: Limiting case of EM as cluster variances $\to 0$

## EM with Constraints

### Constrained Covariances

**Spherical**: $\boldsymbol{\Sigma}_k = \sigma_k^2 \mathbf{I}$
- Equal variance in all directions
- Fewer parameters to estimate

**Diagonal**: Constrain off-diagonal elements to zero
- No correlation between features
- Simplifies computation

**Tied**: Share covariance across clusters $\Sigma_k = \Sigma$ for all $k$
- Assumes similar cluster shapes
- Reduces overfitting with few samples

### Implementation

M-step modified to enforce constraints:
- Project covariance to constrained set
- Often maintains closed-form solution

## Advantages and Disadvantages

### Advantages ✓

1. **Principled framework**: Based on maximum likelihood
2. **Closed-form M-step**: For exponential family distributions (including Gaussians)
3. **Numerical stability**: Works in log-space
4. **Flexibility**: Applies to many probabilistic models
5. **Convergence guaranteed**: Monotonic likelihood increase

### Disadvantages ✗

1. **Local optima**: Requires good initialization or multiple runs
2. **Computational cost**: Each iteration processes all data
3. **Parameter specification**: Must choose number of components $K$
4. **Slow convergence**: Often slower than gradient-based methods
5. **Probabilistic model required**: Cannot handle non-probabilistic settings

## Applications

### 1. Clustering (GMM)
- Soft clustering with uncertainties
- Automatic model selection via BIC/AIC

### 2. Sequence Modeling (HMM)
- Speech recognition: Viterbi training
- Gene finding: EM for HMM parameters

### 3. Missing Data
- Impute missing values using learned distribution
- Multiple imputation via EM

### 4. Factor Models
- Matrix factorization
- Latent Dirichlet Allocation (for text)

### 5. Semi-supervised Learning
- Learn from labeled and unlabeled data
- Unlabeled data provides additional likelihood signal

## Model Selection for GMM

### Determining K (Number of Components)

**Elbow method**:
- Plot likelihood vs K
- Choose K at "elbow" (where improvement slows)

**Information Criteria**:
- AIC: $\text{AIC} = -2\ell(\theta) + 2p$
- BIC: $\text{BIC} = -2\ell(\theta) + p\log m$
- Lower is better

**Cross-validation**:
- Split data into train/test
- Fit with different K, evaluate test likelihood

## Extensions and Variations

### Incremental EM
Process data in batches for large datasets

### Variational EM
Approximate intractable E-step with variational inference

### Expectation Conditional Maximization (ECM)
Conditional maximization in M-step (often more stable)

### Hard EM
Use MAP estimate instead of posterior (faster, simpler)

## Summary

| Concept | Key Idea |
|---------|----------|
| **E-Step** | Infer latent variable posteriors |
| **M-Step** | Maximize complete-data likelihood |
| **Convergence** | Monotonic likelihood increase |
| **GMM** | Classic EM application for clustering |
| **Responsibilities** | Soft cluster assignments from E-step |
| **Closed-form** | M-step often has analytical solution |
