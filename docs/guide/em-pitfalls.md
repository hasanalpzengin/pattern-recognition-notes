# EM Algorithm: Pitfalls & Regularisation

## Overview

The core EM algorithm is covered in the [Expectation Maximization](/guide/em-algorithm) page. This page focuses on **practical failure modes**, **why EM is not guaranteed to find the global optimum**, and **how to regularise GMMs** to avoid degenerate solutions — the exact topics tested in 2026 mock Q6.3–Q6.5.

::: tip Mock Exam Connection
Q6.1–Q6.5 of the 2026 exam probe: latent variable likelihood geometry, responsibility semantics, convergence guarantees, MAP vs MLE, and component collapse.
:::

---

## What EM Is Guaranteed To Do

EM guarantees a **monotonic non-decreasing observed-data log-likelihood** at every full iteration (E + M step):

$$\ell(\theta^{(t+1)}) \geq \ell(\theta^{(t)})$$

This follows from the ELBO bound:

$$\ell(\theta) \geq Q(\theta \mid \theta^{(t)}) - \text{const.}$$

The M-step increases $Q$; the E-step tightens the bound.

**What EM does NOT guarantee:**
- Global maximum of $\ell(\theta)$
- Unique solution
- Fast convergence

---

## Local Optima and Initialisation

The observed-data log-likelihood of a GMM is **non-convex** (a sum of logs of sums → difficult structure). Multiple stationary points exist.

```
 ℓ(θ)
  │         ←global→           ←local optima →
  │           ┌──┐           ┌─┐       ┌──┐
  │          /    \         / \       /    \
  │─────────/      ────────/   \─────/      \──────
  └──────────────────────────────────────────── θ
```

Starting from different initialisations, EM can converge to different local optima.

**Practical remedy:** Run EM multiple times with diverse random initialisations (e.g. via k-means seeds) and select the solution with the highest $\ell(\theta)$.

---

## Fixed Points vs Local Maxima

A fixed point of EM (where parameters stop changing) can be:
- A genuine **local maximum**
- A **saddle point** of $\ell(\theta)$ — a stationary point that is neither a max nor a min

> **Exam Q6.5-C:** "A fixed point of the EM algorithm may correspond to a saddle point of the observed-data log-likelihood rather than a strict local maximum." ✓ TRUE

---

## Component Collapse (Degeneracy)

A notorious failure mode: a Gaussian component $k$ collapses onto a single data point $x_n$:

$$\mu_k \to x_n, \quad \Sigma_k \to \mathbf{0}$$

As $\Sigma_k \to \mathbf{0}$, $\mathcal{N}(x_n \mid \mu_k, \Sigma_k) \to \infty$, so $\ell(\theta) \to \infty$. This is a **degenerate singularity** in the likelihood surface — the maximum likelihood problem for a GMM is unbounded!

### Why it happens

No constraint forces component covariances to stay finite. Any component that claims sole responsibility for one outlier point can drive its variance to zero for unbounded likelihood gain.

### Remedies

| Strategy | Description |
|---|---|
| Covariance floor | Force $\Sigma_k \succeq \epsilon I$ — clip eigenvalues from below |
| MAP estimation | Add a Wishart prior on $\Sigma_k$; MAP objective is bounded |
| Component restart | Detect collapsed components; re-initialise from largest component |
| Tied covariance | Share one $\Sigma$ across all components |

---

## MAP Estimation and the EM M-Step

Incorporating prior $p(\theta)$ via MAP modifies the M-step objective:

$$\theta^{(t+1)} = \arg\max_\theta \left[ Q(\theta \mid \theta^{(t)}) + \log p(\theta) \right]$$

- **MLE** uses only $Q$; **MAP** adds $\log p(\theta)$.
- With a **uniform prior**, MAP reduces to MLE.
- For a conjugate Wishart prior on $\Sigma_k$, the MAP update adds pseudo-counts that prevent collapse.

> **Exam Q6.4-A:** "MLE depends only on likelihood; MAP additionally depends on prior." ✓  
> **Exam Q6.4-B:** "Uniform prior → MAP = MLE." ✓

---

## EM vs Full Gradient-Based Optimisation

| Property | EM | Gradient Ascent |
|---|---|---|
| Convergence | Monotone likelihood increase | Not guaranteed without line search |
| Speed | Often slow near optimum | Can be faster with step-size tuning |
| Closed-form updates | Yes (exponential family) | Requires gradient computation |
| Local optima | Yes | Yes |

---

## Interactive EM Demo

Use the visualiser below to observe slow convergence (try high cluster overlap) and degenerate initialisations (try $k=3$ or $k=4$ with the default data).

<EMVisualizer />

---

## Convergence Diagnosis

Track the log-likelihood at each iteration. Watch for:
- **Slow progress**: components in overlapping regions
- **Sudden jump**: component restart triggered
- **Plateau**: converged to local optimum

**Stopping criteria:**
$$|\ell^{(t+1)} - \ell^{(t)}| < \epsilon \quad \text{or} \quad \max_k \|\mu_k^{(t+1)} - \mu_k^{(t)}\| < \delta$$

---

## Summary

| Pitfall | Root Cause | Fix |
|---|---|---|
| Local optimum | Non-convex $\ell(\theta)$ | Multiple restarts |
| Saddle-point fixed point | EM only moves uphill, does not climb out of saddle | Perturbation / restart |
| Component collapse | Unlimited variance shrinkage | Covariance floor / MAP |
| Slow convergence | Large overlap, bad initialisation | k-means init, split-and-merge |
