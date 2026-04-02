# Mock Exams Walkthrough

## Interactive Exam

Start here with the interactive quiz mode:

<MockExamQuiz />

---

## Full Written Walkthrough

Two full mock exams with question text, correct answers, and explanations.

- **Exam A** — March 20, 2026 (52 points, with official solutions)
- **Exam B** — August 23, 2025 (47 points, questions only)

Visualizations are included only where they genuinely help build intuition.

---

## Exam A — March 20, 2026

### Section 1 · Introduction (6P)

---

#### Q1.1 — Postulate 6 (1P, SC)

> *"We discussed the 6 fundamental postulates of pattern recognition. Postulate 6 states 'Similarity through feature space proximity'. Which of the following statements best describes this postulate?"*
>
> A. Two patterns are similar if their features differ only slightly. This implies that small differences in the input features should not change the classification drastically.
>
> B. Patterns belonging to the same class form a compact group in the feature space, meaning their features are similar to each other.
>
> C. A pattern consists of simpler constituents which have certain relations to each other and can be decomposed into these constituents.
>
> D. A complex pattern has a certain structure, meaning that not any arrangement of simpler constituents is a valid pattern.

**Answer: A**

Postulate 6 is about **input-space continuity of the classifier**: similar inputs should produce similar outputs. Option B describes Postulate 3 (Compactness / Separability). Option C is Postulate 4 (Decomposability). Option D is Postulate 5 (Structural constraints).

---

#### Q1.2 — Why convexity matters (1P, SC)

> *"Why is convexity an important property in optimization problems?"*
>
> A. It guarantees that the problem has a closed-form analytical solution, eliminating the need for iterative algorithms.
>
> B. It ensures that any local minimum is also a global minimum, preventing the optimization algorithm from getting stuck in local optima.
>
> C. It implies that the objective function is linear, which ensures linear computational complexity.
>
> D. It ensures that the Hessian matrix is always indefinite, allowing the algorithm to escape saddle points.

**Answer: B**

Convexity means every local minimum is the global one. No closed-form solution is implied. A convex function need not be linear, and its Hessian is positive semi-definite - not indefinite.

---

#### Q1.3 — Discriminative vs. generative (4P, MC)

> *"State which of the following statements are true for discriminative and/or generative models:"*
>
> | Statement | Discriminative | Generative |
> |-----------|:--------------:|:----------:|
> | A. It directly models the decision boundary | □ | □ |
> | B. It can classify an input feature vector | □ | □ |
> | C. It models class distributions | □ | □ |
> | D. It can be trained with training data | □ | □ |

**Answers:**
- A -> **Discriminative only**
- B -> **Both**
- C -> **Generative only**
- D -> **Both**

---

### Section 2 · Logistic Regression (8P)

*Scenario: predicting respiratory illness $y=1$ from features $x$ (age, air quality, vaccination status).*

---

#### Q2.1 — Fundamental properties (1P, MC)

> *"Which of the following statements correctly describe the fundamental properties of your Logistic Regression model?"*
>
> A. It is a generative model that estimates the joint density $p(x,y)$ before applying Bayes' rule.
>
> B. It is a discriminative model that directly estimates the risk $p(y\mid x)$ without modelling how environmental features $p(x\mid y)$ are distributed.
>
> C. Unlike a simple Perceptron, it outputs a calibrated probability value between 0 and 1, allowing for nuanced risk tiers.
>
> D. It requires the assumption that the feature distributions for healthy and ill residents are Gaussian with equal covariance matrices.
>
> E. It is solved using a closed-form analytical solution, making training instantaneous once data is collected.

**Answer: B, C**

Logistic Regression is **discriminative** - it models $p(y\mid x)$ directly (B). It uses the sigmoid for calibrated probabilities, unlike Perceptron (C). It is *not* generative (A), does *not* assume Gaussian features (D - that is LDA), and has no closed-form - it requires iterative gradient ascent (E).

---

#### Q2.2 — Sigmoid properties (1P, MC)

> *"To map health scores to probabilities, you use the logistic sigmoid $g(z) = \frac{1}{1+e^{-z}}$. Which of the following mathematical properties are valid?"*
>
> A. $g(-z) = -g(z)$
>
> B. $g'(z) = g(z)(1-g(z))$
>
> C. The function maps any real-valued score strictly monotonically to a probability in $(0,1)$.
>
> D. At a neutral score of 0, $g(0) = 0$.
>
> E. $g(-z) = 1 - g(z)$

**Answer: B, C, E**

- **B**: The self-derivative identity $\sigma' = \sigma(1-\sigma)$.
- **C**: Sigmoid is strictly monotone and maps $\mathbb{R} \to (0,1)$.
- **E**: Correct symmetry. **A** is wrong (that is an odd function like tanh). **D** is wrong: $g(0) = 0.5$.

---

#### Q2.3 — Decision boundary geometry (2P, MC)

> *"You define a 'High Risk' alert when $p(y=1\mid x) \geq 0.5$. Which statements about the geometric boundary are correct?"*
>
> A. The boundary is the set of points where the log-odds equal 0.
>
> B. The boundary is defined by the hyperplane $\theta^T x = 0.5$.
>
> C. The boundary is linear in the feature space.
>
> D. Non-linear transforms $\phi(x)$ of inputs must still give a linear boundary in $x$.
>
> E. Residents on the boundary have predicted risk probability of 0.5.

**Answer: A, C, E**

The boundary is where $\theta^T x = 0$ (log-odds = 0, not 0.5 - B is wrong), so $g(0) = 0.5$ (E). The boundary is **linear in $x$** (C). With feature transforms $\phi(x)$, the boundary is linear in $\phi(x)$ but can be non-linear in $x$ (D is wrong).

---

#### Q2.4 — Training via log-likelihood (2P, MC)

