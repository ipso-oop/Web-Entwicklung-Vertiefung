<template>
  <div class="model-selector">
    <h3>Select Model</h3>
    <div class="model-options">
      <label v-for="model in models" :key="model.value" class="model-option">
        <input
          type="radio"
          :value="model.value"
          v-model="selectedModel"
          @change="updateModel"
        />
        {{ model.label }}
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

interface Model {
  value: string
  label: string
}

export default defineComponent({
  name: 'ModelSelector',
  props: {
    currentModel: {
      type: String,
      required: true
    }
  },
  emits: ['update:model'],
  setup(props, { emit }) {
    const models: Model[] = [
      { value: 'local', label: 'Local Model' },
      { value: 'ollama', label: 'Ollama Model' }
    ]
    const selectedModel = ref<string>(props.currentModel)

    watch(() => props.currentModel, (newValue) => {
      selectedModel.value = newValue
    })

    const updateModel = () => {
      emit('update:model', selectedModel.value)
    }

    return {
      models,
      selectedModel,
      updateModel
    }
  }
})
</script>

<style scoped>
.model-selector {
  margin-bottom: 20px;
}

.model-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.model-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.model-option input[type="radio"] {
  margin: 0;
}
</style> 