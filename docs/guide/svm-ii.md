# Support Vector Machines II

## Overview

Advanced SVM topics including kernel methods, dual optimization, and practical algorithms.

## Dual SVM Formulation

The dual problem for soft-margin SVM:

$$\max_{\alpha} \sum_i \alpha_i - \frac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j \langle x_i, x_j \rangle$$

subject to:
- $0 \leq \alpha_i \leq C$
- $\sum_i \alpha_i y_i = 0$

## The Kernel Trick

Replace dot products with kernel function:

$$k(x_i, x_j) = \langle \phi(x_i), \phi(x_j) \rangle$$

Enables non-linear classification without explicit feature transformation.

## Sequential Minimal Optimization (SMO)

Efficient algorithm for solving dual SVM:
- Solves two variables at a time
- Closed-form solutions
- Practical complexity: $O(m^2)$

## Kernel Functions

- **Linear**: $k(x, x') = \langle x, x' \rangle$
- **Polynomial**: $k(x, x') = (\langle x, x' \rangle + c)^d$
- **RBF**: $k(x, x') = \exp(-\gamma \|x - x'\|^2)$
- **Sigmoid**: $k(x, x') = \tanh(\alpha \langle x, x' \rangle + c)$

## Multi-Class SVM

- **One-vs-Rest**: $K$ binary classifiers
- **One-vs-One**: $\binom{K}{2}$ binary classifiers

---

[Full content for SVM II lecture continues...]
