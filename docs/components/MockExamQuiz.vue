<template>
  <div class="quiz-wrap">
    <div class="quiz-header">
      <h2>Mock Exam Interactive Quiz</h2>
      <p>Answer each question, submit to reveal detailed reasoning, then continue.</p>
      <p class="progress">Question {{ currentIndex + 1 }} / {{ questions.length }}</p>
    </div>

    <div v-if="!isFinished" class="quiz-card">
      <p class="meta">
        <strong>{{ current.exam }}</strong> · {{ current.section }} · {{ current.points }} point<span v-if="current.points !== 1">s</span>
      </p>
      <h3>{{ current.title }}</h3>
      <p class="prompt">{{ current.prompt }}</p>

      <div class="options">
        <label
          v-for="option in current.options"
          :key="option.id"
          class="option"
          :class="optionState(option.id)"
        >
          <input
            :type="current.type === 'single' ? 'radio' : 'checkbox'"
            :name="`q-${current.id}`"
            :value="option.id"
            :disabled="submitted[current.id]"
            @change="onSelect(current.id, option.id, current.type)"
            :checked="isSelected(current.id, option.id)"
          />
          <span><strong>{{ option.id }}.</strong> {{ option.text }}</span>
        </label>
      </div>

      <div class="actions" v-if="!submitted[current.id]">
        <button class="btn" @click="submitCurrent" :disabled="!hasSelection(current.id)">
          Submit Answer
        </button>
      </div>

      <div v-else class="feedback">
        <p :class="isCorrect(current) ? 'ok' : 'no'">
          <strong>{{ isCorrect(current) ? 'Correct' : 'Not correct' }}</strong>
          <span v-if="current.gradable !== false"> · +{{ isCorrect(current) ? current.points : 0 }} / {{ current.points }} points</span>
          <span v-else> · Ungraded</span>
        </p>

        <p class="correct-answer">
          <strong>Correct answer:</strong> {{ current.correct.join(', ') }}
        </p>

        <p class="reasoning-text">{{ current.reasoning }}</p>

        <ul class="reasoning-list">
          <li v-for="option in current.options" :key="`${current.id}-${option.id}`">
            <strong>{{ option.id }}:</strong>
            {{ current.optionReasoning[option.id] }}
          </li>
        </ul>

        <div class="actions">
          <button class="btn" @click="nextQuestion">
            {{ currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Exam' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="result-card">
      <h3>Exam Completed</h3>
      <p><strong>Total score:</strong> {{ totalScore }} / {{ maxScore }}</p>
      <p><strong>Accuracy:</strong> {{ percentage }}%</p>
      <p class="summary">
        You answered {{ correctCount }} out of {{ gradableCount }} graded questions fully correctly.
      </p>
      <button class="btn" @click="resetQuiz">Restart Quiz</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type Option = {
  id: string
  text: string
}

type QuizQuestion = {
  id: string
  exam: string
  section: string
  title: string
  prompt: string
  type: 'single' | 'multi'
  points: number
  options: Option[]
  correct: string[]
  reasoning: string
  optionReasoning: Record<string, string>
  gradable?: boolean
}

const questions: QuizQuestion[] = [
  {
    id: 'A1.1',
    exam: 'Exam A (2026)',
    section: 'Section 1 · Introduction',
    title: 'Q1.1 Postulate 6',
    prompt: 'Which statement best describes similarity through feature-space proximity?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Small feature differences should not drastically change classification.' },
      { id: 'B', text: 'Same-class patterns form compact groups in feature space.' },
      { id: 'C', text: 'A pattern can be decomposed into simpler constituents.' },
      { id: 'D', text: 'Valid patterns must satisfy structural arrangement constraints.' }
    ],
    correct: ['A'],
    reasoning:
      'Postulate 6 is a continuity principle: nearby feature vectors should map to similar outputs. It is fundamentally about local stability of decision functions.',
    optionReasoning: {
      A: 'Correct. It directly states continuity in feature space, the essence of Postulate 6.',
      B: 'Incorrect for this postulate. This is closer to compactness/separability assumptions.',
      C: 'Incorrect here. This expresses decomposability, not continuity.',
      D: 'Incorrect here. This refers to structural validity constraints.'
    }
  },
  {
    id: 'A1.2',
    exam: 'Exam A (2026)',
    section: 'Section 1 · Introduction',
    title: 'Q1.2 Why convexity matters',
    prompt: 'Why is convexity important in optimization?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'It guarantees a closed-form solution.' },
      { id: 'B', text: 'Any local minimum is also a global minimum.' },
      { id: 'C', text: 'It implies the objective is linear.' },
      { id: 'D', text: 'It implies an indefinite Hessian.' }
    ],
    correct: ['B'],
    reasoning:
      'Convexity provides a geometry where local descent cannot get trapped in suboptimal basins: every local minimizer is globally optimal.',
    optionReasoning: {
      A: 'Incorrect. Many convex problems still require iterative solvers and do not admit closed forms.',
      B: 'Correct. This is the central computational benefit of convexity.',
      C: 'Incorrect. Linear objectives are convex, but many nonlinear convex objectives exist.',
      D: 'Incorrect. Convex twice-differentiable functions have positive semidefinite Hessians.'
    }
  },
  {
    id: 'A1.3',
    exam: 'Exam A (2026)',
    section: 'Section 1 · Introduction',
    title: 'Q1.3 Discriminative vs generative mappings',
    prompt: 'Select all correct statement-to-model mappings.',
    type: 'multi',
    points: 4,
    options: [
      { id: 'A', text: 'Statement A (decision boundary) -> Discriminative only' },
      { id: 'B', text: 'Statement B (can classify input vector) -> Both' },
      { id: 'C', text: 'Statement C (models class distributions) -> Generative only' },
      { id: 'D', text: 'Statement D (trained with data) -> Both' }
    ],
    correct: ['A', 'B', 'C', 'D'],
    reasoning:
      'Discriminative methods model decision rules or posteriors directly, while generative methods model class-conditional distributions and priors. Both are trainable and both can classify.',
    optionReasoning: {
      A: 'Correct. Direct boundary/posterior modeling is discriminative behavior.',
      B: 'Correct. Both families produce predictions once trained.',
      C: 'Correct. Modeling class distributions is generative by definition.',
      D: 'Correct. Training data is required in both paradigms.'
    }
  },
  {
    id: 'A2.1',
    exam: 'Exam A (2026)',
    section: 'Section 2 · Logistic Regression',
    title: 'Q2.1 Fundamental properties',
    prompt: 'Which statements correctly describe logistic regression?',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'Generative model of p(x,y) + Bayes rule.' },
      { id: 'B', text: 'Discriminative model of p(y|x).' },
      { id: 'C', text: 'Outputs calibrated probabilities in [0,1].' },
      { id: 'D', text: 'Requires Gaussian class-conditionals with equal covariance.' },
      { id: 'E', text: 'Solved analytically in closed form.' }
    ],
    correct: ['B', 'C'],
    reasoning:
      'Logistic regression directly models conditional class probability and learns parameters numerically, typically by gradient-based optimization.',
    optionReasoning: {
      A: 'Incorrect. That is the generative route, not logistic regression.',
      B: 'Correct. It optimizes conditional likelihood p(y|x).',
      C: 'Correct. Sigmoid maps scores to probabilities.',
      D: 'Incorrect. That assumption belongs to LDA-like Gaussian discriminants.',
      E: 'Incorrect. No closed-form optimum exists for general logistic likelihood.'
    }
  },
  {
    id: 'A2.2',
    exam: 'Exam A (2026)',
    section: 'Section 2 · Logistic Regression',
    title: 'Q2.2 Sigmoid properties',
    prompt: 'Select valid properties of g(z)=1/(1+e^{-z}).',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'g(-z)=-g(z)' },
      { id: 'B', text: "g'(z)=g(z)(1-g(z))" },
      { id: 'C', text: 'Monotone map from R to (0,1)' },
      { id: 'D', text: 'g(0)=0' },
      { id: 'E', text: 'g(-z)=1-g(z)' }
    ],
    correct: ['B', 'C', 'E'],
    reasoning:
      'The logistic function has a useful self-referential derivative, strict monotonicity, and complementary symmetry around 0.5.',
    optionReasoning: {
      A: 'Incorrect. Logistic is not odd; tanh is odd.',
      B: 'Correct. This identity drives efficient gradient formulas.',
      C: 'Correct. It outputs proper probabilities.',
      D: 'Incorrect. g(0)=0.5.',
      E: 'Correct. It is the standard logistic symmetry relation.'
    }
  },
  {
    id: 'A2.3',
    exam: 'Exam A (2026)',
    section: 'Section 2 · Logistic Regression',
    title: 'Q2.3 Decision boundary geometry',
    prompt: 'For threshold 0.5, which statements are correct?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Boundary corresponds to log-odds equal 0.' },
      { id: 'B', text: 'Boundary is theta^T x = 0.5.' },
      { id: 'C', text: 'Boundary is linear in input feature space.' },
      { id: 'D', text: 'With feature transforms, boundary must remain linear in x.' },
      { id: 'E', text: 'Points on boundary have p(y=1|x)=0.5.' }
    ],
    correct: ['A', 'C', 'E'],
    reasoning:
      'At threshold 0.5, decision score must be zero, which yields a hyperplane in the active feature space. Transforming features can make this nonlinear in original x.',
    optionReasoning: {
      A: 'Correct. logit(p)=0 at p=0.5.',
      B: 'Incorrect. Score is zero at boundary, not 0.5.',
      C: 'Correct in raw feature space without nonlinear feature maps.',
      D: 'Incorrect. Linear in phi(x) can be nonlinear in x.',
      E: 'Correct by definition of the threshold.'
    }
  },
  {
    id: 'A2.4',
    exam: 'Exam A (2026)',
    section: 'Section 2 · Logistic Regression',
    title: 'Q2.4 Log-likelihood training',
    prompt: 'Which statements about maximizing logistic log-likelihood are true?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'The objective is concave in parameters.' },
      { id: 'B', text: 'Gradient sums (y_i - g(theta^T x_i)) x_i.' },
      { id: 'C', text: 'Poor init may trap optimization in local maxima.' },
      { id: 'D', text: 'Newton-Raphson interpretation connects to IRLS.' },
      { id: 'E', text: 'Updates depend only on sign of correctness.' }
    ],
    correct: ['A', 'B', 'D'],
    reasoning:
      'Concavity ensures no bad local maxima; gradient terms are continuous confidence-weighted residuals. Newton updates correspond to solving weighted least-squares subproblems.',
    optionReasoning: {
      A: 'Correct. Concavity gives global optimum with proper optimization.',
      B: 'Correct. This is the canonical gradient expression.',
      C: 'Incorrect. Concavity rules out suboptimal local maxima.',
      D: 'Correct. IRLS is the classic second-order view.',
      E: 'Incorrect. Magnitude of probability error matters.'
    }
  },
  {
    id: 'A2.5',
    exam: 'Exam A (2026)',
    section: 'Section 2 · Logistic Regression',
    title: 'Q2.5 Numeric boundary example',
    prompt: 'For theta=[1,1,-2]^T with z=x1+x2-2, which statements hold?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: '(1,1) lies exactly on boundary.' },
      { id: 'B', text: '(2,2) has probability > 0.5.' },
      { id: 'C', text: '(0,0) has log-odds 0.' },
      { id: 'D', text: 'Boundary equation is x2=-x1+2.' },
      { id: 'E', text: 'With zero bias, (0,0) lies on boundary.' }
    ],
    correct: ['A', 'B', 'D', 'E'],
    reasoning:
      'Plugging coordinates into z verifies boundary membership and side of hyperplane. Setting z=0 gives explicit line equation.',
    optionReasoning: {
      A: 'Correct. 1+1-2=0.',
      B: 'Correct. z=2 and sigmoid(2)>0.5.',
      C: 'Incorrect. At (0,0), z=-2.',
      D: 'Correct. Rearranging x1+x2-2=0 yields x2=-x1+2.',
      E: 'Correct. If bias term is 0, z(0,0)=0.'
    }
  },
  {
    id: 'A3.1',
    exam: 'Exam A (2026)',
    section: 'Section 3 · Evaluation',
    title: 'Q3.1 Confusion-matrix interpretation',
    prompt: 'With TP=40, FP=15, FN=10, TN=35, select correct statements.',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'FPR = 15/55' },
      { id: 'B', text: 'Accuracy = 75/100' },
      { id: 'C', text: 'TPR = Recall = 40/50' },
      { id: 'D', text: 'NPV = 35/50' },
      { id: 'E', text: 'F1 = 80/105' },
      { id: 'F', text: 'Balanced classes imply ACC=TPR always' }
    ],
    correct: ['B', 'C', 'E'],
    reasoning:
      'All derived metrics come directly from confusion-matrix denominators; many distractors swap denominators incorrectly.',
    optionReasoning: {
      A: 'Incorrect. FPR=FP/(FP+TN)=15/50.',
      B: 'Correct. (TP+TN)/N=(40+35)/100.',
      C: 'Correct. TPR=TP/(TP+FN)=40/50.',
      D: 'Incorrect. NPV=TN/(TN+FN)=35/45.',
      E: 'Correct. 2TP/(2TP+FP+FN)=80/105.',
      F: 'Incorrect. Equality is not guaranteed by balance alone.'
    }
  },
  {
    id: 'A3.2',
    exam: 'Exam A (2026)',
    section: 'Section 3 · Evaluation',
    title: 'Q3.2 Metric relationships',
    prompt: 'Which metric identities are correct?',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'F-measure is geometric mean of precision and recall' },
      { id: 'B', text: 'FPR is FP among predicted positives' },
      { id: 'C', text: 'TPR equals Recall and Sensitivity' },
      { id: 'D', text: 'Predict-all-positive gives Specificity=1' },
      { id: 'E', text: 'NPV denominator contains TN and FN' },
      { id: 'F', text: 'Specificity = 1 - FPR' }
    ],
    correct: ['C', 'E', 'F'],
    reasoning:
      'Precision/recall/FPR/specificity are denominator-sensitive metrics; correct interpretation depends on conditioning event.',
    optionReasoning: {
      A: 'Incorrect. F1 is harmonic mean.',
      B: 'Incorrect. That denominator is for precision-like quantities.',
      C: 'Correct. These are synonymous.',
      D: 'Incorrect. Predict-all-positive implies TN=0, so specificity=0.',
      E: 'Correct. NPV=TN/(TN+FN).',
      F: 'Correct by TNR/FPR complementarity.'
    }
  },
  {
    id: 'A3.3',
    exam: 'Exam A (2026)',
    section: 'Section 3 · Evaluation',
    title: 'Q3.3 Lowering threshold effects',
    prompt: 'If threshold decreases, what must hold?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Predicted-positive set becomes a superset' },
      { id: 'B', text: 'TPR can only increase or stay equal' },
      { id: 'C', text: 'FPR can only decrease or stay equal' },
      { id: 'D', text: 'Specificity can only decrease or stay equal' },
      { id: 'E', text: 'ROC point moves up and left' },
      { id: 'F', text: 'Accuracy must improve' }
    ],
    correct: ['A', 'B', 'D'],
    reasoning:
      'Lower threshold accepts more samples as positive. This weakly increases both TPR and FPR, and therefore weakly decreases specificity.',
    optionReasoning: {
      A: 'Correct. Any previously positive sample remains positive.',
      B: 'Correct. You cannot lose already captured positives by lowering threshold.',
      C: 'Incorrect. FPR generally increases or stays constant.',
      D: 'Correct. Since Specificity=1-FPR, it decreases or stays.',
      E: 'Incorrect. It moves up-right (higher TPR and FPR).',
      F: 'Incorrect. Accuracy impact depends on class priors and score distribution.'
    }
  },
  {
    id: 'A3.4',
    exam: 'Exam A (2026)',
    section: 'Section 3 · Evaluation',
    title: 'Q3.4 ROC properties',
    prompt: 'Select true statements about ROC and AUC.',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'A fixed threshold is a single ROC point; sweeping threshold traces a curve' },
      { id: 'B', text: 'Diagonal ROC is random guessing with AUC=0.5' },
      { id: 'C', text: 'AUC summarizes performance across all thresholds' },
      { id: 'D', text: 'Changing class priors must change ROC curve' },
      { id: 'E', text: 'If ROC is prior-independent, it is threshold-independent too' },
      { id: 'F', text: 'At FPR=0.5 and TPR=0.5, accuracy is 0.5 for any priors' }
    ],
    correct: ['A', 'B', 'C', 'F'],
    reasoning:
      'ROC is a threshold-parameterized curve in conditional-rate space and is prior-invariant. Specific operating points still depend on threshold choice.',
    optionReasoning: {
      A: 'Correct. Threshold controls one point on the curve.',
      B: 'Correct. Random ranking yields diagonal behavior.',
      C: 'Correct. AUC integrates curve behavior over thresholds.',
      D: 'Incorrect. Class priors do not alter TPR/FPR definitions.',
      E: 'Incorrect. Prior independence does not remove threshold dependence.',
      F: 'Correct. With both rates at 0.5, both classes are half-correct.'
    }
  },
  {
    id: 'A3.5',
    exam: 'Exam A (2026)',
    section: 'Section 3 · Evaluation',
    title: 'Q3.5 Multiclass confusion-matrix facts',
    prompt: 'For K-class confusion matrix [n_ij], choose correct statements.',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Class-k recall denominator is row sum' },
      { id: 'B', text: 'Class-k precision denominator is row sum' },
      { id: 'C', text: 'UAR is sample-count-weighted average recall' },
      { id: 'D', text: 'Doubling all counts changes recognition rate' },
      { id: 'E', text: 'Swapping reference and hypothesis keeps recognition rate unchanged' },
      { id: 'F', text: 'Swapping reference and hypothesis exchanges recall and precision roles' }
    ],
    correct: ['A', 'E', 'F'],
    reasoning:
      'Recall conditions on truth (rows), precision conditions on predictions (columns). Recognition rate depends only on diagonal sum over total count.',
    optionReasoning: {
      A: 'Correct. Recall_k = n_kk / sum_j n_kj.',
      B: 'Incorrect. Precision uses column denominator.',
      C: 'Incorrect. UAR is unweighted class average.',
      D: 'Incorrect. Scaling numerator and denominator equally leaves ratio unchanged.',
      E: 'Correct. Diagonal and total count are transpose-invariant.',
      F: 'Correct. Transposition swaps row/column-conditioned metrics.'
    }
  },
  {
    id: 'A4.1',
    exam: 'Exam A (2026)',
    section: 'Section 4 · LDA/PCA',
    title: 'Q4.1 Rank-reduced LDA',
    prompt: 'Which statements about rank-reduced LDA are correct?',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'Selects directions maximizing class-centroid separation' },
      { id: 'B', text: 'PCA step mainly removes within-class variance only' },
      { id: 'C', text: 'Builds lower-dimensional discriminative subspace' },
      { id: 'D', text: 'Can outperform PCA for classification despite lower retained variance' },
      { id: 'E', text: 'Selects directions maximizing overall variance' }
    ],
    correct: ['A', 'C', 'D'],
    reasoning:
      'LDA is discrimination-oriented, not reconstruction-oriented. Preserving variance and preserving class separability are different goals.',
    optionReasoning: {
      A: 'Correct. Between-class spread is explicitly promoted.',
      B: 'Incorrect. PCA does not isolate within-class variance in that way.',
      C: 'Correct. It targets low-dimensional discriminative structure.',
      D: 'Correct. Classification can improve even with less retained variance.',
      E: 'Incorrect. That objective defines PCA.'
    }
  },
  {
    id: 'A4.2',
    exam: 'Exam A (2026)',
    section: 'Section 4 · LDA/PCA',
    title: 'Q4.2 PCA vs LDA fundamentals',
    prompt: 'Choose true statements.',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'PCA is supervised and naturally identifies classes' },
      { id: 'B', text: 'LDA uses labels to guide transformation' },
      { id: 'C', text: 'PCA directly maximizes class separability' },
      { id: 'D', text: 'LDA maximizes between-class relative to within-class variance' },
      { id: 'E', text: 'PCA guarantees best classification performance' }
    ],
    correct: ['B', 'D'],
    reasoning:
      'PCA is unsupervised variance compression; LDA is supervised discriminative projection.',
    optionReasoning: {
      A: 'Incorrect. PCA ignores labels.',
      B: 'Correct. Labels are required by LDA.',
      C: 'Incorrect. PCA optimizes variance, not class separation.',
      D: 'Correct. This is LDA core criterion.',
      E: 'Incorrect. No such classification guarantee exists.'
    }
  },
  {
    id: 'A4.3',
    exam: 'Exam A (2026)',
    section: 'Section 4 · LDA/PCA',
    title: 'Q4.3 Sphering transform',
    prompt: 'What does phi(x)=D^(-1/2)U^T x primarily achieve?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Transforms covariances to identity form' },
      { id: 'B', text: 'Decorrelates features for simpler geometry' },
      { id: 'C', text: 'Directly maximizes between/within scatter ratio' },
      { id: 'D', text: 'Guarantees lossless dimensionality reduction' },
      { id: 'E', text: 'Forces class means to become orthogonal' }
    ],
    correct: ['A', 'B'],
    reasoning:
      'Whitening/sphering normalizes covariance structure, producing isotropic geometry. Discriminative projection is a subsequent step.',
    optionReasoning: {
      A: 'Correct. Whitening maps covariance toward identity.',
      B: 'Correct. U rotates into eigenbasis and D rescales variances.',
      C: 'Incorrect. That is LDA objective, not sphering alone.',
      D: 'Incorrect. No guarantee on dimensionality reduction or no-loss.',
      E: 'Incorrect. Means are not forced orthogonal by whitening.'
    }
  },
  {
    id: 'A4.4',
    exam: 'Exam A (2026)',
    section: 'Section 4 · LDA/PCA',
    title: 'Q4.4 Distance metrics geometry',
    prompt: 'Select correct geometric statements.',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Mahalanobis equals Euclidean distance in whitened space' },
      { id: 'B', text: 'Top PCA variance directions always improve class separation' },
      { id: 'C', text: 'Equal-covariance Gaussian Bayes with equal priors becomes nearest-mean in Mahalanobis metric' },
      { id: 'D', text: 'Equal-covariance Gaussian Bayes with equal priors always becomes nearest-mean in Euclidean metric' },
      { id: 'E', text: 'High-variance PCA directions can reflect within-class spread and hurt separability' }
    ],
    correct: ['A', 'C', 'E'],
    reasoning:
      'Mahalanobis incorporates covariance structure; Euclidean nearest-mean is a special case when covariance is identity.',
    optionReasoning: {
      A: 'Correct. Whitening transforms quadratic form into Euclidean norm.',
      B: 'Incorrect. Variance and discriminability are different objectives.',
      C: 'Correct. Shared covariance yields linear discriminant in Mahalanobis geometry.',
      D: 'Incorrect. Requires identity covariance for pure Euclidean form.',
      E: 'Correct. PCA may prioritize nuisance spread.'
    }
  },
  {
    id: 'A4.5',
    exam: 'Exam A (2026)',
    section: 'Section 4 · LDA/PCA',
    title: 'Q4.5 Full LDA implementation details',
    prompt: 'Choose technically correct implementation statements.',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'After sphering, nearest-centroid rule uses L1 distance' },
      { id: 'B', text: 'Sphering itself performs rank reduction to K-1' },
      { id: 'C', text: 'Rank-reduced LDA uses generalized eigenproblem; subspace dimension <= K-1' },
      { id: 'D', text: 'After sphering, decision boundaries are quadratic due to squared distances' },
      { id: 'E', text: 'Fisher criterion yields same linear boundaries; two-class direction proportional to SW^-1(mu1-mu2)' }
    ],
    correct: ['C', 'E'],
    reasoning:
      'Rank constraints come from between-class scatter matrix rank; Fisher and LDA formulations are equivalent under standard assumptions.',
    optionReasoning: {
      A: 'Incorrect. Euclidean (L2) distance is the canonical form.',
      B: 'Incorrect. Rank reduction is from discriminative projection step.',
      C: 'Correct. This is a standard LDA dimensionality result.',
      D: 'Incorrect. Equal-covariance setting leads to linear boundaries.',
      E: 'Correct. This is the textbook Fisher-LDA relation.'
    }
  },
  {
    id: 'A5.1',
    exam: 'Exam A (2026)',
    section: 'Section 5 · Optimization',
    title: 'Q5.1 Step 1 standard form',
    prompt: 'Convert x1+x2 >= 4 into fi(x) <= 0 form.',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'x1+x2-4 <= 0' },
      { id: 'B', text: '4-x1-x2 <= 0' },
      { id: 'C', text: 'x1+x2-4 = 0' },
      { id: 'D', text: '-(x1+x2) <= -4' },
      { id: 'E', text: 'x1 >= 4-x2' }
    ],
    correct: ['B'],
    reasoning:
      'Standard inequality form for Lagrangian setup requires <=0. Multiplying both sides of >= by -1 provides that form.',
    optionReasoning: {
      A: 'Incorrect orientation for original feasible set.',
      B: 'Correct. Equivalent and in proper standard form.',
      C: 'Incorrect. Equality is more restrictive than original inequality.',
      D: 'Equivalent algebraically to B but not presented as fi(x)<=0 with fi explicitly isolated as in exam key.',
      E: 'Equivalent constraint form but not canonical fi(x)<=0 expression requested.'
    }
  },
  {
    id: 'A5.2',
    exam: 'Exam A (2026)',
    section: 'Section 5 · Optimization',
    title: 'Q5.1 Step 2 Lagrangian construction',
    prompt: 'With f1(x)=4-x1-x2<=0 and lambda>=0, which L is correct?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: '0.5||x||^2 - lambda(x1+x2-4)' },
      { id: 'B', text: '0.5||x||^2 + lambda(4-x1-x2)' },
      { id: 'C', text: '||x||^2 + lambda(4-x1-x2)' },
      { id: 'D', text: '0.5||x||^2 + lambda(x1+x2-4)^2' }
    ],
    correct: ['B'],
    reasoning:
      'For inequality fi<=0, Lagrangian is objective plus lambda_i*fi with lambda_i>=0. Objective must remain exactly as given.',
    optionReasoning: {
      A: 'Incorrect sign convention relative to chosen fi.',
      B: 'Correct exact form.',
      C: 'Incorrect objective scaling.',
      D: 'Incorrect: quadratic penalty is not standard Lagrangian term here.'
    }
  },
  {
    id: 'A5.3',
    exam: 'Exam A (2026)',
    section: 'Section 5 · Optimization',
    title: 'Q5.1 Step 3 stationarity in x',
    prompt: 'After setting grad_x L = 0, what relation holds?',
    type: 'single',
    points: 2,
    options: [
      { id: 'A', text: 'x1=0, x2=0' },
      { id: 'B', text: 'x1=-lambda, x2=-lambda' },
      { id: 'C', text: 'x1=lambda, x2=lambda' },
      { id: 'D', text: 'x1=4-x2' },
      { id: 'E', text: 'x=lambda/2 from 2x-lambda=0' }
    ],
    correct: ['C'],
    reasoning:
      'Differentiate each coordinate: dL/dx1=x1-lambda and dL/dx2=x2-lambda. Stationarity enforces both equal zero.',
    optionReasoning: {
      A: 'Incorrect unless lambda=0 specifically; not general stationarity form.',
      B: 'Incorrect sign.',
      C: 'Correct.',
      D: 'Constraint relation, not stationarity condition.',
      E: 'Incorrect derivative expression for this objective form.'
    }
  },
  {
    id: 'A5.4',
    exam: 'Exam A (2026)',
    section: 'Section 5 · Optimization',
    title: 'Q5.1 Step 4 dual function',
    prompt: 'After substituting x1=x2=lambda into L, what is g(lambda)?',
    type: 'single',
    points: 2,
    options: [
      { id: 'A', text: 'lambda^2 - 4lambda' },
      { id: 'B', text: '4lambda - lambda^2' },
      { id: 'C', text: '4lambda - 2lambda^2' },
      { id: 'D', text: '2lambda^2 + 4' },
      { id: 'E', text: '-0.5lambda^2 + 4lambda' }
    ],
    correct: ['B'],
    reasoning:
      'Substitution gives 0.5(2lambda^2)+lambda(4-2lambda)=lambda^2+4lambda-2lambda^2=4lambda-lambda^2.',
    optionReasoning: {
      A: 'Incorrect sign on both terms.',
      B: 'Correct simplified dual function.',
      C: 'Incorrect coefficient on quadratic term.',
      D: 'Incorrect form and constants.',
      E: 'Incorrect quadratic coefficient.'
    }
  },
  {
    id: 'A6.1',
    exam: 'Exam A (2026)',
    section: 'Section 6 · EM',
    title: 'Q6.1 Incorrect statements about latent variables',
    prompt: 'Select the statements that are incorrect.',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'Observed-data likelihood is guaranteed to increase whenever responsibilities are updated' },
      { id: 'B', text: 'If Z were observed, MLE reduces to fitting independent Gaussians by component subsets' },
      { id: 'C', text: 'Observed-data likelihood is convex after marginalizing latent variables' },
      { id: 'D', text: 'Knowing latent variables removes need for EM and yields closed-form MLE' },
      { id: 'E', text: 'Known assignments separate terms; unknown assignments create log-sum form' }
    ],
    correct: ['A', 'C'],
    reasoning:
      'EM guarantees non-decreasing observed likelihood across full EM iterations, but convexity is not guaranteed and typically fails for mixtures.',
    optionReasoning: {
      A: 'Correctly selected as incorrect. E-step alone does not directly maximize observed-data likelihood.',
      B: 'Not incorrect. This is true and should not be selected.',
      C: 'Correctly selected as incorrect. GMM observed likelihood is non-convex.',
      D: 'Not incorrect. With latent labels known, closed-form updates exist.',
      E: 'Not incorrect. This captures complete vs incomplete-data forms.'
    }
  },
  {
    id: 'A6.2',
    exam: 'Exam A (2026)',
    section: 'Section 6 · EM',
    title: 'Q6.2 Responsibilities',
    prompt: 'Which statements about responsibilities gamma(z_nk) are true?',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'They are posterior probabilities over latent assignments' },
      { id: 'B', text: 'They sum to 1 across components for each sample' },
      { id: 'C', text: 'They are hard assignments' },
      { id: 'D', text: 'They depend on current parameter estimates' },
      { id: 'E', text: 'They are optimized in the M-step' }
    ],
    correct: ['A', 'B', 'D'],
    reasoning:
      'Responsibilities are soft posteriors from the E-step under current parameters and define expected component membership fractions.',
    optionReasoning: {
      A: 'Correct. gamma is p(z_nk=1 | x_n, theta).',
      B: 'Correct. They form a categorical distribution per sample.',
      C: 'Incorrect. Hard assignments are k-means style.',
      D: 'Correct. Means, covariances, and mixture weights influence gamma.',
      E: 'Incorrect. They are computed in E-step.'
    }
  },
  {
    id: 'A6.3',
    exam: 'Exam A (2026)',
    section: 'Section 6 · EM',
    title: 'Q6.3 Convergence behavior',
    prompt: 'Choose true convergence statements.',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Initialization affects final estimate' },
      { id: 'B', text: 'EM is guaranteed to converge' },
      { id: 'C', text: 'EM is guaranteed to find global maximum' },
      { id: 'D', text: 'Converged estimate is guaranteed global MLE' }
    ],
    correct: ['A', 'B'],
    reasoning:
      'EM converges to a stationary point with monotonic objective progression, but not necessarily the global optimum.',
    optionReasoning: {
      A: 'Correct. Non-convex landscape implies init sensitivity.',
      B: 'Correct. Standard EM guarantees monotonic non-decrease and convergence of objective sequence.',
      C: 'Incorrect. Global optimality is not guaranteed.',
      D: 'Incorrect for same reason.'
    }
  },
  {
    id: 'A6.4',
    exam: 'Exam A (2026)',
    section: 'Section 6 · EM',
    title: 'Q6.4 MLE vs MAP',
    prompt: 'Which statements are correct?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'MLE uses only likelihood; MAP includes prior' },
      { id: 'B', text: 'Uniform prior makes MAP equivalent to MLE' },
      { id: 'C', text: 'MAP maximizes log p(X|theta) + log p(theta)' },
      { id: 'D', text: 'MAP is always better than MLE' },
      { id: 'E', text: 'For huge datasets prior influence always necessarily vanishes' }
    ],
    correct: ['A', 'B', 'C'],
    reasoning:
      'MAP introduces prior regularization term. Whether this helps depends on prior quality and finite-sample regime.',
    optionReasoning: {
      A: 'Correct conceptual distinction.',
      B: 'Correct because constant log-prior does not affect argmax.',
      C: 'Correct optimization form.',
      D: 'Incorrect. Bad priors can hurt.',
      E: 'Incorrect as absolute statement; pathological priors can dominate.'
    }
  },
  {
    id: 'A6.5',
    exam: 'Exam A (2026)',
    section: 'Section 6 · EM',
    title: 'Q6.5 Degeneracy and refinement',
    prompt: 'Select correct statements about EM behavior and GMM pathology.',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'EM directly optimizes classification accuracy' },
      { id: 'B', text: 'M-step maximizes expected complete-data log-likelihood with fixed responsibilities' },
      { id: 'C', text: 'EM fixed points may include saddle points' },
      { id: 'D', text: 'EM can converge to collapsed covariance solutions' },
      { id: 'E', text: 'GMM is density model; class/source prediction needs posterior decision rule' }
    ],
    correct: ['B', 'C', 'D', 'E'],
    reasoning:
      'EM is a likelihood-based latent-variable optimizer. Classification requires an additional decision layer over posterior quantities.',
    optionReasoning: {
      A: 'Incorrect. Accuracy is not the optimized objective.',
      B: 'Correct description of M-step objective.',
      C: 'Correct. Stationarity does not imply strict local maximum.',
      D: 'Correct. Covariance collapse is a known degeneracy.',
      E: 'Correct. Posterior-based rule is needed for label decisions.'
    }
  },
  {
    id: 'B1.1',
    exam: 'Exam B (2025)',
    section: 'Section 1 · Single Choice',
    title: 'Q1.1 Boosting',
    prompt: 'What is true about boosting methods in general?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Weighted combination of many strong classifiers' },
      { id: 'B', text: 'Weighted combination of many weak classifiers' },
      { id: 'C', text: 'Train many models then keep only the best one' },
      { id: 'D', text: 'Feature selection procedure for one strong model' }
    ],
    correct: ['B'],
    reasoning:
      'Boosting sequentially combines weak learners into a strong ensemble through adaptive weighting.',
    optionReasoning: {
      A: 'Incorrect phrasing; boosting specifically leverages weak learners.',
      B: 'Correct.',
      C: 'Incorrect. That is model selection, not boosting.',
      D: 'Incorrect. Not the defining mechanism.'
    }
  },
  {
    id: 'B1.2',
    exam: 'Exam B (2025)',
    section: 'Section 1 · Single Choice',
    title: 'Q1.2 Bayes optimal property',
    prompt: 'What does an optimal Bayes classifier guarantee?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Perfect classification of every sample' },
      { id: 'B', text: 'Minimum false positives specifically' },
      { id: 'C', text: 'Maximum sample efficiency' },
      { id: 'D', text: 'Minimum achievable expected error rate' }
    ],
    correct: ['D'],
    reasoning:
      'Bayes decision rule is risk-optimal under true distributions, yielding Bayes error lower bound.',
    optionReasoning: {
      A: 'Incorrect. Bayes error can still be non-zero due to overlap/noise.',
      B: 'Incorrect. Objective is total expected risk, not a single error type.',
      C: 'Incorrect concept mismatch.',
      D: 'Correct.'
    }
  },
  {
    id: 'B1.3',
    exam: 'Exam B (2025)',
    section: 'Section 1 · Single Choice',
    title: 'Q1.3 PCA properties',
    prompt: 'Select valid statements for PCA.',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'Preserves manifold distances exactly' },
      { id: 'B', text: 'Decorrelates features' },
      { id: 'C', text: 'Performs dimensionality reduction' },
      { id: 'D', text: 'Classifies features' }
    ],
    correct: ['B', 'C'],
    reasoning:
      'PCA is an unsupervised linear transform maximizing variance directions; it can decorrelate and reduce dimension.',
    optionReasoning: {
      A: 'Incorrect. Exact manifold-distance preservation is not PCA guarantee.',
      B: 'Correct. In principal basis covariance is diagonal.',
      C: 'Correct via truncation to top components.',
      D: 'Incorrect. PCA is not a classifier.'
    }
  },
  {
    id: 'B1.4',
    exam: 'Exam B (2025)',
    section: 'Section 1 · Single Choice',
    title: 'Q1.4 Prior knowledge in EM',
    prompt: 'How can prior knowledge be incorporated in EM?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Change only E-step' },
      { id: 'B', text: 'Change only M-step via MAP objective' },
      { id: 'C', text: 'Must change both steps always' },
      { id: 'D', text: 'Impossible' }
    ],
    correct: ['B'],
    reasoning:
      'MAP-EM typically modifies maximization target by adding log-prior terms in M-step.',
    optionReasoning: {
      A: 'Incorrect in standard MAP-EM framing.',
      B: 'Correct.',
      C: 'Incorrect as absolute statement.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'B1.5',
    exam: 'Exam B (2025)',
    section: 'Section 1 · Single Choice',
    title: 'Q1.5 Good features',
    prompt: 'Which property should feature design target?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Preserve class information while reducing dimension' },
      { id: 'B', text: 'Increase class information while increasing dimension' },
      { id: 'C', text: 'Preserve class information while increasing dimension' },
      { id: 'D', text: 'Increase class information while reducing dimension' }
    ],
    correct: ['A'],
    reasoning:
      'A good transform compresses nuisance variation while retaining discriminative signal.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Incorrect objective and often worsens complexity.',
      C: 'Suboptimal: no compression advantage.',
      D: 'Usually impossible wording; information is transformed, not magically increased.'
    }
  },
  {
    id: 'B1.6',
    exam: 'Exam B (2025)',
    section: 'Section 1 · Single Choice',
    title: 'Q1.6 Regression meaning',
    prompt: 'Regression generally refers to estimating what?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'A linear model only' },
      { id: 'B', text: 'A continuous output function' },
      { id: 'C', text: 'Posterior probabilities for classes' },
      { id: 'D', text: 'Class labels' }
    ],
    correct: ['B'],
    reasoning:
      'Regression predicts real-valued outputs; linearity is one special case only.',
    optionReasoning: {
      A: 'Incorrect. Nonlinear regression exists.',
      B: 'Correct.',
      C: 'Classification-related quantity.',
      D: 'Classification target, not regression target.'
    }
  },
  {
    id: 'B2.1',
    exam: 'Exam B (2025)',
    section: 'Section 2 · Multiple Choice',
    title: 'Q2.1 Viola-Jones features',
    prompt: 'Without the original figure labels, what feature family does Viola-Jones use?',
    type: 'multi',
    points: 0,
    gradable: false,
    options: [
      { id: 'A', text: 'Two-rectangle Haar features' },
      { id: 'B', text: 'Three-rectangle Haar features' },
      { id: 'C', text: 'Four-rectangle Haar features' },
      { id: 'D', text: 'SIFT descriptors as core primitive' }
    ],
    correct: ['A', 'B', 'C'],
    reasoning:
      'The exam sub-question depends on a labeled figure, so this card is ungraded here. Conceptually, Viola-Jones uses Haar-like rectangular intensity contrasts.',
    optionReasoning: {
      A: 'Correct conceptually (edge-type Haar features).',
      B: 'Correct conceptually (line-type Haar features).',
      C: 'Correct conceptually (checkerboard-type Haar features).',
      D: 'Incorrect. SIFT is unrelated to classical Viola-Jones features.'
    }
  },
  {
    id: 'B2.2',
    exam: 'Exam B (2025)',
    section: 'Section 2 · Multiple Choice',
    title: 'Q2.2 EM disadvantages',
    prompt: 'Which are disadvantages of EM?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Slow convergence' },
      { id: 'B', text: 'Only usable for GMMs' },
      { id: 'C', text: 'Local optimization only' },
      { id: 'D', text: 'Requires labeled dataset' },
      { id: 'E', text: 'Sensitive to initialization' },
      { id: 'F', text: 'May converge to poor local optima/saddles' }
    ],
    correct: ['A', 'C', 'E', 'F'],
    reasoning:
      'EM is broadly applicable but non-convex and initialization-sensitive, with typically linear (sometimes slow) convergence behavior.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Incorrect. EM is a general latent-variable optimization framework.',
      C: 'Correct.',
      D: 'Incorrect. Often used unsupervised.',
      E: 'Correct.',
      F: 'Correct.'
    }
  },
  {
    id: 'B3.1',
    exam: 'Exam B (2025)',
    section: 'Section 3 · Introduction',
    title: 'Q3.1 Generative-only properties',
    prompt: 'Which statements are only true for generative models?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Models class distributions' },
      { id: 'B', text: 'Bayesian classifier belongs to this family' },
      { id: 'C', text: 'Logistic regression belongs to this family' },
      { id: 'D', text: 'Can generate samples from learned distribution' },
      { id: 'E', text: 'Always maximizes margin' },
      { id: 'F', text: 'Requires modeling p(x|y) and p(y)' }
    ],
    correct: ['A', 'B', 'D', 'F'],
    reasoning:
      'Generative models represent data-generation process via class-conditional likelihoods and priors, enabling synthesis and Bayes inversion.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Correct.',
      C: 'Incorrect. Logistic regression is discriminative.',
      D: 'Correct.',
      E: 'Incorrect. Margin maximization is SVM-specific.',
      F: 'Correct.'
    }
  },
  {
    id: 'B3.2a',
    exam: 'Exam B (2025)',
    section: 'Section 3 · Introduction',
    title: 'Q3.2 Snippet 1 mapping',
    prompt: 'Snippet computes inverse(X X^T) * X * y in fit(). Which algorithm is this closest to?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'k-Nearest Neighbor' },
      { id: 'B', text: 'Linear Regression (normal equation form)' },
      { id: 'C', text: 'Decision Tree' },
      { id: 'D', text: 'Perceptron' }
    ],
    correct: ['B'],
    reasoning:
      'This algebraic closed-form resembles least-squares normal-equation solving, characteristic of linear regression.',
    optionReasoning: {
      A: 'Incorrect. kNN has no such matrix inversion training.',
      B: 'Correct.',
      C: 'Incorrect. Trees split recursively, no global matrix inverse.',
      D: 'Incorrect. Perceptron is iterative, not this closed form.'
    }
  },
  {
    id: 'B3.2b',
    exam: 'Exam B (2025)',
    section: 'Section 3 · Introduction',
    title: 'Q3.2 Snippet 2 mapping',
    prompt: 'Snippet computes Euclidean distances and argsort at predict time. Which algorithm?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Linear Regression' },
      { id: 'B', text: 'Naive Bayes' },
      { id: 'C', text: 'k-Nearest Neighbor' },
      { id: 'D', text: 'AdaBoost' }
    ],
    correct: ['C'],
    reasoning:
      'Distance computation against stored training samples with nearest-neighbor ranking is defining kNN behavior.',
    optionReasoning: {
      A: 'Incorrect.',
      B: 'Incorrect.',
      C: 'Correct.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'B4.1a',
    exam: 'Exam B (2025)',
    section: 'Section 4 · Bayes Classification',
    title: 'Q4.1(a) Model special case',
    prompt: 'Which model family/special case applies?',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'Logistic Regression' },
      { id: 'B', text: 'Naive Bayes with Gaussian assumption' },
      { id: 'C', text: 'Decision Tree' },
      { id: 'D', text: 'Generative approach with conditional independence' },
      { id: 'E', text: 'Naive Bayes with Bernoulli assumption' },
      { id: 'F', text: 'SVM' }
    ],
    correct: ['B', 'D'],
    reasoning:
      'Given Gaussian class-conditionals and conditional independence, this is Gaussian Naive Bayes as a generative classifier.',
    optionReasoning: {
      A: 'Incorrect.',
      B: 'Correct.',
      C: 'Incorrect.',
      D: 'Correct.',
      E: 'Incorrect distribution type.',
      F: 'Incorrect.'
    }
  },
  {
    id: 'B4.1b',
    exam: 'Exam B (2025)',
    section: 'Section 4 · Bayes Classification',
    title: 'Q4.1(b) Prior probabilities',
    prompt: 'Which prior statements are correct?',
    type: 'multi',
    points: 1,
    options: [
      { id: 'A', text: 'Both priors are 0.5' },
      { id: 'B', text: 'Priors are not required' },
      { id: 'C', text: 'p(y=0)=0.6 and p(y=1)=0.4' },
      { id: 'D', text: 'p(y=0)=0.4 and p(y=1)=0.6' },
      { id: 'E', text: 'Class y=0 corresponds to Iris Versicolor' },
      { id: 'F', text: 'Priors are always uniform' }
    ],
    correct: ['C', 'E'],
    reasoning:
      'The problem statement provides class prevalence and explicit class mapping, both of which are needed for posterior computation.',
    optionReasoning: {
      A: 'Incorrect from given frequencies.',
      B: 'Incorrect. Priors are part of Bayes posterior.',
      C: 'Correct.',
      D: 'Incorrect reversed assignment.',
      E: 'Correct factual mapping from statement.',
      F: 'Incorrect; priors need not be uniform.'
    }
  },
  {
    id: 'B4.1c',
    exam: 'Exam B (2025)',
    section: 'Section 4 · Bayes Classification',
    title: 'Q4.1(c) Likelihood computations',
    prompt: 'For x=(4,4), which likelihood statements are correct?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'p(x|y=0) ≈ 0.0228' },
      { id: 'B', text: 'p(x|y=1) ≈ 0.0157' },
      { id: 'C', text: 'Both likelihoods are equal' },
      { id: 'D', text: 'Cannot compute likelihoods from given data' },
      { id: 'E', text: 'Likelihood ratio p(x|y=0)/p(x|y=1) > 1' },
      { id: 'F', text: 'p(x|y=0) ≈ 0.9' }
    ],
    correct: ['A', 'B', 'E'],
    reasoning:
      'Substituting means/variances into Gaussian densities yields the provided numeric approximations and ratio > 1.',
    optionReasoning: {
      A: 'Correct numeric approximation.',
      B: 'Correct numeric approximation.',
      C: 'Incorrect.',
      D: 'Incorrect; all required parameters are provided.',
      E: 'Correct consequence of A and B.',
      F: 'Incorrect by large margin.'
    }
  },
  {
    id: 'B4.1d',
    exam: 'Exam B (2025)',
    section: 'Section 4 · Bayes Classification',
    title: 'Q4.1(d) Posterior probabilities',
    prompt: 'Which posterior statements are correct?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'p(y=0|x) ≈ 0.68' },
      { id: 'B', text: 'p(y=1|x) ≈ 0.32' },
      { id: 'C', text: 'p(y=0|x) ≈ 0.5' },
      { id: 'D', text: 'p(y=1|x) ≈ 0.5' },
      { id: 'E', text: 'p(y=0|x) ≈ 0.99' },
      { id: 'F', text: 'p(y=1|x) ≈ 0.01' }
    ],
    correct: ['A', 'B'],
    reasoning:
      'Posterior is proportional to likelihood times prior, then normalized across classes. Given numbers produce roughly 0.68/0.32 split.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Correct.',
      C: 'Incorrect.',
      D: 'Incorrect.',
      E: 'Incorrect.',
      F: 'Incorrect.'
    }
  },
  {
    id: 'B4.1e',
    exam: 'Exam B (2025)',
    section: 'Section 4 · Bayes Classification',
    title: 'Q4.1(e) Final class decision',
    prompt: 'How is x=(4,4) classified?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Class y=1 (Iris Virginica)' },
      { id: 'B', text: 'Cannot be determined' },
      { id: 'C', text: 'Both equally likely' },
      { id: 'D', text: 'Depends only on priors' },
      { id: 'E', text: 'Third unknown class' },
      { id: 'F', text: 'Class y=0 (Iris Versicolor)' }
    ],
    correct: ['F'],
    reasoning:
      'MAP selects class with larger posterior. Since p(y=0|x) > p(y=1|x), assign y=0.',
    optionReasoning: {
      A: 'Incorrect posterior ordering.',
      B: 'Incorrect; decision is computable.',
      C: 'Incorrect; posteriors are unequal.',
      D: 'Incorrect; likelihood contributes strongly.',
      E: 'Incorrect.',
      F: 'Correct.'
    }
  },
  {
    id: 'B5.1',
    exam: 'Exam B (2025)',
    section: 'Section 5 · Bias-Variance',
    title: 'Q5.1 Low-bias high-variance implications',
    prompt: 'Select statements that correctly describe low bias + high variance behavior.',
    type: 'multi',
    points: 3,
    options: [
      { id: 'A', text: 'Model is flexible and can fit training data well' },
      { id: 'B', text: 'Model is strongly underfitting by default' },
      { id: 'C', text: 'Predictions are tightly clustered under resampling' },
      { id: 'D', text: 'Performance fluctuates significantly across training sets' },
      { id: 'E', text: 'Systematic error is high' },
      { id: 'F', text: 'Average prediction remains near true target center' }
    ],
    correct: ['A', 'D', 'F'],
    reasoning:
      'Low bias means small systematic offset, while high variance means sensitivity to sampling noise and unstable fitted models.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Incorrect; high variance is usually linked to overfitting, not underfitting.',
      C: 'Incorrect; high variance implies spread, not tight clustering.',
      D: 'Correct.',
      E: 'Incorrect; that indicates high bias.',
      F: 'Correct low-bias interpretation.'
    }
  },
  {
    id: 'B6.1c',
    exam: 'Exam B (2025)',
    section: 'Section 6 · LDA',
    title: 'Q6.1(c) LDA maximize target',
    prompt: 'In LDA, which quantity should be maximized?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Inter-class distance' },
      { id: 'B', text: 'Intra-class variance' },
      { id: 'C', text: 'Total dimensionality' },
      { id: 'D', text: 'Number of samples' }
    ],
    correct: ['A'],
    reasoning:
      'LDA seeks projections where class means are far apart relative to class spread.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Incorrect; this should be minimized.',
      C: 'Incorrect.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'B6.1d',
    exam: 'Exam B (2025)',
    section: 'Section 6 · LDA',
    title: 'Q6.1(d) LDA minimize target',
    prompt: 'In LDA, which quantity should be minimized?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Inter-class distance' },
      { id: 'B', text: 'Intra-class variance' },
      { id: 'C', text: 'Class count' },
      { id: 'D', text: 'Feature count' }
    ],
    correct: ['B'],
    reasoning:
      'Within-class compactness is needed to keep clusters tight after projection.',
    optionReasoning: {
      A: 'Incorrect. This should be large.',
      B: 'Correct.',
      C: 'Incorrect.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'B6.1e',
    exam: 'Exam B (2025)',
    section: 'Section 6 · LDA',
    title: 'Q6.1(e) LDA goal statement',
    prompt: 'Which statement best describes LDA objective?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Maximize class separation relative to within-class scatter' },
      { id: 'B', text: 'Maximize reconstruction variance only' },
      { id: 'C', text: 'Find nonlinear manifold by default' },
      { id: 'D', text: 'Optimize nearest-neighbor distance directly' }
    ],
    correct: ['A'],
    reasoning:
      'This is exactly Fisher criterion J(w)=w^T S_B w / w^T S_W w.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Incorrect. That is PCA-like framing.',
      C: 'Incorrect. Classical LDA is linear.',
      D: 'Incorrect objective mismatch.'
    }
  },
  {
    id: 'B7.1a',
    exam: 'Exam B (2025)',
    section: 'Section 7 · Optimization',
    title: 'Q7.1(a) Objective in Lagrangian',
    prompt: 'Which objective part enters the Lagrangian?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'Only 3 alpha' },
      { id: 'B', text: 'Only sum phi_i' },
      { id: 'C', text: '3 alpha + sum phi_i' },
      { id: 'D', text: 'Squared penalty of constraints only' }
    ],
    correct: ['C'],
    reasoning:
      'The primal objective transfers unchanged into Lagrangian before adding multiplier-weighted constraints.',
    optionReasoning: {
      A: 'Incomplete objective.',
      B: 'Incomplete objective.',
      C: 'Correct complete objective.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'B7.1b',
    exam: 'Exam B (2025)',
    section: 'Section 7 · Optimization',
    title: 'Q7.1(b) First constraint term',
    prompt: 'Select correct multiplier term for y_i >= alpha^T x_i + alpha_0 + phi_i.',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'sum lambda_i (y_i - alpha^T x_i - alpha_0 - phi_i)' },
      { id: 'B', text: 'sum lambda_i (alpha^T x_i + alpha_0 + phi_i - y_i)^2' },
      { id: 'C', text: 'sum lambda_i (phi_i)' },
      { id: 'D', text: 'sum lambda_i (alpha^T x_i + alpha_0)' }
    ],
    correct: ['A'],
    reasoning:
      'Linear inequality constraints enter Lagrangian linearly via nonnegative multipliers; no square is introduced in classical form.',
    optionReasoning: {
      A: 'Correct equivalent form.',
      B: 'Incorrect penalty-method term, not Lagrangian form.',
      C: 'Incorrect: this corresponds to different constraint.',
      D: 'Incomplete expression.'
    }
  },
  {
    id: 'B7.1c',
    exam: 'Exam B (2025)',
    section: 'Section 7 · Optimization',
    title: 'Q7.1(c) Second constraint term',
    prompt: 'For phi_i <= 0 with mu_i>=0, which term is correct?',
    type: 'single',
    points: 1,
    options: [
      { id: 'A', text: 'sum mu_i phi_i' },
      { id: 'B', text: 'sum mu_i (-phi_i)' },
      { id: 'C', text: 'sum mu_i phi_i^2' },
      { id: 'D', text: 'sum mu_i (phi_i + 1)' }
    ],
    correct: ['A'],
    reasoning:
      'Given fi(x)=phi_i <=0, L includes +mu_i fi(x)=+mu_i phi_i.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Incorrect sign for chosen standard form.',
      C: 'Incorrect nonstandard quadratic penalty.',
      D: 'Incorrect altered constraint.'
    }
  },
  {
    id: 'B7.1d',
    exam: 'Exam B (2025)',
    section: 'Section 7 · Optimization',
    title: 'Q7.1(d) Dual function and weak duality',
    prompt: 'Select all correct statements.',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'g(lambda,mu)=inf_x L(x,lambda,mu)' },
      { id: 'B', text: 'Dual objective is convex in (lambda,mu)' },
      { id: 'C', text: 'For feasible lambda,mu>=0, g is lower bound on primal optimum' },
      { id: 'D', text: 'Weak duality: d* >= p*' },
      { id: 'E', text: 'Dual problem minimizes g' },
      { id: 'F', text: 'Duality gap p* - d* >= 0' }
    ],
    correct: ['A', 'B', 'C', 'F'],
    reasoning:
      'Dual function is pointwise infimum of affine functions and gives lower bounds; dual seeks best (largest) such lower bound.',
    optionReasoning: {
      A: 'Correct definition.',
      B: 'Correct as reflected in the exam key framing.',
      C: 'Correct weak-duality consequence.',
      D: 'Incorrect inequality direction.',
      E: 'Incorrect; dual maximizes g under constraints.',
      F: 'Correct nonnegative gap statement.'
    }
  },
  {
    id: 'B7.1e',
    exam: 'Exam B (2025)',
    section: 'Section 7 · Optimization',
    title: 'Q7.1(e) KKT conditions',
    prompt: 'Which are part of KKT?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Primal feasibility' },
      { id: 'B', text: 'sum lambda_i = 1' },
      { id: 'C', text: 'Dual feasibility lambda_i >= 0' },
      { id: 'D', text: 'Complementary slackness lambda_i f_i(x)=0' },
      { id: 'E', text: 'Hessian of L must be positive definite' },
      { id: 'F', text: 'Stationarity gradient_x L = 0' }
    ],
    correct: ['A', 'C', 'D', 'F'],
    reasoning:
      'KKT is a four-block condition set: primal feasibility, dual feasibility, complementary slackness, stationarity.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Incorrect not a general KKT requirement.',
      C: 'Correct.',
      D: 'Correct.',
      E: 'Incorrect not required.',
      F: 'Correct.'
    }
  },
  {
    id: 'B7.1f',
    exam: 'Exam B (2025)',
    section: 'Section 7 · Optimization',
    title: 'Q7.1(f) Strong duality and Slater',
    prompt: 'Select correct statements.',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Convex + Slater implies p*=d*' },
      { id: 'B', text: 'Slater requires strict feasibility for equality constraints too' },
      { id: 'C', text: 'In nonconvex problems, strong duality can fail' },
      { id: 'D', text: 'If strong duality holds in convex setting, KKT is necessary and sufficient' },
      { id: 'E', text: 'Convexity alone guarantees strong duality without qualification' },
      { id: 'F', text: 'Strong duality implies unique primal optimizer' }
    ],
    correct: ['A', 'C', 'D'],
    reasoning:
      'Strong duality concerns optimal objective equality, while uniqueness is separate. Constraint qualifications such as Slater are key in convex programs.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Incorrect. Equality constraints are treated separately (typically affine).',
      C: 'Correct.',
      D: 'Correct under standard assumptions.',
      E: 'Incorrect; qualification is often needed.',
      F: 'Incorrect. Multiple primal optimizers may exist.'
    }
  },
  {
    id: 'B8.1a',
    exam: 'Exam B (2025)',
    section: 'Section 8 · SVM',
    title: 'Q8.1(a) Hyperplane and support vectors',
    prompt: 'Which statements are correct?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Hyperplane is uniquely determined by support vectors' },
      { id: 'B', text: 'SVM maximizes margin' },
      { id: 'C', text: 'All training points equally determine hyperplane' },
      { id: 'D', text: 'Only support vectors determine hyperplane' },
      { id: 'E', text: 'Weight vector is orthogonal to hyperplane' },
      { id: 'F', text: 'Margin width is 2/||w||' }
    ],
    correct: ['A', 'B', 'D', 'E', 'F'],
    reasoning:
      'The SVM optimum is controlled by active margin constraints (support vectors), and geometric margin is inverse to weight norm.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Correct.',
      C: 'Incorrect. Non-support vectors do not affect optimum once inactive.',
      D: 'Correct.',
      E: 'Correct.',
      F: 'Correct.'
    }
  },
  {
    id: 'B8.1b',
    exam: 'Exam B (2025)',
    section: 'Section 8 · SVM',
    title: 'Q8.1(b) Soft-margin penalty',
    prompt: 'Which loss is used in soft-margin SVM formulation?',
    type: 'single',
    points: 2,
    options: [
      { id: 'A', text: 'Absolute loss' },
      { id: 'B', text: 'Quadratic loss' },
      { id: 'C', text: 'Hinge loss' },
      { id: 'D', text: 'Cross-entropy' },
      { id: 'E', text: 'Exponential loss' },
      { id: 'F', text: 'Deadzone loss' }
    ],
    correct: ['C'],
    reasoning:
      'Soft-margin primal uses hinge penalties on margin violations, combining classification margin and regularization.',
    optionReasoning: {
      A: 'Incorrect.',
      B: 'Incorrect for standard soft-margin SVM.',
      C: 'Correct.',
      D: 'Incorrect logistic-family objective.',
      E: 'Incorrect (boosting-related).',
      F: 'Incorrect.'
    }
  },
  {
    id: 'B8.1c',
    exam: 'Exam B (2025)',
    section: 'Section 8 · SVM',
    title: 'Q8.1(c) Nonlinear separation',
    prompt: 'How can SVM handle nonlinearly separable classes?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Introduce kernel functions' },
      { id: 'B', text: 'Only feature scaling is sufficient' },
      { id: 'C', text: 'Use kernel trick with implicit high-dimensional mapping' },
      { id: 'D', text: 'Randomize decision boundary' },
      { id: 'E', text: 'Use polynomial or RBF kernels' },
      { id: 'F', text: 'Remove support vectors' }
    ],
    correct: ['A', 'C', 'E'],
    reasoning:
      'Kernelization keeps optimization in dual inner-product form while representing nonlinear boundaries in input space.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Incorrect. Scaling helps numerics but not general nonlinearity.',
      C: 'Correct.',
      D: 'Incorrect.',
      E: 'Correct common kernel families.',
      F: 'Incorrect; support vectors are essential.'
    }
  },
  {
    id: 'B8.1d',
    exam: 'Exam B (2025)',
    section: 'Section 8 · SVM',
    title: 'Q8.1(d) Slack variables',
    prompt: 'Which statements about slack variables are correct?',
    type: 'multi',
    points: 2,
    options: [
      { id: 'A', text: 'Called slack variables' },
      { id: 'B', text: 'Measure degree of margin violation' },
      { id: 'C', text: 'Enable soft margin violations' },
      { id: 'D', text: 'Guarantee linear separability' },
      { id: 'E', text: 'Penalized in objective by C * sum xi_i' },
      { id: 'F', text: 'Reduce feature-space dimensionality' }
    ],
    correct: ['A', 'B', 'C', 'E'],
    reasoning:
      'Slack variables relax hard constraints and trade off violations against margin via regularization parameter C.',
    optionReasoning: {
      A: 'Correct.',
      B: 'Correct.',
      C: 'Correct.',
      D: 'Incorrect.',
      E: 'Correct.',
      F: 'Incorrect.'
    }
  }
]

