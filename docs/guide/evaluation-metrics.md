# Evaluation Metrics & ROC Analysis

## Overview

Evaluation metrics translate a classifier's raw predictions into interpretable performance numbers. Understanding their definitions, inter-relationships, and threshold-dependence is essential for exam questions and real-world system design.

::: tip Mock Exam Connection
Section 3 of the 2026 mock exam (8P.) covers every metric defined here: confusion matrix arithmetic, metric relationships, threshold movement effects, ROC geometry, AUC, and multi-class metrics.
:::

---

## Binary Confusion Matrix

For a binary classifier with positives ($+$) and negatives ($-$):

|  | Predicted $-$ | Predicted $+$ |
|---|---|---|
| **Actual $+$** | FN (miss) | TP (hit) |
| **Actual $-$** | TN (correct reject) | FP (false alarm) |

$$N = TP + FP + FN + TN$$

---

## Core Metrics

### Rates derived from actual-positive row

$$\text{TPR} = \text{Recall} = \text{Sensitivity} = \frac{TP}{TP + FN}$$

$$\text{FNR} = \text{Miss Rate} = 1 - \text{TPR} = \frac{FN}{TP + FN}$$

### Rates derived from actual-negative row

$$\text{TNR} = \text{Specificity} = \frac{TN}{TN + FP}$$

$$\text{FPR} = 1 - \text{Specificity} = \frac{FP}{TN + FP}$$

### Rates derived from predicted-positive column

$$\text{Precision} = \text{PPV} = \frac{TP}{TP + FP}$$

$$\text{NPV} = \frac{TN}{TN + FN}$$

### Global metrics

$$\text{Accuracy} = \frac{TP + TN}{N}$$

$$F_1 = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2\,TP}{2\,TP + FP + FN}$$

> **$F_1$** is the **harmonic** mean (not geometric) of Precision and Recall.

### Quick identities

$$\text{Specificity} = 1 - \text{FPR}$$
$$\text{NPV denominator} = TN + FN \quad (\text{predicted-negative column sum})$$

---

## Threshold Effects

Most classifiers output a **continuous score** $s(x)$. A threshold $\theta$ converts it to a binary decision:

$$\hat{y}(x) = \begin{cases} 1 & s(x) \geq \theta \\ 0 & s(x) < \theta \end{cases}$$

| Threshold change | TPR | FPR | Specificity | Precision | Accuracy |
|---|---|---|---|---|---|
| $\theta$ decreases (more liberal) | ↑ or = | ↑ or = | ↓ or = | ↓ or = | uncertain |
| $\theta$ increases (more strict) | ↓ or = | ↓ or = | ↑ or = | ↑ or = | uncertain |

> **Key exam fact:** Lowering the threshold can never decrease TPR, but it cannot decrease FPR either — both move in the same direction.

---

## ROC Curve & AUC

The **Receiver Operating Characteristic (ROC)** curve sweeps the threshold from $1 \to 0$ and plots (FPR, TPR) for each value.

$$\text{AUC} = \int_0^1 \text{TPR}(\text{FPR}) \, d(\text{FPR})$$

| ROC characteristic | Meaning |
|---|---|
| Point $(0, 1)$ | Perfect classifier |
| Diagonal $(0,0) \to (1,1)$ | Random guessing, AUC ≈ 0.5 |
| One threshold → one point | Sweeping $\theta$ traces the curve |
| ROC is prior-independent | Priors don't shift the curve; they affect accuracy but not ROC |

---

## Interactive Visualizer

Drag the threshold slider and observe how the confusion matrix, all metrics, and the ROC operating point change simultaneously.

<EvaluationMetricsVisualizer />

---

## Multi-Class Confusion Matrix

For $K$ classes, the confusion matrix $[n_{ij}]$ has entry $n_{ij}$ = samples truly class $i$ predicted as class $j$.

$$\text{Recall}_k = \frac{n_{kk}}{\sum_j n_{kj}} \quad \text{(row sum = true count)}$$

$$\text{Precision}_k = \frac{n_{kk}}{\sum_i n_{ik}} \quad \text{(column sum = predicted count)}$$

$$\text{Recognition Rate (RR)} = \frac{\sum_k n_{kk}}{N}$$

### UAR vs WAR

$$\text{UAR} = \frac{1}{K} \sum_k \text{Recall}_k \quad \text{(Unweighted Average Recall)}$$

$$\text{WAR} = \sum_k \frac{N_k}{N} \text{Recall}_k \quad \text{(Weighted = global accuracy)}$$

> UAR treats all classes equally regardless of frequency; use it for imbalanced problems.

### Symmetry property

If you **swap** the roles of reference (rows) and hypothesis (columns):
- The **Recognition Rate (accuracy)** stays the same (diagonal unchanged, $N$ unchanged).
- **Recall** and **Precision** of each class $k$ get **exchanged**.

---

## Precision–Recall Curve

When classes are highly imbalanced, the ROC can be misleading (FPR small even with many FP). The **PR curve** (Recall on $x$-axis, Precision on $y$-axis) is preferred. The ideal PR classifier sits at $(1, 1)$.

---

## Summary

| Metric | Formula | Denominator = |
|---|---|---|
| TPR / Recall | $TP/(TP+FN)$ | Actual positives |
| FPR | $FP/(FP+TN)$ | Actual negatives |
| Precision | $TP/(TP+FP)$ | Predicted positives |
| NPV | $TN/(TN+FN)$ | Predicted negatives |
| Specificity | $TN/(TN+FP)$ = $1-$FPR | Actual negatives |
| $F_1$ | Harmonic mean(Prec, Rec) | — |
| Accuracy | $(TP+TN)/N$ | All samples |