> *"You train the model by maximizing the log-likelihood $L(\theta)$. Which statements are true?"*
>
> A. $L(\theta)$ is concave, ensuring gradient ascent finds the global optimum.
>
> B. The gradient is $\nabla L(\theta) = \sum_{i=1}^m (y_i - g(\theta^T x_i)) x_i$.
>
> C. The model is prone to getting stuck in local optima if initialized poorly.
>
> D. The Newton-Raphson update can be interpreted as Iteratively Reweighted Least Squares (IRLS).
>
> E. The weight update depends only on whether the prediction was right or wrong (the sign), similar to Perceptron.

**Answer: A, B, D**

- **A**: Log-likelihood is concave -> gradient ascent always converges to global maximum.
- **B**: Gradient = prediction error x feature, summed over data.
- **C**: False - concavity means no local optima traps.
- **D**: The Newton step reweights residuals, equivalent to weighted least squares (IRLS).
- **E**: False - the gradient scales with continuous error $y_i - \hat{p}_i$, not just sign.

---

#### Q2.5 — Numeric example $\theta = [1, 1, -2]^T$ (2P, MC)

> *"Consider $\theta = [1,1,-2]^T$, so $z = x_1 + x_2 - 2$. Which of the following are true?"*
>
> A. A resident with Age=1 and Exposure=1 lies exactly on the decision boundary.
>
> B. A resident with Age=2 and Exposure=2 is assigned risk probability $> 0.5$.
>
> C. A resident with Age=0 and Exposure=0 has log-odd risk score of 0.
>
> D. The decision boundary equation is $x_2 = -x_1 + 2$.
>
> E. If the bias term were changed to 0, a newborn (Age=0, Exposure=0) would lie on the boundary.

**Answer: A, B, D, E**

- (A) $z = 1+1-2 = 0$ -> on boundary. ✓
- (B) $z = 2+2-2 = 2 > 0$ -> $g(2) > 0.5$. ✓
- (C) $z = 0+0-2 = -2 \neq 0$. ✗
- (D) Set $z=0$: $x_1+x_2-2=0 \Leftrightarrow x_2 = -x_1+2$. ✓
- (E) New bias=0: $z = 0+0 = 0$ at $(0,0)$. ✓

---

### Section 3 · Evaluation (8P)

*Scenario: AI x-ray scanner for prohibited items. Positive = item found.*

---

#### Q3.1 — Reading the confusion matrix (1P, MC)

> *"A prototype scanner is evaluated on N = 100 bags:"*
>
> |  | predicted + | predicted - | total |
> |--|:-----------:|:-----------:|:-----:|
> | **actual +** | 40 | 10 | 50 |
> | **actual -** | 15 | 35 | 50 |
> | **total** | 55 | 45 | 100 |
>
> *"Which statements are correct?"*
>
> A. $\text{FPR} = 15/55$
>
> B. $\text{ACC} = 75/100$
>
> C. TPR equals Recall and here $\text{TPR} = 40/50$
>
> D. $\text{NPV} = 35/50$
>
> E. $F_1 = 80/105$
>
> F. Since the dataset is balanced, ACC must equal TPR.

**Answer: B, C, E**

- TP=40, FP=15, FN=10, TN=35.
- **B**: ACC = (40+35)/100 = 75/100. ✓
- **C**: TPR = Recall = 40/50. ✓
- **E**: $F_1 = 2\text{TP}/(2\text{TP}+\text{FP}+\text{FN}) = 80/105$. ✓
- **A**: FPR = FP/(FP+TN) = 15/50, not 15/55. ✗
- **D**: NPV = TN/(TN+FN) = 35/45, not 35/50. ✗
- **F**: Not true in general. ✗

---

#### Q3.2 — Metric relationships (1P, MC)

> *"Which of the following statements about metric relationships are true?"*
>
> A. The F-measure is the geometric mean of Recall and Precision.
>
> B. FPR is the proportion of misclassified samples among all bags flagged by the system.
>
> C. TPR is numerically equal to Recall and Sensitivity.
>
> D. If the scanner flags every bag as a threat, its Specificity equals 1.
>
> E. The denominator of NPV contains TN and FN.
>
> F. Specificity equals $1 - \text{FPR}$.

**Answer: C, E, F**

- **C**: TPR = Recall = Sensitivity = TP/(TP+FN). ✓
- **E**: NPV = TN/(TN+FN). ✓
- **F**: Specificity = TNR = TN/(TN+FP) = 1 - FPR. ✓
- **A**: $F_1$ is the **harmonic** mean, not geometric. ✗
- **B**: FPR = FP/(FP+TN) - proportion of true negatives wrongly flagged. ✗
- **D**: Flagging everything -> TN=0 -> Specificity=0. ✗

---

#### Q3.3 — Effect of lowering the threshold (2P, MC)

> *"You consider lowering threshold $\theta$ to make the scanner more sensitive. Which statements are correct?"*
>
> A. The set of bags predicted positive under a lower threshold is a superset of those under the original.
>
> B. TPR can only increase or stay the same when lowering the threshold.
>
> C. FPR can only decrease or stay the same when lowering the threshold.
>
> D. Specificity can only decrease or stay the same when lowering the threshold.
>
> E. The ROC operating point moves up and to the left when lowering the threshold.
>
> F. Lowering the threshold must increase accuracy, regardless of class distribution.

**Answer: A, B, D**

Lowering threshold flags more bags as positive:
- **A**: Superset - every previously flagged bag is still flagged. ✓
- **B**: More true positives caught -> TPR up or stays. ✓
- **D**: More false positives -> Specificity down or stays. ✓
- **C**: FPR = 1 - Specificity -> FPR *increases*. ✗
- **E**: More positives -> TPR up and FPR up -> **up and to the right** on ROC. ✗
- **F**: Accuracy depends on class distribution. ✗

<EvaluationMetricsVisualizer />

*Drag the threshold slider to see TPR, FPR, Specificity, and the ROC operating point update live.*

