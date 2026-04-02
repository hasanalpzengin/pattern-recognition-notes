# Optimization Cheat Sheet: Lagrangian, KKT & Duality

## Overview

Constrained optimisation theory underpins both the SVM derivation and the 2025/2026 exam optimization questions. This cheat sheet covers, step by step, everything needed to set up the Lagrangian, derive the dual, check KKT conditions, and apply Slater's condition.

::: tip Mock Exam Connection
Q7.1 (2025, 9P.) and Q5.1 (2026, 6P.) are direct multiple-step dual-derivation problems. Both follow exactly the pattern on this page.
:::

---

## Standard Form of a Constrained Optimisation Problem

$$\min_{x \in \mathbb{R}^n}\; f_0(x)$$
$$\text{s.t.}\; f_i(x) \leq 0 \quad i=1,\ldots,m$$
$$\quad\quad\; h_j(x) = 0 \quad j=1,\ldots,p$$

> **Step 0 for any exam problem:** Convert ALL constraints to $f_i(x) \leq 0$ form FIRST.
> - $g(x) \geq c \;\Longrightarrow\; c - g(x) \leq 0$
> - $g(x) = c \;\Longrightarrow\; g(x) \leq c$ AND $g(x) \geq c$ (two constraints, or equality multiplier)

---

## The Lagrangian

Introduce multipliers $\lambda_i \geq 0$ (inequality) and $\nu_j \in \mathbb{R}$ (equality):

$$L(x, \lambda, \nu) = f_0(x) + \sum_{i=1}^m \lambda_i f_i(x) + \sum_{j=1}^p \nu_j h_j(x)$$

**Reading rule:** Each constraint $f_i(x) \leq 0$ contributes the term $+\lambda_i f_i(x)$ with $\lambda_i \geq 0$.

---

## Dual Function and Weak Duality

The dual function:

$$g(\lambda, \nu) = \inf_{x} L(x, \lambda, \nu)$$

**Weak duality:** For any $\lambda \geq 0$ and any $\nu$:

$$g(\lambda, \nu) \leq p^\star$$

where $p^\star$ is the primal optimal value. The dual function is always a **lower bound on the primal optimum** — this holds even for non-convex problems!

**Dual problem:** Maximise the tightest lower bound:

$$d^\star = \max_{\lambda \geq 0, \nu} g(\lambda, \nu)$$

**Duality gap:** $p^\star - d^\star \geq 0$ (always non-negative by weak duality).

---

## Strong Duality

**Strong duality** holds when $d^\star = p^\star$ (no duality gap).

Sufficient conditions:
1. **Slater's condition** (constraint qualification): the problem is convex AND there exists a strictly feasible point $x$ with $f_i(x) < 0$ for all inequality constraints.
2. Many other constraint qualifications (LICQ, MFCQ, etc.)

> **Exam fact:** For non-convex problems, strong duality can fail even if primal and dual are feasible.

---

## KKT Conditions

At the primal-dual optimum $(x^\star, \lambda^\star, \nu^\star)$:

| Condition | Equation |
|---|---|
| **Stationarity** | $\nabla_x L(x^\star, \lambda^\star, \nu^\star) = 0$ |
| **Primal feasibility** | $f_i(x^\star) \leq 0$, $h_j(x^\star) = 0$ |
| **Dual feasibility** | $\lambda_i^\star \geq 0$ |
| **Complementary slackness** | $\lambda_i^\star f_i(x^\star) = 0$ |

**Complementary slackness** says: either $\lambda_i = 0$ (constraint inactive) or $f_i(x^\star) = 0$ (constraint active, boundary point). Both cannot be nonzero simultaneously.

> **Note:** The Hessian of $L$ being positive definite is **NOT** a KKT condition — it is a second-order sufficiency condition for a local minimum.

---

## Step-by-Step Recipe (Exam Use)

