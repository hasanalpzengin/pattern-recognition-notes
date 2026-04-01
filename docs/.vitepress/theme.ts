import { EnhanceAppContext } from 'vitepress'
import PlotlyChart from '../../components/PlotlyChart.vue'
import LDAVisualizer from '../../components/LDAVisualizer.vue'
import SVMVisualizer from '../../components/SVMVisualizer.vue'
import KernelVisualizer from '../../components/KernelVisualizer.vue'
import OptimizationVisualizer from '../../components/OptimizationVisualizer.vue'
import EMVisualizer from '../../components/EMVisualizer.vue'

export default {
  enhance({ app }: EnhanceAppContext) {
    app.component('PlotlyChart', PlotlyChart)
    app.component('LDAVisualizer', LDAVisualizer)
    app.component('SVMVisualizer', SVMVisualizer)
    app.component('KernelVisualizer', KernelVisualizer)
    app.component('OptimizationVisualizer', OptimizationVisualizer)
    app.component('EMVisualizer', EMVisualizer)
  }
}