---

#### Q3.4 — ROC curve properties (2P, MC)

> *"Which statements about the ROC behavior are correct?"*
>
> A. For a fixed threshold, the scanner corresponds to one point in the ROC plane; varying $\theta$ yields an ROC curve.
>
> B. The diagonal from $(0,0)$ to $(1,1)$ represents random guessing with AUC = 0.5.
>
> C. AUC is the area under the ROC curve and summarizes performance over all threshold settings.
>
> D. If the proportion of prohibited items changes, the ROC curve must change.
>
> E. Since the ROC curve is independent of the priors, it is also independent of the chosen threshold.
>
> F. The point FPR=0.5, TPR=0.5 implies ACC=0.5 for any class priors.

**Answer: A, B, C, F**

- **A**: One threshold -> one point; sweep over $\theta$ -> full curve. ✓
- **B**: Random classifier -> diagonal; AUC = 0.5. ✓
- **C**: AUC aggregates across all thresholds. ✓
- **F**: At FPR=TPR=0.5 the classifier misclassifies 50% in both classes -> ACC=0.5. ✓
- **D**: ROC uses class-conditional rates (TPR, FPR) which are unaffected by class priors. ✗
- **E**: The curve is independent of priors, but threshold choice absolutely matters. ✗

---

#### Q3.5 — Multi-class confusion matrix (2P, MC)

> *"The scanner now classifies $K$ item categories. You examine the $K\times K$ confusion matrix $[n_{ij}]$. Which statements are correct?"*
>
> A. For class $\Omega_\kappa$, recall uses the row sum in its denominator.
>
> B. For class $\Omega_\kappa$, precision uses the row sum in its denominator.
>
> C. UAR is a weighted average of per-class recalls weighted by sample count.
>
> D. If every entry $n_{ij}$ is doubled, the Recognition Rate (RR) changes.
>
> E. If you swap reference and hypothesis, the Recognition Rate stays unchanged.
>
> F. If you swap reference and hypothesis, the roles of recall and precision are exchanged.

**Answer: A, E, F**

- **A**: Recall$_\kappa = n_{\kappa\kappa} / \sum_j n_{\kappa j}$ (row sum = total true instances). ✓
- **E**: RR = $\sum_\kappa n_{\kappa\kappa} / N$ - symmetric. ✓
- **F**: Precision uses column sums; swapping rows<->columns exchanges recall and precision. ✓
- **B**: Precision uses column sums, not row sums. ✗
- **C**: UAR = **unweighted** average (equal weight per class). ✗
- **D**: Doubling all entries -> both numerator and denominator scale -> RR unchanged. ✗

---

### Section 4 · Feature Transforms — LDA & PCA (8P)

*Scenario: classifying $K$ tissue types from high-dimensional biopsy scans.*

<LDAVisualizer />

---

#### Q4.1 — Rank-reduced LDA (1P, MC)

> *"Which statements about rank-reduced LDA are correct?"*
>
> A. The method selects projection directions that maximize separation between class centroids.
>
> B. The PCA step primarily reduces within-class variance by removing low-variance directions inside each class.
>
> C. The method constructs a lower-dimensional discriminative subspace preserving directions most relevant for class separability.
>
> D. Rank-Reduced LDA can achieve higher classification accuracy than PCA even when PCA retains more variance.
>
> E. The method selects directions that maximize overall variance.

**Answer: A, C, D**

LDA maximizes between-class scatter relative to within-class scatter (A, C). It can out-classify PCA even with less retained variance because it targets discriminative - not reconstructive - directions (D). E describes PCA, not LDA. B is incorrect: PCA removes small-*overall*-variance directions, not within-class directions.

---

#### Q4.2 — PCA vs. LDA (1P, MC)

> *"Which statements about PCA and LDA are correct?"*
>
> A. PCA is supervised and naturally identifies tissue categories.
>
> B. LDA uses class labels to guide the transformation.
>
> C. PCA maximizes class separability by default.
>
> D. LDA maximizes between-class variance relative to within-class variance.
>
> E. PCA guarantees optimal classification for your diagnostic tool.

**Answer: B, D**

PCA is **unsupervised** (A, C, E are false). LDA is supervised (B) and optimizes the between/within scatter ratio (D).

---

#### Q4.3 — Sphering transform $\phi(x) = D^{-1/2}U^T x$ (2P, MC)

> *"The sphering transform is designed primarily to achieve which of the following?"*
>
> A. Transform class-conditional covariance matrices so all classes share the identity covariance.
>
> B. Remove correlations among features to simplify distance-based classification.
>
> C. Maximize between-class scatter relative to within-class scatter.
>
> D. Guarantee dimensionality reduction without losing discriminative information.
>
> E. Ensure class means become orthogonal in transformed space.

**Answer: A, B**

The sphering transform de-correlates features ($U$ removes correlations) and normalizes variances ($D^{-1/2}$ makes them 1), yielding $\Sigma \to I$ for all classes. C is the goal of the *subsequent* LDA step. D and E are not goals of sphering alone.

---

#### Q4.4 — Distance metrics (2P, MC)

> *"Which geometric interpretations about distance metrics are correct?"*
>
> A. The Mahalanobis distance is Euclidean distance in a space where correlations and unequal variances have been normalized.
>
> B. PCA directions always improve classification because higher-variance directions contain more discriminative information.
>
> C. With identical covariances and equal priors, the Bayes-optimal Gaussian classifier reduces to nearest-mean under Mahalanobis distance.
>
> D. With identical covariances and equal priors, the Bayes-optimal Gaussian classifier reduces to nearest-mean under Euclidean distance.
>
> E. High-variance PCA directions can capture within-class variation instead of class separation, potentially increasing class overlap.

**Answer: A, C, E**