1. **Write the primal** in standard form ($f_i(x) \leq 0$).
2. **Form the Lagrangian** $L(x,\lambda) = f_0(x) + \sum \lambda_i f_i(x)$.
3. **Minimise over primal variables** — set $\nabla_x L = 0$, solve for $x^\star(\lambda)$.
4. **Substitute back** to get $g(\lambda) = L(x^\star(\lambda), \lambda)$.
5. **Maximise dual** — solve $\max_{\lambda \geq 0} g(\lambda)$.

---

## Worked Example (2026 Exam Q5.1)

**Problem:** Minimise $\frac{1}{2}\|x\|^2$ subject to $x_1 + x_2 \geq 4$.

**Step 1 (Standard form):**  
Constraint $x_1 + x_2 \geq 4 \Rightarrow f_1(x) = 4 - x_1 - x_2 \leq 0$.

**Step 2 (Lagrangian):**  
$$L(x, \lambda) = \frac{1}{2}(x_1^2 + x_2^2) + \lambda(4 - x_1 - x_2)$$

**Step 3 (Minimise over $x$):**  
$$\frac{\partial L}{\partial x_1} = x_1 - \lambda = 0 \Rightarrow x_1 = \lambda$$  
$$\frac{\partial L}{\partial x_2} = x_2 - \lambda = 0 \Rightarrow x_2 = \lambda$$

**Step 4 (Dual function):**  
$$g(\lambda) = \frac{1}{2}(\lambda^2 + \lambda^2) + \lambda(4 - \lambda - \lambda) = \lambda^2 + 4\lambda - 2\lambda^2 = 4\lambda - \lambda^2$$

**Step 5 (Maximise dual):**  
$$\frac{dg}{d\lambda} = 4 - 2\lambda = 0 \Rightarrow \lambda^\star = 2, \quad d^\star = 4$$

**Primal solution:** $x_1^\star = x_2^\star = 2$, $p^\star = \frac{1}{2}(4+4) = 4 = d^\star$ ✓ (strong duality, Slater satisfied).

---

## Interactive Visualizer — Dual Lower Bound

Use the optimiser below to see the primal objective landscape and understand how the Lagrange dual lower-bounds the optimum.

<OptimizationVisualizer />

---

## Worked Example (2025 Exam Q7.1 Structure)

**Problem:** Minimise $3\alpha + \sum_i \phi_i$ subject to $y_i \geq \alpha^T x_i + \alpha_0 + \phi_i$ and $\phi_i \leq 0$.

The Lagrangian adds multipliers $\lambda_i \geq 0$ for the first constraints and $\mu_i \geq 0$ for $\phi_i \leq 0$:

$$L(\alpha, \alpha_0, \phi, \lambda, \mu) = 3\alpha + \sum_i \phi_i + \sum_i \lambda_i(y_i - \alpha^T x_i - \alpha_0 - \phi_i) - \sum_i \mu_i \phi_i$$

Note the sign convention: constraint $f(x) \leq 0$ means a sign flip from $y_i \geq \cdots$ form.

**Dual function** $g(\lambda,\mu) = \inf L$ — the infimum over primal variables.

**Weak duality** guarantees $g(\lambda,\mu) \leq p^\star$ for all valid multipliers.

---

## Summary Table

| Concept | Key Point |
|---|---|
| Standard form | $f_i(x) \leq 0$ (flip $\geq$ constraints) |
| Lagrangian | $+\lambda_i f_i(x)$, $\lambda_i \geq 0$ |
| Dual function | $\inf_x L(x, \lambda)$ — concave, lower-bounds primal |
| Weak duality | $d^\star \leq p^\star$ always |
| Strong duality | $d^\star = p^\star$ if Slater's + convexity holds |
| KKT stationarity | $\nabla_x L = 0$ |
| KKT comp. slackness | $\lambda_i f_i(x^\star) = 0$ |
| Dual feasibility | $\lambda_i \geq 0$ |
