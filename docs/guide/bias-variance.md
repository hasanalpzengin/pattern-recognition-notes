# Bias–Variance Tradeoff

## Overview

Every learned model commits two kinds of errors: **bias** (systematic distance from the truth) and **variance** (sensitivity to which training set we happened to draw). Understanding this tradeoff guides model selection, regularisation, and cross-validation strategy.

::: tip Mock Exam Connection
Section 5 (Evaluation) of the 2025 mock exam shows target diagrams A–D and asks which corresponds to low bias / high variance, and what each combination implies about model behaviour.
:::

---

## Bias–Variance Decomposition

For a regression target $y = f(x) + \varepsilon$ with $\mathbb{E}[\varepsilon]=0$, $\text{Var}[\varepsilon]=\sigma_\varepsilon^2$, the expected test MSE at a point $x$ is:

$$\underbrace{\mathbb{E}\left[(y - \hat{f}(x))^2\right]}_{\text{Expected MSE}} = \underbrace{\left(\text{Bias}[\hat{f}(x)]\right)^2}_{\text{Bias}^2} + \underbrace{\text{Var}[\hat{f}(x)]}_{\text{Variance}} + \underbrace{\sigma_\varepsilon^2}_{\text{Irreducible noise}}$$

where:
$$\text{Bias}[\hat{f}(x)] = \mathbb{E}[\hat{f}(x)] - f(x)$$
$$\text{Var}[\hat{f}(x)] = \mathbb{E}\left[(\hat{f}(x) - \mathbb{E}[\hat{f}(x)])^2\right]$$

---

## Intuition: Target Diagrams

Imagine shooting arrows at a bullseye. Each arrow = prediction from a model trained on one dataset. The bullseye = true target $f(x)$.

| Situation | Bias | Variance | Pattern |
|---|---|---|---|
| Arrows clustered at bullseye | Low | Low | Ideal |
| Arrows clustered away from bullseye | High | Low | Underfitting |
| Arrows spread around bullseye | Low | High | Overfitting |
| Arrows spread everywhere off-target | High | High | Useless |

---

## The Tradeoff

As **model complexity** increases (e.g. polynomial degree grows):

$$\text{Bias}^2 \searrow \quad \text{Variance} \nearrow$$

The optimal complexity minimises their sum.

```
Error
  │
  │  Training error
  │   ╲
  │    ╲______________
  │              ╱
  │ Test error  ╱
  │            ╱
  │___________╱
  └──────────────────────► Model Complexity
             ↑
       Optimal point
```

---

## Interactive Visualizer

Adjust the polynomial degree, noise level, and sample count. Watch how training and test MSE diverge as degree grows — and see the sample-fit become increasingly wiggly.

<BiasVarianceVisualizer />

---

## Connection to Machine Learning Algorithms

| Algorithm | Bias | Variance | Notes |
|---|---|---|---|
| k-NN (small k) | Low | High | Overfit to local noise |
| k-NN (large k) | High | Low | Averages out too much |
| Linear model | High | Low | Underfits nonlinear data |
| Deep neural net (no regularisation) | Low | High | Memorises training data |
| Deep neural net + dropout | Low | Low | Best of both worlds |
| Boosting | Low | Medium | Reduces bias, moderate variance |
| Bagging / Random Forest | Low (ensemble) | Low | Variance reduction by averaging |

---

## Overfitting vs Underfitting

### Underfitting (High Bias)

- Model is too simple for the task
- High training error AND high test error
- Fix: increase model capacity, use feature engineering

### Overfitting (High Variance)

- Model memorised training set — does not generalise
- Low training error but high test error
- Fix: regularisation ($L_1$, $L_2$), more data, dropout, early stopping, cross-validation

---

## Practical Diagnosis (Learning Curves)

Plot training and validation error vs. number of training samples:

- **Underfitting**: both curves converge to high error, gap is small
- **Overfitting**: large gap between training (low) and validation (high) error, gap shrinks slowly as more data is added

---

## Cross-Validation

To estimate generalisation error without sacrificing test data:

**$k$-Fold Cross-Validation:**
1. Split data into $k$ equal folds
2. For each fold $i$: train on remaining $k-1$ folds, test on fold $i$
3. Report mean ± std of $k$ test errors

$$\text{CV error} = \frac{1}{k} \sum_{i=1}^k \text{Error}_i$$

Use this to select model hyperparameters (e.g. polynomial degree, regularisation strength).

---

## Summary

| Concept | Low | High |
|---|---|---|
| **Bias** | Predictions close to truth on average | Systematic error / underfitting |
| **Variance** | Stable across datasets | Sensitive to training set / overfitting |
| **Total test error** | Bias² + Variance + Noise | — |
| **Fix** | Increase complexity / features | Regularise / more data |