- **A**: Mahalanobis = Euclidean after whitening. ✓
- **C**: Equal covariances + equal priors -> nearest centroid in Mahalanobis metric. ✓
- **E**: PCA directions may capture within-class variance, hurting discrimination. ✓
- **B**: High variance != discriminative; variance may be within-class. ✗
- **D**: Nearest Euclidean holds only when $\Sigma = I$. ✗

---

#### Q4.5 — Full LDA implementation details (2P, MC)

> *"Which technical details are correct for the full LDA implementation?"*
>
> A. After sphering, the LDA decision rule with equal priors is equivalent to nearest-centroid using $L_1$ distance.
>
> B. The sphering transform inherently performs rank reduction to $\mathbb{R}^{K-1}$ because the between-class scatter matrix has rank at most $K-1$.
>
> C. In rank-reduced LDA, the projection matrix is obtained by solving a generalized eigenvalue problem; the discriminant subspace has dimension at most $K-1$.
>
> D. After sphering, the LDA decision rule involves squared Euclidean distances producing quadratic boundaries.
>
> E. The Fisher criterion $J(r) = r^T S_B r / r^T S_W r$ leads to the same linear boundaries as LDA; for two classes $r^* \propto S_W^{-1}(\mu_1 - \mu_2)$.

**Answer: C, E**

- **C**: $S_B$ has rank <= $K-1$ -> discriminant subspace dimension <= $K-1$. ✓
- **E**: Fisher criterion Rayleigh quotient gives the same solution; two-class optimal direction is $S_W^{-1}(\mu_1-\mu_2)$. ✓
- **A**: After sphering, nearest centroid uses **$L_2$** (Euclidean), not $L_1$. ✗
- **B**: Sphering does not perform rank reduction; that happens in the subsequent eigenstep. ✗
- **D**: Sphering + equal covariances -> **linear** boundaries. ✗

---

### Section 5 · Optimization — Lagrange Dual Derivation (6P)

*Find the point on line $x_1 + x_2 \geq 4$ closest to the origin:*

$$\text{minimize} \quad \tfrac{1}{2}(x_1^2 + x_2^2) \quad \text{subject to} \quad x_1 + x_2 \geq 4$$

---

#### Q5.1 Step 1 — Standard form (1P)

> *"Which inequality represents $x_1+x_2 \geq 4$ in standard form $f_i(x) \leq 0$?"*
>
> A. $x_1+x_2-4 \leq 0$  · B. $4-x_1-x_2 \leq 0$  · C. $x_1+x_2-4 = 0$
> D. $-(x_1+x_2) \leq -4$  · E. $x_1 \geq 4-x_2$

**Answer: B** - Multiply both sides by $-1$: $4-x_1-x_2 \leq 0$.

---

#### Q5.1 Step 2 — The Lagrangian (1P)

> *"With $f_1(x) = 4-x_1-x_2 \leq 0$ and $\lambda \geq 0$, what is the correct Lagrangian?"*
>
> A. $L = \tfrac{1}{2}\|x\|^2 - \lambda(x_1+x_2-4)$
>
> B. $L = \tfrac{1}{2}\|x\|^2 + \lambda(4-x_1-x_2)$
>
> C. $L = \|x\|^2 + \lambda(4-x_1-x_2)$
>
> D. $L = \tfrac{1}{2}\|x\|^2 + \lambda(x_1+x_2-4)^2$

**Answer: B** - $L = f_0 + \lambda f_1 = \tfrac{1}{2}\|x\|^2 + \lambda(4-x_1-x_2)$.

---

#### Q5.1 Step 3 — Minimize over primal variables (2P)

> *"Set $\nabla_x L = 0$. What is the relationship between $x$ and $\lambda$?"*
>
> A. $x_1=0, x_2=0$  · B. $x_1=-\lambda, x_2=-\lambda$  · C. $x_1=\lambda, x_2=\lambda$
> D. $x_1 = 4-x_2$  · E. $\nabla_x L = 2x-\lambda=0 \Rightarrow x=\lambda/2$

**Answer: C**

$$\frac{\partial L}{\partial x_1} = x_1 - \lambda = 0 \Rightarrow x_1=\lambda, \quad \frac{\partial L}{\partial x_2} = x_2 - \lambda = 0 \Rightarrow x_2=\lambda.$$

---

#### Q5.1 Step 4 — The dual function (2P)

> *"Substituting $x_1=x_2=\lambda$ back into $L$, which is the correct dual function?"*
>
> A. $g(\lambda) = \lambda^2 - 4\lambda$
>
> B. $g(\lambda) = 4\lambda - \lambda^2$
>
> C. $g(\lambda) = 4\lambda - 2\lambda^2$
>
> D. $g(\lambda) = 2\lambda^2 + 4$
>
> E. $g(\lambda) = -\tfrac{1}{2}\lambda^2 + 4\lambda$

**Answer: B**

$$g(\lambda) = \tfrac{1}{2}(\lambda^2+\lambda^2) + \lambda(4-\lambda-\lambda) = \lambda^2 + 4\lambda - 2\lambda^2 = 4\lambda - \lambda^2.$$

This derivation mirrors the SVM dual derivation exactly.

---

### Section 6 · Expectation Maximization (8P)

*Scenario: Gaussian Mixture Model for seismic vibration data; latent variable = geological source.*

<EMVisualizer />

---

#### Q6.1 — Incorrect statements about latent variables (1P, MC — select incorrect ones)

> *"Which of the following statements are **incorrect**?"*
>
> A. The observed-data log-likelihood is guaranteed to increase whenever the responsibilities are updated.
>
> B. If latent variables $Z$ were observed, MLE would reduce to fitting independent Gaussians to disjoint subsets.
>
> C. The observed-data log-likelihood is convex in the mixture parameters, since it is obtained by marginalizing over latent variables.
>
> D. Knowing latent variables removes the need for EM, because the resulting MLE admits a closed-form solution.
>
> E. When assignments are known, the log-likelihood separates into independent terms per component; when unknown, it involves $\log \sum_k$.

