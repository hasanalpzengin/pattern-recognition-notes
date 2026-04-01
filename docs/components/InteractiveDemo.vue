<template>
  <div class="interactive-demo-container">
    <div v-if="title" class="demo-title">{{ title }}</div>
    <div v-if="description" class="demo-description">{{ description }}</div>
    
    <div class="controls-section" v-if="controls && Object.keys(controls).length > 0">
      <div class="control-group">
        <div v-for="(control, key) in controls" :key="key" class="control-item">
          <label :for="`control-${key}`" class="control-label">
            {{ control.label }}
          </label>
          
          <!-- Number Input -->
          <input 
            v-if="control.type === 'number'"
            :id="`control-${key}`"
            v-model.number="controlValues[key]"
            type="number"
            :min="control.min"
            :max="control.max"
            :step="control.step"
            class="control-input"
          />
          
          <!-- Range Slider -->
          <div v-else-if="control.type === 'slider'" class="slider-wrapper">
            <input 
              :id="`control-${key}`"
              v-model.number="controlValues[key]"
              type="range"
              :min="control.min"
              :max="control.max"
              :step="control.step"
              class="control-slider"
            />
            <span class="slider-value">
              {{ (controlValues[key] ?? 0).toFixed(2) }}
              <span v-if="control.unit">{{ control.unit }}</span>
            </span>
          </div>
          
          <!-- Dropdown Select -->
          <select 
            v-else-if="control.type === 'select'"
            :id="`control-${key}`"
            v-model="controlValues[key]"
            class="control-select"
          >
            <option 
              v-for="option in control.options" 
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="demo-output">
      <div :id="`demo-chart-${componentId}`" class="demo-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'

interface ControlConfig {
  type: 'number' | 'slider' | 'select'
  label: string
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: any[]
  default?: number | string
}

interface Props {
  title?: string
  description?: string
  controls?: Record<string, ControlConfig>
  generator?: (values: Record<string, any>) => any
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  controls: () => ({})
})

const componentId = ref(Math.random().toString(36).substr(2, 9))
const controlValues = ref<Record<string, any>>({})

// Initialize control values
const initializeControls = () => {
  if (props.controls) {
    Object.entries(props.controls).forEach(([key, config]) => {
      if (config.type === 'slider') {
        controlValues.value[key] = config.default ?? ((config.min ?? 0) + (config.max ?? 100)) / 2
      } else if (config.type === 'number') {
        controlValues.value[key] = config.default ?? (config.min ?? 0)
      } else if (config.type === 'select') {
        controlValues.value[key] = config.default ?? (config.options?.[0] ?? '')
      }
    })
  }
}

const generateDemo = async () => {
  if (props.generator && typeof props.generator === 'function') {
    try {
      const result = props.generator(controlValues.value)
      
      // Wait for DOM to be ready
      await nextTick()
      
      // If result has data and layout (Plotly format), render it
      if (result && result.data && result.layout) {
        const element = document.getElementById(`demo-chart-${componentId.value}`)
        if (element && window.Plotly) {
          window.Plotly.newPlot(element, result.data, result.layout, { responsive: true })
        }
      }
    } catch (error) {
      console.error('Error in demo generator:', error)
    }
  }
}

watch(() => controlValues.value, generateDemo, { deep: true })

onMounted(() => {
  initializeControls()
  generateDemo()
})
</script>

<style scoped>
.interactive-demo-container {
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.demo-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.demo-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.controls-section {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 4px;
}

.control-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.control-label {
  font-weight: 500;
  color: #333;
  min-width: 120px;
}

.control-input,
.control-select {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  min-width: 100px;
}

.control-input:focus,
.control-select:focus {
  outline: none;
  border-color: #4ECDC4;
  box-shadow: 0 0 4px rgba(78, 205, 196, 0.3);
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-slider {
  min-width: 150px;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.control-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4ECDC4;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.control-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4ECDC4;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-value {
  min-width: 60px;
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.demo-output {
  min-height: 300px;
  padding: 15px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.demo-content {
  width: 100%;
  min-height: 280px;
}

@media (max-width: 768px) {
  .control-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .control-item {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .control-label {
    min-width: auto;
  }

  .demo-output {
    min-height: 250px;
  }
}
</style>
