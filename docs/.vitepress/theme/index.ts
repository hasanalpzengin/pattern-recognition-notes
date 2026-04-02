import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './style.css'
import PlotlyChart from '../../components/PlotlyChart.vue'
import LDAVisualizer from '../../components/LDAVisualizer.vue'
import SVMVisualizer from '../../components/SVMVisualizer.vue'
import KernelVisualizer from '../../components/KernelVisualizer.vue'
import OptimizationVisualizer from '../../components/OptimizationVisualizer.vue'
import EMVisualizer from '../../components/EMVisualizer.vue'
import InteractiveDemo from '../../components/InteractiveDemo.vue'
import LogisticRegressionVisualizer from '../../components/LogisticRegressionVisualizer.vue'
import EvaluationMetricsVisualizer from '../../components/EvaluationMetricsVisualizer.vue'
import BiasVarianceVisualizer from '../../components/BiasVarianceVisualizer.vue'
import MockExamQuiz from '../../components/MockExamQuiz.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {})
  },
  enhanceApp({ app }) {
    app.component('PlotlyChart', PlotlyChart)
    app.component('LDAVisualizer', LDAVisualizer)
    app.component('SVMVisualizer', SVMVisualizer)
    app.component('KernelVisualizer', KernelVisualizer)
    app.component('OptimizationVisualizer', OptimizationVisualizer)
    app.component('EMVisualizer', EMVisualizer)
    app.component('InteractiveDemo', InteractiveDemo)
    app.component('LogisticRegressionVisualizer', LogisticRegressionVisualizer)
    app.component('EvaluationMetricsVisualizer', EvaluationMetricsVisualizer)
    app.component('BiasVarianceVisualizer', BiasVarianceVisualizer)
    app.component('MockExamQuiz', MockExamQuiz)
  }
}