**Answer (incorrect statements): A, C**

- **A is incorrect**: The log-likelihood is non-decreasing during the **M-step**, but updating responsibilities (E-step) does not directly increase the observed-data likelihood.
- **C is incorrect**: The observed-data log-likelihood $\sum_n \log \sum_k \pi_k \mathcal{N}(x_n|\mu_k,\Sigma_k)$ is **non-convex** due to the $\log\sum$ form; EM exploits the convex lower bound (ELBO), not the likelihood itself.
- B, D, E are all correct statements.

---

#### Q6.2 — Responsibilities (1P, MC)

> *"Which statements about responsibilities $\gamma(z_{nk})$ are correct?"*
>
> A. Responsibilities are posterior probabilities of latent variables.
>
> B. Responsibilities sum to one over mixture components for each data point.
>
> C. Responsibilities correspond to hard cluster assignments.
>
> D. Responsibilities depend on current parameter estimates $(\pi_k, \mu_k, \Sigma_k)$.
>
> E. Responsibilities are optimized in the M-step.

**Answer: A, B, D**

$$\gamma(z_{nk}) = \frac{\pi_k \mathcal{N}(x_n|\mu_k,\Sigma_k)}{\sum_j \pi_j \mathcal{N}(x_n|\mu_j,\Sigma_j)}$$

They are soft posterior assignments (A) summing to 1 (B), depending on current $\theta$ (D). They are computed in the **E-step**, not M-step (E is wrong). Hard assignments characterize K-means, not EM (C is wrong).

---

#### Q6.3 — Convergence behavior (2P, MC)

> *"Which statements about EM's convergence are true?"*
>
> A. The choice of initial values affects the final estimates.
>
> B. The EM algorithm is guaranteed to converge.
>
> C. The EM algorithm is guaranteed to converge to the global maximum.
>
> D. Parameter estimates at convergence are guaranteed to be the global MLE.

**Answer: A, B**

EM **is** guaranteed to converge (the observed-data log-likelihood is non-decreasing, B) but only to a **local** maximum (C and D are false). Different initializations lead to different local optima (A).

---

#### Q6.4 — MLE vs. MAP (2P, MC)

> *"Which statements about MLE and MAP are correct?"*
>
> A. MLE depends only on the likelihood; MAP additionally depends on the prior $p(\theta)$.
>
> B. A uniform prior makes MAP identical to MLE.
>
> C. MAP can be formulated as maximizing $\log p(X|\theta) + \log p(\theta)$.
>
> D. Because MAP uses prior knowledge, it is always guaranteed to provide a better estimate than MLE.
>
> E. For massive datasets, the prior's influence on MAP necessarily disappears regardless of the prior.

**Answer: A, B, C**

- **A**: $\theta_\text{MAP} = \arg\max[\log p(X|\theta) + \log p(\theta)]$ - both terms matter. ✓
- **B**: Uniform prior -> $\log p(\theta) = \text{const}$ -> MAP = MLE. ✓
- **C**: Direct from Bayes' rule + log. ✓
- **D**: A poorly chosen prior can actually hurt estimation accuracy. ✗
- **E**: "Necessarily" is too strong - a degenerate prior can always dominate. ✗

---

#### Q6.5 — Degeneracy and refinement (2P, MC)

> *"Your model occasionally produces errors where a component 'collapses.' Which statements are correct?"*
>
> A. The EM algorithm directly optimizes seismic classification accuracy during training.
>
> B. During EM, the expected complete-data log-likelihood is maximized with respect to model parameters while keeping responsibilities fixed.
>
> C. A fixed point of EM may correspond to a saddle point rather than a strict local maximum.
>
> D. The EM algorithm can converge to degenerate solutions where a component collapses onto a single event with a vanishing covariance matrix.
>
> E. A GMM performs density estimation; identifying a tremor's source requires an additional decision rule based on posteriors.

**Answer: B, C, D, E**

- **B**: The M-step maximizes $Q(\theta|\theta^\text{old}) = \mathbb{E}_Z[\log p(X,Z|\theta)]$ with fixed $\gamma$. ✓
- **C**: EM finds stationary points; saddle points are possible. ✓
- **D**: Component collapse (covariance -> 0) is a known GMM pathology without regularization. ✓
- **E**: GMM learns the density; source assignment needs evaluating the posterior (responsibilities). ✓
- **A**: EM maximizes likelihood/ELBO, not classification accuracy. ✗

---

---

## Exam B — August 23, 2025

### Section 1 · Single Choice (6P)

---

#### Q1.1 — Boosting (1P, SC)

> *"Which statement for Boosting methods in general is true?"*
>
> A. Create a combined prediction out of many weighted **strong** classifiers.
>
> B. Create a combined prediction out of many weighted **weak** classifiers.
>
> C. After training many classifiers, the best performing one makes the final prediction.
>
> D. Select features to build a strong classifier.

**Answer: B**

Boosting sequentially trains many **weak** classifiers (slightly better than random) and combines them via a weighted vote. Strong classifiers alone would not need boosting.

---

#### Q1.2 — Optimal Bayes classifier (1P, SC)

> *"What properties does an optimal Bayes classifier imply?"*
>
> A. It classifies every pattern correctly.
>
> B. It minimizes the false positives.
>
> C. It achieves the maximum sample efficiency.
>
> D. It achieves the minimum possible error rate.

**Answer: D**

The Bayes optimal classifier minimizes total expected error using the true posteriors $p(y|x)$. It does not guarantee zero errors, is not specifically about FPs, and sample efficiency is a different concept.

---

#### Q1.3 — PCA properties (1P)

> *"Principal Components Analysis:"*
>
> A. Preserves distances of a manifold.  · B. Decorrelates features.
>
> C. Performs dimensionality reduction.  · D. Classifies features.

**Answer: B, C**

