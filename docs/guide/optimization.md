# Optimization

## Overview

Optimization is the foundation of machine learning. This lecture covers fundamental techniques for finding optimal model parameters including gradient descent, line search methods, and Newton's method.

## Fundamental Concepts

### Convexity

A function $f$ is **convex** if for all $x, y$ in its domain and $0 \leq \theta \leq 1$:

$$f(\theta x + (1-\theta)y) \leq \theta f(x) + (1-\theta)f(y)$$

**Key Properties:**
- Convex functions have unique global minimum
- Any local minimum is the global minimum
- First-order optimality conditions are sufficient
- Many machine learning problems are convex

### Optimality Conditions

**First-order necessary condition** (critical point):
$$\nabla f(x^*) = 0$$

**Second-order sufficient condition** (for local minimum):
$$H(x^*) \text{ is positive semi-definite}$$

where $H$ is the Hessian matrix of second derivatives.

## Gradient Descent

### Basic Algorithm

Start with $x_0$, then iterate:

$$x_{k+1} = x_k - \alpha_k \nabla f(x_k)$$

where:
- $\alpha_k$ = step size (learning rate at iteration $k$)  
- $\nabla f(x_k)$ = gradient at current point

**Direction**: Negative gradient is the direction of steepest descent

**Convergence**: With proper step sizes and for convex functions, converges to global minimum

<OptimizationVisualizer />

### Steepest Descent Direction

The gradient descent direction is the direction with maximum rate of decrease:

$$p_k = -\nabla f(x_k)$$

This is the **steepest descent direction** in Euclidean norm.

### Learning Rate (Step Size)

**Fixed step size**: $\alpha_k = \alpha$ for all $k$
- **Pro**: Simple to implement
- **Con**: May oscillate or diverge

**Decreasing step size**: $\alpha_k = \alpha_0 / k$ or $\alpha_k = \alpha_0 / \sqrt{k}$
- **Pro**: Guaranteed convergence for convex functions
- **Con**: Requires tuning decay rate

**Adaptive step size**: Determined by line search

### Convergence Rates

- **Linear convergence**: $\|x_k - x^*\| \leq c \rho^k$ with $\rho < 1$
- **Superlinear convergence**: $\|x_{k+1} - x^*\| \leq c_k \|x_k - x^*\|$ with $c_k \to 0$
- **Quadratic convergence**: $\|x_{k+1} - x^*\| \leq c \|x_k - x^*\|^2$

## Line Search Methods

### Purpose

Find good step size $\alpha_k$ to make progress toward optimum efficiently.

### Exact Line Search

**Definition**: Find optimal step size:

$$\alpha^* = \arg\min_{\alpha > 0} f(x_k - \alpha \nabla f(x_k))$$

**Advantages:**
- Takes optimal step in descent direction
- Theoretical convergence guarantees

**Disadvantages:**
- Computationally expensive
- May solve optimization problem within optimization problem

### Inexact Line Search: Armijo Condition

**Armijo Condition** (sufficient decrease):

$$f(x_k + \alpha_k p_k) \leq f(x_k) + c_1 \alpha_k \nabla f(x_k)^T p_k$$

where:
- $0 < c_1 < 1$ (typically $c_1 = 10^{-4}$)
- $p_k$ = descent direction
- Ensures sufficient progress along direction

### Armijo-Goldstein Backtracking

**Algorithm:**
1. Start with $\alpha = 1$
2. While Armijo condition not satisfied:
   - $\alpha \leftarrow \beta \alpha$ (with $\beta = 0.5$)
3. Return current $\alpha$

**Efficiency**: Typically finds acceptable step size in few iterations

## Newton's Method

### Quadratic Approximation

Approximate $f$ near $x_k$ using second-order Taylor expansion:

$$m_k(p) = f(x_k) + \nabla f(x_k)^T p + \frac{1}{2} p^T H_k p$$

where:
- $H_k$ = Hessian matrix of second derivatives at $x_k$
- $p$ = search direction

### Newton Update

Minimize quadratic approximation by setting $\nabla m_k(p^*) = 0$:

$$H_k p^* = -\nabla f(x_k)$$

$$p^* = -H_k^{-1} \nabla f(x_k)$$

**Update rule:**
$$x_{k+1} = x_k - H_k^{-1} \nabla f(x_k)$$

### Convergence Properties

**Near optimum**, Newton's method achieves **quadratic convergence**:

$$\|x_{k+1} - x^*\| \leq c \|x_k - x^*\|^2$$

This means error squares each iteration—extremely fast convergence!

### Advantages and Disadvantages

**Advantages:**
- Quadratic convergence near optimum
- Fewer iterations than gradient descent
- Uses second-order information

**Disadvantages:**
- Computing and storing Hessian expensive ($O(d^2)$ space)
- Inverting Hessian expensive ($O(d^3)$ time)
- Must invert Hessian at each iteration
- Hessian may be singular or non-positive-definite

### Practical Variants

**Quasi-Newton Methods**: Approximate Hessian using gradient information
- BFGS: Rank-2 update of Hessian approximation
- L-BFGS: Limited-memory version for large-scale problems

**Gauss-Newton** (for least squares):
- Uses approximate Hessian (avoids computing second derivatives)
- Often works well in practice

## Constrained Optimization with Lagrange Multipliers

### Problem Formulation

