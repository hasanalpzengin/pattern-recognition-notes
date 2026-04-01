<template>
  <div class="interactive-demo">
    <h4>{{ title }}</h4>
    
    <div class="demo-controls">
      <div v-for="(control, key) in controls" :key="key" class="control-group">
        <label v-if="control.label" :for="key">{{ control.label }}</label>
        
        <input
          v-if="control.type === 'slider'"
          :id="key"
          v-model.number="values[key]"
          type="range"
          :min="control.min"
          :max="control.max"
          :step="control.step || 0.1"
          @input="updateVisualization"
        />
        
        <input
          v-else-if="control.type === 'number'"
          :id="key"
          v-model.number="values[key]"
          type="number"
          :min="control.min"
          :max="control.max"
          :step="control.step || 1"
          @change="updateVisualization"
        />
        
        <select
          v-else-if="control.type === 'select'"
          :id="key"
          v-model="values[key]"
          @change="updateVisualization"
        >
          <option v-for="option in control.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        
        <button
          v-else-if="control.type === 'button'"
          @click="handleButtonClick(key, control)"
        >
          {{ control.label || key }}
        </button>

        <span v-if="control.type === 'slider' && control.unit" class="control-value">
          {{ values[key] }}{{ control.unit }}
        </span>
      </div>
    </div>

    <div :id="chartId" class="chart-wrapper" :style="{ height: '400px' }"></div>

    <div v-if="output" class="demo-output">
      <strong>Output:</strong>
      <pre>{{ output }}</pre>
    </div>

    <p v-if="description" class="demo-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

interface Control {
  type: 'slider' | 'number' | 'select' | 'button'
  label?: string
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: any[]
  callback?: (values: any) => void
}

interface Props {
  title: string
  controls: Record<string, Control>
  generator: (values: any) => any
  description?: string
}

const props = defineProps<Props>()

const values = reactive(
  Object.fromEntries(
    Object.entries(props.controls).map(([key, control]) => [
      key,
      control.type === 'select' ? control.options?.[0] : control.min || 0
    ])
  )
)

const chartId = computed(() => `demo-chart-${Math.random().toString(36).substr(2, 9)}`)
const output = ref<string>('')

const updateVisualization = () => {
  if (window.Plotly) {
    const result = props.generator(values)
    
    if (result.data && result.layout) {
      window.Plotly.react(chartId.value, result.data, result.layout, {
        responsive: true,
        displayModeBar: true
      })
    }
    
    if (result.output) {
      output.value = result.output
    }
  }
}

const handleButtonClick = (key: string, control: Control) => {
  if (control.callback) {
    control.callback(values)
  }
  updateVisualization()
}

onMounted(() => {
  if (window.Plotly) {
    setTimeout(() => {
      updateVisualization()
    }, 100)
  }
})
</script>

<style scoped>
.interactive-demo {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-brand);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.interactive-demo h4 {
  margin-top: 0;
  color: var(--vp-c-brand);
}

.demo-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.control-group input[type='range'],
.control-group input[type='number'],
.control-group select {
  padding: 0.6rem 0.8rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  cursor: pointer;
}

.control-group input[type='range'] {
  width: 200px;
  cursor: pointer;
}

.control-group button {
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  border: none;
  background: var(--vp-c-brand);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.control-group button:hover {
  background: var(--vp-c-brand-dark);
}

.control-value {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.chart-wrapper {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}

.dark .chart-wrapper {
  background: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.demo-output {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  overflow-x: auto;
}

.demo-output pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.demo-description {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}

@media (max-width: 768px) {
  .demo-controls {
    flex-direction: column;
  }

  .control-group input[type='range'] {
    width: 100%;
  }

  .control-group input,
  .control-group select,
  .control-group button {
    width: 100%;
  }
}
</style>