const currentIndex = ref(0)
const selected = ref<Record<string, string[]>>({})
const submitted = ref<Record<string, boolean>>({})

const current = computed(() => questions[currentIndex.value])
const isFinished = computed(() => currentIndex.value >= questions.length)

const gradableQuestions = computed(() => questions.filter((q) => q.gradable !== false))
const maxScore = computed(() => gradableQuestions.value.reduce((sum, q) => sum + q.points, 0))

const scoreByQuestion = computed(() => {
  const map: Record<string, number> = {}
  for (const q of questions) {
    if (!submitted.value[q.id] || q.gradable === false) {
      map[q.id] = 0
      continue
    }
    map[q.id] = isCorrect(q) ? q.points : 0
  }
  return map
})

const totalScore = computed(() => Object.values(scoreByQuestion.value).reduce((a, b) => a + b, 0))
const correctCount = computed(
  () => gradableQuestions.value.filter((q) => submitted.value[q.id] && isCorrect(q)).length
)
const gradableCount = computed(() => gradableQuestions.value.length)
const percentage = computed(() => {
  if (maxScore.value === 0) {
    return 0
  }
  return Math.round((totalScore.value / maxScore.value) * 100)
})

function normalize(values: string[]) {
  return [...new Set(values)].sort()
}

function isSelected(questionId: string, optionId: string) {
  return (selected.value[questionId] || []).includes(optionId)
}