PCA decorrelates features by projecting onto eigenvectors of the covariance matrix (B) and is commonly used for dimensionality reduction by keeping the top-$k$ components (C).

---

#### Q1.4 — Prior knowledge in EM (1P, SC)

> *"How can we incorporate prior knowledge in the Expectation Maximization algorithm?"*
>
> A. Change the Expectation step.
>
> B. Change the Maximization step.
>
> C. Change both steps.
>
> D. It is impossible.

**Answer: B**

Prior knowledge enters as a regularizer in the **M-step** (MAP estimation: maximize log-likelihood + log-prior). The E-step computes responsibilities from data and current parameters only.

---

#### Q1.5 — Good features (1P, SC)

> *"Features in Pattern Recognition should:"*
>
> A. Preserve class information while reducing dimensionality.
>
> B. Increase class information while increasing dimensionality.
>
> C. Preserve class information while increasing dimensionality.
>
> D. Increase class information while reducing dimensionality.

**Answer: A**

Good features compress the input while retaining discriminative information. Increasing dimensionality introduces the curse of dimensionality.

---

#### Q1.6 — Regression (1P, SC)

> *"Regression generally refers to?"*
>
> A. Estimating a linear model for the data.
>
> B. Estimating a continuous function describing the data.
>
> C. Estimating posterior probabilities from data.
>
> D. Estimating class labels from data.

**Answer: B**

Regression estimates a real-valued (continuous) output. It need not be linear (A is too restrictive). Options C and D describe classification tasks.

---

### Section 2 · Multiple Choice (4P)

---

#### Q2.1 — Viola-Jones Haar features (2P, MC)

> *"The Viola-Jones algorithm is a Face Recognition Algorithm. Which displayed features (A-D in the figure) are used by the algorithm?"*

This question requires the figure from the original exam. Viola-Jones uses **Haar-like rectangular features** - specifically:
1. Two-rectangle features (horizontal and vertical edge detectors)
2. Three-rectangle features (line detectors)
3. Four-rectangle features (diagonal)

The correct answer depends on which labeled templates (A-D) appear in the figure. See [Viola-Jones Detector](./viola-jones.md) for all Haar template types.

---

#### Q2.2 — EM disadvantages (2P, MC)

> *"What are disadvantages of the Expectation Maximization algorithm?"*
>
> A. Slow convergence.  · B. It can only be used for optimizing GMMs.
>
> C. It is a local optimization method.  · D. Needs a labeled data set.
>
> E. Sensitive to initialization.  · F. It may converge to saddle points or poor local optima.

**Answer: A, C, E, F**

- **A**: EM can converge slowly (linear rate). ✓
- **C**: EM only finds local optima. ✓
- **E**: Different initializations -> different solutions. ✓
- **F**: Fixed points can be saddle points. ✓
- **B**: False - EM is a general framework for any latent variable model, not just GMMs.
- **D**: False - EM is unsupervised.

---

### Section 3 · Introduction (4P)

---

#### Q3.1 — Generative model properties only (2P, MC)

> *"Which of the following statements are **only** true for generative models?"*
>
> A. It models class distributions.
>
> B. A Bayesian classifier belongs to this type.
>
> C. Logistic regression belongs to this type.
>
> D. It can generate new samples from the learned distribution.
>
> E. It always maximizes the margin between classes.
>
> F. It requires modeling $p(x|y)$ and $p(y)$.

**Answer: A, B, D, F**

Generative models learn $p(x,y) = p(x|y)\cdot p(y)$ (F), enabling new sample generation (D) and class-conditional predictions (A). Bayesian classifiers are generative (B). Logistic regression is discriminative (C is false). Margin maximization is specific to SVMs (E is false).

---

#### Q3.2 — Code snippet matching (2P)

> *"Match each snippet to its algorithm:"*
>
> **Snippet (1):** `fit()` that computes `numpy.linalg.inv(numpy.dot(X, X.T))` times `X` times `y`.
>
> **Snippet (2):** `predict()` that computes pairwise Euclidean norms with `numpy.linalg.norm` and sorts by distance with `numpy.argsort`.

**Answers:**
- **Snippet 1 -> B. Linear Regression**: The expression $(XX^T)^{-1}Xy$ is the **normal equation** (closed-form OLS solution).
- **Snippet 2 -> D. k-Nearest Neighbor**: Computing all pairwise Euclidean distances and sorting indices is exactly kNN.

---

### Section 4 · Bayes Classification (8P)

*Two flower species: $y=0$ (Iris Versicolor, 60%) and $y=1$ (Iris Virginica, 40%).
Naive Gaussian Bayes; $\mu_0=(2.5,5)$, $\mu_1=(3,7)$, $\sigma^2=(1,2)$, independent features.
Classify $x=(4,4)$.*

$$p(x|y) = \frac{1}{\sqrt{\prod_i 2\pi\sigma_i^2}} \exp\!\left(-\sum_i \frac{(x_i-\mu_i)^2}{2\sigma_i^2}\right)$$

---

#### Q4.1(a) — Special case identification (MC)

> *"Which special case of the Bayesian classifier do we have?"*
>
> A. Logistic Regression · B. Naive Bayes with Gaussian assumption · C. Decision Tree · D. Generative approach with conditional independence · E. Naive Bayes with Bernoulli assumption · F. SVM

**Answer: B, D**

Independent features + Gaussian class-conditional densities = Naive Gaussian Bayes (B), which is a generative approach with conditional independence (D).

---

#### Q4.1(b) — Prior probabilities (MC)

> *"What are the prior probabilities?"*
>
> A. Both 0.5 · B. Priors not required · C. $p(y=0)=0.6, p(y=1)=0.4$ · D. $p(y=0)=0.4, p(y=1)=0.6$ · E. Class $y=0$ = Iris Versicolor · F. Priors always uniform

**Answer: C, E**

