# Naive Bayes & Gaussian Bayes Classifier

## Overview

The **Generative Bayes Classifier** computes the posterior $p(y \mid x)$ by modelling the class-conditional distribution $p(x \mid y)$ and the prior $p(y)$, then applying Bayes' theorem. When individual features are assumed independent, the model is called **Naive Bayes**.

::: tip Mock Exam Connection
Section 4 of the 2025 mock exam (8P.) is a full numeric Bayes classification problem: identify the model type, compute priors, likelihoods, posteriors, and make a final prediction.
:::

---

## Bayes' Theorem for Classification

$$p(y = k \mid x) = \frac{p(x \mid y = k) \; p(y = k)}{p(x)}$$

Since $p(x)$ is shared across classes, the decision rule simplifies to:

$$\hat{y} = \arg\max_k \; p(x \mid y = k) \; p(y = k)$$

**Key terms:**

| Term | Name | Meaning |
|---|---|---|
| $p(y=k)$ | Prior | Class frequency in training data |
| $p(x \mid y=k)$ | Likelihood | How likely features are given the class |
| $p(y=k \mid x)$ | Posterior | What we want to estimate |
| $p(x)$ | Evidence | Normalising constant |

---

## Naive Bayes Assumption

When features are **conditionally independent** given the class:

$$p(x \mid y = k) = \prod_{j=1}^d p(x_j \mid y = k)$$

This factorises the joint likelihood into per-feature likelihoods — much easier to estimate.

### Gaussian Naive Bayes

If each feature $x_j$ is Gaussian given the class:

$$p(x_j \mid y = k) = \mathcal{N}(x_j \mid \mu_{jk}, \sigma_{jk}^2) = \frac{1}{\sqrt{2\pi\sigma_{jk}^2}} \exp\!\left(-\frac{(x_j - \mu_{jk})^2}{2\sigma_{jk}^2}\right)$$

The full likelihood for $f$ features:

$$p(x \mid y = k) = \prod_{j=1}^f \frac{1}{\sqrt{2\pi\sigma_{j}^2}} \exp\!\left(-\sum_{j=1}^f \frac{(x_j - \mu_{jk})^2}{2\sigma_{j}^2}\right)$$

---

## LDA vs Naive Bayes Comparison

Both are generative Gaussian models; they differ in covariance structure:

| Model | Covariance Assumption | Boundaries |
|---|---|---|
| **Naive Bayes (Gaussian)** | Diagonal, class-specific $\Sigma_k = \text{diag}(\sigma^2)$ | Quadratic |
| **LDA** | Shared across classes $\Sigma_1 = \Sigma_2 = \Sigma$ | Linear |
| **QDA** | Class-specific full covariance $\Sigma_k$ | Quadratic |

<LDAVisualizer />

---

## Worked Example (2025 Exam Q4.1)

**Setup:**
- Classes: $y=0$ (Iris Versicolor, 60% of data), $y=1$ (Iris Virginica, 40%)
- Features: sepal width $x_1$, sepal length $x_2$ (assumed independent)
- Class means: $\mu_0 = (2.5, 5)$, $\mu_1 = (3, 7)$
- Shared variances: $\sigma^2 = (1, 2)$
- New sample: $x = (4, 4)$

### Step 1 — Priors

$$p(y=0) = 0.6, \quad p(y=1) = 0.4$$

### Step 2 — Likelihoods

Using $p(x_j \mid y) = \mathcal{N}(x_j \mid \mu_j, \sigma_j^2)$:

For $p(x \mid y=0)$:
$$p(x_1=4 \mid y=0) = \mathcal{N}(4 \mid 2.5, 1) = \frac{1}{\sqrt{2\pi}} e^{-\frac{(4-2.5)^2}{2}} \approx 0.0295$$
$$p(x_2=4 \mid y=0) = \mathcal{N}(4 \mid 5, 2) = \frac{1}{\sqrt{4\pi}} e^{-\frac{(4-5)^2}{4}} \approx 0.220$$
$$p(x \mid y=0) \approx 0.0295 \times 0.220 \approx 0.00649$$

For $p(x \mid y=1)$:
$$p(x_1=4 \mid y=1) = \mathcal{N}(4 \mid 3, 1) \approx 0.242$$
$$p(x_2=4 \mid y=1) = \mathcal{N}(4 \mid 7, 2) \approx 0.0648$$
$$p(x \mid y=1) \approx 0.242 \times 0.0648 \approx 0.01568$$

> Likelihood ratio $p(x|y=0)/p(x|y=1) \approx 0.413$ — the sample is more likely under class 1.

### Step 3 — Posteriors (Bayes formula)

$$\text{Unnormalised:}\quad \pi_0 = 0.6 \times 0.00649 \approx 0.00389, \quad \pi_1 = 0.4 \times 0.01568 \approx 0.00627$$

$$p(y=0 \mid x) = \frac{\pi_0}{\pi_0 + \pi_1} \approx \frac{0.00389}{0.01016} \approx 0.383$$

$$p(y=1 \mid x) = \frac{\pi_1}{\pi_0 + \pi_1} \approx 0.617$$

### Step 4 — Decision

$$\hat{y} = \arg\max \{0.383, 0.617\} = 0 \quad \text{Wait — } p(y=1) > p(y=0)$$

Actually $p(y=1 \mid x) \approx 0.617$, so the sample is classified as **$y=1$ (Iris Virginica)**.

> The prior favoured class 0, but the likelihood strongly pulled toward class 1.

---

## Log-Space Computation

For numerical stability (products of small numbers), work in log-space:

$$\log p(x \mid y = k) = -\frac{1}{2} \sum_j \frac{(x_j - \mu_{jk})^2}{\sigma_j^2} - \frac{1}{2} \sum_j \log(2\pi\sigma_j^2)$$

Decision: $\hat{y} = \arg\max_k \left[ \log p(x \mid y=k) + \log p(y=k) \right]$

---

## Summary

| Step | Formula |
|---|---|
| Prior | $p(y=k)$ from training class frequencies |
| Likelihood | $\prod_j \mathcal{N}(x_j \mid \mu_{jk}, \sigma_j^2)$ (Naive Bayes) |
| Posterior | $\propto$ Likelihood $\times$ Prior |
| Decision | Class with highest posterior |
| Model type | **Generative** — models $p(x \mid y)$ |
