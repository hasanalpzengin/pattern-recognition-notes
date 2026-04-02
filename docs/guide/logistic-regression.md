# Logistic Regression

## Overview

Logistic Regression is the canonical **discriminative** probabilistic classifier. It models the posterior probability $p(y=1 \mid x)$ directly as a logistic sigmoid of a linear score, without making assumptions about the feature distribution $p(x \mid y)$.

::: tip Mock Exam Connection
Questions 2.1–2.5 in the 2026 mock exam are entirely about Logistic Regression: model type, sigmoid properties, decision boundary geometry, gradient ascent, and numeric boundary evaluation.
:::

---

## The Model

Given a feature vector $x \in \mathbb{R}^d$ and weight vector $\theta = [w_1, \ldots, w_d, b]^T$:

$$p(y = 1 \mid x) = \sigma(\theta^T \tilde{x}) = \frac{1}{1 + e^{-\theta^T \tilde{x}}}$$

where $\tilde{x} = [x_1, \ldots, x_d, 1]^T$ absorbs the bias.

### Discriminative vs Generative

| Property | Logistic Regression | Naive Bayes |
|---|---|---|
| What is modelled | $p(y \mid x)$ directly | $p(x \mid y)$, $p(y)$, then Bayes |
| Assumptions | Linear decision boundary | Conditional independence of features |
| Training data needed | Labels only | Same |
| Can generate samples | No | Yes |

---

## The Sigmoid Function

The **logistic sigmoid** $\sigma: \mathbb{R} \to (0,1)$ is:

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

### Key Properties

| Property | Formula |
|---|---|
| Range | $(0, 1)$ — always a valid probability |
| Monotonic | strictly increasing |
| Symmetry | $\sigma(-z) = 1 - \sigma(z)$ |
| Midpoint | $\sigma(0) = 0.5$ |
| Derivative | $\sigma'(z) = \sigma(z)(1 - \sigma(z))$ |

> **Note:** The symmetry $\sigma(-z) = 1 - \sigma(z)$ (not $-\sigma(z)$) is a classic exam question.

---

## Decision Boundary

We predict $\hat{y} = 1$ if $p(y=1 \mid x) \geq 0.5$, i.e. when $\sigma(\theta^T x) \geq 0.5$.

Since $\sigma$ is monotone, this is equivalent to $\theta^T x \geq 0$.

$$\text{Decision boundary}: \quad \theta^T x = 0 \quad \Longleftrightarrow \quad w_1 x_1 + \cdots + w_d x_d + b = 0$$

This is a **hyperplane** — always linear in the input features $x$. If you apply a nonlinear feature map $\phi(x)$, the boundary is linear in $\phi$ but nonlinear in $x$.

| Logit score $z = \theta^T x$ | Probability $\sigma(z)$ | Prediction |
|---|---|---|
| $> 0$ | $> 0.5$ | $\hat{y} = 1$ |
| $= 0$ | $= 0.5$ | On boundary |
| $< 0$ | $< 0.5$ | $\hat{y} = 0$ |

---

## Training: Maximum Log-Likelihood

The log-likelihood of training data $\{(x_i, y_i)\}_{i=1}^m$ is:

$$\mathcal{L}(\theta) = \sum_{i=1}^m \left[ y_i \log \sigma(\theta^T x_i) + (1 - y_i) \log(1 - \sigma(\theta^T x_i)) \right]$$

**Properties:**
- $\mathcal{L}(\theta)$ is **concave** in $\theta$ — every local maximum is the global maximum
- No closed-form solution (unlike linear regression)

### Gradient Ascent Update

$$\nabla_\theta \mathcal{L}(\theta) = \sum_{i=1}^m \left( y_i - \sigma(\theta^T x_i) \right) x_i$$

Update rule:
$$\theta^{(t+1)} = \theta^{(t)} + \alpha \, \nabla_\theta \mathcal{L}(\theta^{(t)})$$

### Newton–Raphson / IRLS

The Hessian $H = -\sum_i \sigma(z_i)(1-\sigma(z_i)) x_i x_i^T$ is negative semi-definite. The Newton update can be re-written as an **Iteratively Reweighted Least Squares (IRLS)** problem, which is computationally attractive.

---

## Interactive Visualizer

Use the sliders to manually explore how $w_1, w_2, b$ move the decision boundary. Click **Train** to run gradient ascent and watch the log-likelihood increase.

<LogisticRegressionVisualizer />

---

## Numerical Example (Exam Q2.5 Style)

Given $\theta = [w_1 = 1, w_2 = 1, b = -2]^T$:

1. **Boundary equation**: $x_1 + x_2 - 2 = 0 \;\Rightarrow\; x_2 = -x_1 + 2$
2. Point $(1, 1)$: $z = 1 + 1 - 2 = 0$ → on boundary → $p = 0.5$
3. Point $(2, 2)$: $z = 2 + 2 - 2 = 2 > 0$ → $p = \sigma(2) \approx 0.88 > 0.5$
4. Point $(0, 0)$: $z = 0 + 0 - 2 = -2 < 0$ → $p = \sigma(-2) \approx 0.12 < 0.5$

---

## Regularisation

Adding an $L_2$ penalty prevents overfitting by shrinking weights:

$$\mathcal{L}_{\text{reg}}(\theta) = \mathcal{L}(\theta) - \frac{\lambda}{2}\|\theta\|^2$$

This corresponds to a Gaussian prior on $\theta$ in the MAP interpretation.

---

## Summary

| Concept | Key Formula / Fact |
|---|---|
| Sigmoid | $\sigma(z) = \frac{1}{1+e^{-z}}$; symmetry $\sigma(-z)=1-\sigma(z)$ |
| Decision boundary | linear hyperplane $\theta^T x = 0$ |
| Loss | Concave log-likelihood — global optimum guaranteed |
| Gradient | $\nabla \mathcal{L} = \sum_i (y_i - \hat{p}_i) x_i$ |
| Model type | Discriminative: models $p(y\mid x)$ directly |
