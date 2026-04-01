# Duality in Optimization

## Overview

Duality theory provides powerful insights into optimization problems and enables efficient solution algorithms.

## The Dual Problem

For a primal problem:

$$\min_x f(x) \text{ subject to } g_i(x) \leq 0, h_j(x) = 0$$

The Lagrangian is:

$$L(x, \lambda, \mu) = f(x) + \sum_i \lambda_i g_i(x) + \sum_j \mu_j h_j(x)$$

The dual function:

$$g(\lambda, \mu) = \min_x L(x, \lambda, \mu)$$

The dual problem:

$$\max_{\lambda, \mu} g(\lambda, \mu) \text{ subject to } \lambda_i \geq 0$$

## Duality Gap

$$\text{Duality Gap} = f(x^*) - g(\lambda^*, \mu^*)$$

- **Weak duality**: Always satisfied, $g(\lambda, \mu) \leq f(x^*)$
- **Strong duality**: Gap is zero under convexity and constraint qualification
- **Slater's Condition**: Sufficient condition for strong duality

## KKT Conditions

At optimum for convex problems:

1. **Stationarity**: $\nabla f(x^*) + \sum_i \lambda_i^* \nabla g_i(x^*) + \sum_j \mu_j^* \nabla h_j(x^*) = 0$
2. **Primal Feasibility**: $g_i(x^*) \leq 0$, $h_j(x^*) = 0$
3. **Dual Feasibility**: $\lambda_i^* \geq 0$
4. **Complementary Slackness**: $\lambda_i^* g_i(x^*) = 0$

## Applications to SVM

The SVM dual enables:
- **Kernel trick**: Solution depends only on $\langle x_i, x_j \rangle$
- **Efficient algorithms**: Coordinate descent (SMO)
- **Sparse solutions**: Support vectors only

---

[Full content for Duality lecture continues...]