Problem states 60% of training data is Iris Versicolor = $y=0$, so $p(y=0)=0.6, p(y=1)=0.4$ (C). E is also a correct factual statement from the problem setup.

---

#### Q4.1(c) — Likelihoods for $x=(4,4)$ (MC)

> *"Which statements about the likelihoods are correct?"*
>
> A. $p(x|y=0) \approx 0.0228$ · B. $p(x|y=1) \approx 0.0157$ · C. Both likelihoods equal · D. Likelihoods cannot be computed · E. Likelihood ratio $p(x|y=0)/p(x|y=1) > 1$ · F. $p(x|y=0) \approx 0.9$

**Answer: A, B, E**

With $\sigma_1=1, \sigma_2=\sqrt{2}$ (from $\sigma^2=(1,2)$):

$$p(x|y=0) \propto e^{-(4-2.5)^2/2} \cdot e^{-(4-5)^2/4} = e^{-1.125}\cdot e^{-0.25} \approx 0.0228$$
$$p(x|y=1) \propto e^{-(4-3)^2/2} \cdot e^{-(4-7)^2/4} = e^{-0.5}\cdot e^{-2.25} \approx 0.0157$$

Ratio = 0.0228/0.0157 > 1 (E). A and B are correct.

---

#### Q4.1(d) — Posterior probabilities (MC)

> *"Which statements about the posteriors are correct?"*
>
> A. $p(y=0|x) \approx 0.68$ · B. $p(y=1|x) \approx 0.32$ · C. $p(y=0|x) \approx 0.5$ · D. $p(y=1|x) \approx 0.5$ · E. $p(y=0|x) \approx 0.99$ · F. $p(y=1|x) \approx 0.01$

**Answer: A, B**

$$p(y=0|x) \propto 0.0228 \times 0.6 = 0.01368$$
$$p(y=1|x) \propto 0.0157 \times 0.4 = 0.00628$$

Normalizing: $p(y=0|x) \approx 0.685 \approx 0.68$, $p(y=1|x) \approx 0.32$.

---

#### Q4.1(e) — Classification result (MC)

> *"How is $x=(4,4)$ classified?"*
>
> A. Class $y=1$ (Iris Virginica) · B. Cannot be determined · C. Both equally likely · D. Depends only on priors · E. Third unknown class · F. Class $y=0$ (Iris Versicolor)

**Answer: F**

$p(y=0|x) \approx 0.68 > 0.32 = p(y=1|x)$ -> MAP decision is $y=0$ (Iris Versicolor).

---

### Section 5 · Evaluation — Bias-Variance (3P)

---

#### Q5.1 — Bias-variance target diagrams (3P, figure-based)

> *"Below are four target diagrams (A-D) with different combinations of bias and variance. (a) Which figure corresponds to low bias + high variance? (b) What does low bias + high variance typically imply?"*

**Answer to (b): A, D, F**

- **A**: Low bias -> the model has high flexibility and adapts well to training data.
- **D**: High variance -> performance fluctuates strongly across different training sets (overfitting risk).
- **F**: Low bias -> predictions are, on average, centered around the true target (small systematic error).

**Target diagram intuition:**
- Low bias = cluster of prediction points is **centered** on the bullseye.
- High variance = prediction points are **spread out** from each other.
- Low bias + high variance = spread-out but centered distribution.

For the interactive polynomial fitting demonstration see [Bias-Variance Tradeoff](./bias-variance.md).

---

### Section 6 · Feature Transforms — LDA (5P)

---

#### Q6.1 — LDA on a 2D distribution (5P, partially figure-based)

> *"We have 2 classes in a 2D feature space. Two 4x6 grids are overlaid (one per class). (a) In which grid cell is $\mu_1$ (black class mean)? (b) In which grid cell is $\mu_2$ (white class mean)?"*

*(a) and (b) require reading coordinates from the figure - visually estimate where the centroid of each class cluster falls.*

> *(c) Which factor should be **maximized** in LDA?*

**Answer: A — Inter-class distance**

> *(d) Which factor should be **minimized** in LDA?*

**Answer: B — Intra-class variance**

> *(e) Which statement best describes the goal of LDA?*

**Answer: A — Maximize class separation relative to within-class scatter**

The LDA criterion is:

$$J(w) = \frac{w^T S_B w}{w^T S_W w}$$

Maximize between-class spread ($S_B$) while minimizing within-class spread ($S_W$).

---

### Section 7 · Optimization — Full Lagrangian (9P)

*Problem:*

$$\text{minimize} \quad 3\alpha + \sum_i \phi_i$$
$$\text{subject to:} \quad y_i \geq \alpha^T x_i + \alpha_0 + \phi_i \;\text{and}\; \phi_i \leq 0 \;\text{for all}\ i$$

---

#### Q7.1(a) — Objective part of Lagrangian (1P)

> *"Which terms from the objective appear in the Lagrangian?"*

**Answer: C** - The full objective $3\alpha + \sum_i \phi_i$ enters as is.

---

#### Q7.1(b) — First constraint term $\lambda_i \geq 0$ (1P)

> *"Which term incorporates $y_i \geq \alpha^T x_i + \alpha_0 + \phi_i$ using multipliers $\lambda_i \geq 0$?"*

**Answer: A** - $\sum_i \lambda_i(y_i - \alpha^T x_i - \alpha_0 - \phi_i)$

The constraint is $y_i - \alpha^T x_i - \alpha_0 - \phi_i \geq 0$, i.e., $\alpha^T x_i + \alpha_0 + \phi_i - y_i \leq 0$ in standard form. The Lagrangian adds $+\lambda_i \cdot (\alpha^T x_i + \alpha_0 + \phi_i - y_i)$, which equals option A with sign flipped consistently.

---

#### Q7.1(c) — Second constraint term $\mu_i \geq 0$ (1P)

> *"Which term incorporates $\phi_i \leq 0$ using multipliers $\mu_i \geq 0$?"*