function hasSelection(questionId: string) {
  return (selected.value[questionId] || []).length > 0
}

function onSelect(questionId: string, optionId: string, type: 'single' | 'multi') {
  if (submitted.value[questionId]) {
    return
  }
  const existing = selected.value[questionId] || []
  if (type === 'single') {
    selected.value[questionId] = [optionId]
    return
  }
  if (existing.includes(optionId)) {
    selected.value[questionId] = existing.filter((id) => id !== optionId)
  } else {
    selected.value[questionId] = [...existing, optionId]
  }
}

function submitCurrent() {
  const q = current.value
  if (!hasSelection(q.id)) {
    return
  }
  submitted.value[q.id] = true
}

function nextQuestion() {
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value += 1
    return
  }
  currentIndex.value += 1
}

function isCorrect(q: QuizQuestion) {
  const a = normalize(selected.value[q.id] || [])
  const b = normalize(q.correct)
  return a.length === b.length && a.every((value, i) => value === b[i])
}

function optionState(optionId: string) {
  const q = current.value
  if (!submitted.value[q.id]) {
    return ''
  }
  const isRight = q.correct.includes(optionId)
  const picked = isSelected(q.id, optionId)
  if (isRight && picked) {
    return 'is-right-picked'
  }
  if (isRight && !picked) {
    return 'is-right-missed'
  }
  if (!isRight && picked) {
    return 'is-wrong-picked'
  }
  return ''
}