$$\min_x f(x)$$
$$\text{subject to: } g_i(x) \leq 0, \quad h_j(x) = 0$$

### Lagrangian

$$L(x, \lambda, \mu) = f(x) + \sum_i \lambda_i g_i(x) + \sum_j \mu_j h_j(x)$$

where:
- $\lambda_i \geq 0$ = Lagrange multipliers for inequality constraints
- $\mu_j$ = Lagrange multipliers for equality constraints

### KKT Conditions

At optimum:
1. **Stationarity**: $\nabla_x L = 0$
2. **Primal feasibility**: $g_i(x^*) \leq 0$, $h_j(x^*) = 0$
3. **Dual feasibility**: $\lambda_i^* \geq 0$
4. **Complementary slackness**: $\lambda_i^* g_i(x^*) = 0$

### Practical Approaches

**Penalty methods**: Add constraint violations to objective  
**Barrier methods**: Interior point methods  
**Augmented Lagrangian**: Hybrid approach

## Applications in Machine Learning
- Better local behavior than gradient descent

**Disadvantages:**
- Expensive Hessian computation and inversion
- Requires Hessian to be positive definite

<PlotlyChart 
  :data="newtonComparisonData"
  :layout="newtonLayout"
  title="Gradient Descent vs Newton's Method"
  description="Comparison of convergence speed: Newton's method converges faster"
/>

## Constrained Optimization

### Lagrange Multipliers

For equality constraints:

$$\min_x f(x) \text{ subject to } g(x) = 0$$

Lagrangian:

$$L(x, \lambda) = f(x) + \lambda g(x)$$

At optimum:

$$\nabla_x L = \nabla f + \lambda \nabla g = 0$$
$$\nabla_\lambda L = g = 0$$

### KKT Conditions

For inequality constraints, the Karush-Kuhn-Tucker (KKT) conditions generalize Lagrange multipliers.

## Practical Considerations

1. **Initialization**: Start close to optimum for better convergence
2. **Step Size**: Critical parameter affecting convergence
3. **Termination**: Use appropriate convergence criteria
4. **Preconditioning**: Scale features for better conditioning

---

<script setup>
import { reactive } from 'vue'

// Convexity visualization
const convexityData = reactive([
  {
    x: Array.from({length: 100}, (_, i) => i / 10 - 5),
    y: Array.from({length: 100}, (_, i) => {
      const x = i / 10 - 5
      return x * x
    }),
    name: 'Convex: x²',
    type: 'scatter'
  },
  {
    x: Array.from({length: 100}, (_, i) => i / 10 - 5),
    y: Array.from({length: 100}, (_, i) => {
      const x = i / 10 - 5
      return Math.sin(x) * Math.exp(-x * x / 10)
    }),
    name: 'Non-convex',
    type: 'scatter'
  }
])

const convexityLayout = {
  title: '',
  xaxis: { title: 'x' },
  yaxis: { title: 'f(x)' },
  showlegend: true
}

// Gradient descent demo
function generateGradientDescent(values) {
  const lr = values.learningRate || 0.1
  const iters = values.iterations || 50
  
  const x = []
  const y = []
  
  let xi = -5
  for (let i = 0; i < iters; i++) {
    x.push(xi)
    y.push(xi * xi + 2 * xi + 1)
    const grad = 2 * xi + 2
    xi -= lr * grad
  }
  
  return {
    data: [
      {
        x: Array.from({length: 100}, (_, i) => i / 20 - 5),
        y: Array.from({length: 100}, (_, i) => {
          const x_val = i / 20 - 5
          return x_val * x_val + 2 * x_val + 1
        }),
        name: 'f(x)',
        type: 'scatter'
      },
      {
        x,
        y,
        name: 'GD path',
        mode: 'markers+lines',
        type: 'scatter'
      }
    ],
    layout: {
      title: '',
      xaxis: { title: 'x' },
      yaxis: { title: 'f(x)' },
      showlegend: true
    },
    output: `Learning Rate: ${lr.toFixed(3)}\nIterations: ${iters}\nFinal x: ${xi.toFixed(4)}`
  }
}

// Line search visualization
const lineSearchData = reactive([
  {
    x: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    y: [1.0, 0.78, 0.62, 0.53, 0.51, 0.56, 0.68, 0.87, 1.13, 1.46, 1.86],
    name: 'f(x + αp)',
    type: 'scatter',
    mode: 'lines+markers'
  },
  {
    x: [0, 1.0],
    y: [1.0, 1.0 - 0.0001],
    name: 'Armijo condition',
    type: 'scatter',
    mode: 'lines'
  }
])

const lineSearchLayout = {
  title: '',
  xaxis: { title: 'Step size α' },
  yaxis: { title: 'f(x + αp)' },
  showlegend: true
}

// Newton vs GD comparison
const newtonComparisonData = reactive([
  {
    x: [0, 1, 2, 3, 4, 5],
    y: [10, 2.5, 0.6, 0.15, 0.04, 0.01],
    name: 'Gradient Descent',
    type: 'scatter',
    mode: 'lines+markers'
  },
  {
    x: [0, 1, 2],
    y: [10, 0.01, 0.0001],
    name: "Newton's Method",
    type: 'scatter',
    mode: 'lines+markers'
  }
])

const newtonLayout = {
  title: '',
  xaxis: { title: 'Iteration' },
  yaxis: { title: 'Error (log scale)', type: 'log' },
  showlegend: true
}
</script>