**Answer: A** - $\sum_i \mu_i \phi_i$

The constraint $\phi_i \leq 0$ is already in standard form. Adding $+\mu_i \cdot \phi_i$ with $\mu_i \geq 0$ penalizes positive $\phi_i$.

---

#### Q7.1(d) — Dual function and weak duality (2P, MC)

> *"Select all correct statements:"*
>
> A. $g(\lambda,\mu) = \inf_{\alpha,\alpha_0,\phi} L$  · B. Dual function is convex in $(\lambda,\mu)$  · C. For any $\lambda,\mu \succeq 0$, $g$ is a lower bound on primal optimum  · D. Weak duality: $d^\star \geq p^\star$  · E. Dual problem minimizes $g$  · F. Duality gap $p^\star - d^\star \geq 0$

**Answer: A, B, C, F**

- **A**: Definition of dual function. ✓
- **B**: The dual function (and dual problem) is convex in the dual variables. ✓
- **C**: Weak duality - dual provides lower bounds. ✓
- **F**: Duality gap = $p^\star - d^\star \geq 0$. ✓
- **D**: Weak duality says $d^\star \leq p^\star$ (not >=). ✗
- **E**: The dual problem **maximizes** $g$ over nonneg multipliers. ✗

---

#### Q7.1(e) — KKT conditions (2P, MC)

> *"Which items are part of the KKT conditions?"*
>
> A. Primal feasibility: $f_i(x) \leq 0$, $h_j(x) = 0$  · B. $\sum_i \lambda_i = 1$  · C. Dual feasibility: $\lambda_i \geq 0$  · D. Complementary slackness: $\lambda_i f_i(x) = 0$  · E. Hessian of $L$ must be PD  · F. Stationarity: $\nabla_x L = 0$

**Answer: A, C, D, F**

The four KKT conditions are: primal feasibility (A), dual feasibility (C), complementary slackness (D), and stationarity (F). Options B and E are not KKT conditions.

---

#### Q7.1(f) — Strong duality and Slater's condition (2P, MC)

> *"Select all correct statements:"*
>
> A. If the primal is convex and Slater's condition holds, then $p^\star = d^\star$.
>
> B. Slater's condition requires strictly feasible points for both inequality and equality constraints.
>
> C. For nonconvex problems, strong duality can fail even if primal and dual are feasible.
>
> D. In convex problems where strong duality holds, KKT conditions are necessary and sufficient.
>
> E. In convex problems, strong duality holds without any constraint qualification.
>
> F. Strong duality implies uniqueness of the primal optimum.

**Answer: A, C, D**

- **A**: Slater's theorem. ✓
- **C**: Strong duality is not guaranteed for nonconvex problems. ✓
- **D**: When strong duality holds (convex + constraint qualification), KKT fully characterizes solutions. ✓
- **B**: Slater's condition applies to **inequality** constraints; affine equality constraints are handled separately. ✗
- **E**: Constraint qualifications like Slater are necessary. ✗
- **F**: Strong duality concerns primal/dual objective values, not uniqueness of the solution. ✗

---

### Section 8 · SVM (8P)

<SVMVisualizer />

---

#### Q8.1(a) — Hyperplane and support vectors (MC)

> *"Which statements about the separating hyperplane and support vectors are correct?"*
>
> A. The hyperplane is uniquely determined by the support vectors.
>
> B. The margin is maximized between the two classes.
>
> C. All training samples equally determine the hyperplane.
>
> D. Only the support vectors determine the hyperplane.
>
> E. The normal vector $\alpha$ is orthogonal to the hyperplane.
>
> F. The margin width is given by $2/\|\alpha\|$.

**Answer: A, B, D, E, F**

- **A/D**: The hyperplane is uniquely determined only by support vectors. ✓
- **B**: SVM explicitly maximizes the margin. ✓
- **E**: The weight vector is the normal to the hyperplane. ✓
- **F**: Margin = $2/\|w\|$ (distance between the two margin planes $w^Tx = \pm 1$). ✓
- **C**: Only support vectors matter. ✗

---

#### Q8.1(b) — Soft-margin penalty (MC)

> *"Which penalty function does the SVM use in the soft-margin formulation?"*
>
> A. Absolute loss · B. Quadratic loss · C. Hinge loss · D. Cross-entropy · E. Exponential · F. Deadzone

**Answer: C**

Soft-margin SVM uses **hinge loss** $\max(0, 1 - y_i(w^Tx_i + b))$: zero outside the margin, linear for violations.

---

#### Q8.1(c) — Non-linear separation (MC)

> *"How can we separate non-linearly separable classes with an SVM?"*
>
> A. By introducing a kernel function.
>
> B. By applying feature scaling.
>
> C. By using the kernel trick to map data to higher dimensions.
>
> D. By randomizing the decision boundary.
>
> E. By adding polynomial or RBF kernels.
>
> F. By removing support vectors.

**Answer: A, C, E**

The **kernel trick** (C) implicitly maps data to a higher-dimensional feature space using $K(x_i,x_j) = \phi(x_i)^T\phi(x_j)$ (A). Polynomial and RBF are standard kernel choices (E). See [Kernel Methods](./kernels.md).

---

#### Q8.1(d) — Slack variables (MC)

> *"In the non-linearly separable case, additional variables are introduced. Which statements are correct?"*
>
> A. They are called slack variables.
>
> B. They measure the degree of margin violation.
>
> C. They allow soft violations of the margin.
>
> D. They guarantee linear separability.
>
> E. They are penalized in the optimization objective.
>
> F. They reduce the dimension of the feature space.

**Answer: A, B, C, E**

Slack variables $\xi_i \geq 0$ (A) quantify how far a misclassified point is inside the margin (B), allow points to violate the margin softly (C), and are penalized as $C\sum_i \xi_i$ in the objective (E). They do not guarantee separability (D) and have nothing to do with feature dimensionality (F).