function resetQuiz() {
  currentIndex.value = 0
  selected.value = {}
  submitted.value = {}
}
</script>

<style scoped>
.quiz-wrap {
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 20px;
  background: linear-gradient(145deg, #fffef9 0%, #fff 100%);
}

.quiz-header h2 {
  margin: 0;
}

.quiz-header .progress {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.quiz-card,
.result-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px;
  background: #ffffff;
}

.meta {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin: 0 0 8px;
}

.prompt {
  margin-top: 8px;
}

.options {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.option {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.option input {
  margin-top: 3px;
}

.actions {
  margin-top: 14px;
}

.btn {
  background: var(--vp-c-brand-1);
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.feedback {
  margin-top: 14px;
  border-top: 1px dashed var(--vp-c-divider);
  padding-top: 14px;
}

.ok {
  color: #157347;
}

.no {
  color: #a61e4d;
}

.correct-answer,
.reasoning-text {
  margin: 8px 0;
}

.reasoning-list {
  margin: 8px 0 0;
  padding-left: 18px;
}

.is-right-picked {
  border-color: #198754;
  background: #edf9f0;
}

.is-right-missed {
  border-color: #198754;
  background: #f7fff9;
}

.is-wrong-picked {
  border-color: #d63384;
  background: #fff4f8;
}

.summary {
  color: var(--vp-c-text-2);
}
</style>
