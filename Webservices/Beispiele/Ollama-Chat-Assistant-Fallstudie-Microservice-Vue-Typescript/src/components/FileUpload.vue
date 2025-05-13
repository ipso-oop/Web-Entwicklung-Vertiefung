<template>
  <div class="file-upload">
    <h3>Uploaded Files</h3>
    <div class="upload-area">
      <input
        type="file"
        multiple
        @change="handleFileSelect"
        ref="fileInput"
        style="display: none"
      />
      <button @click="triggerFileInput" class="upload-button">
        Choose Files
      </button>
    </div>
    <div class="file-list">
      <div v-for="[id, file] in uploadedFiles" :key="id" class="file-item">
        <span class="file-name">{{ file.name }}</span>
        <button @click="removeFile(id)" class="remove-button">×</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'

interface File {
  id: string
  name: string
  size: number
  type: string
}

export default defineComponent({
  name: 'FileUpload',
  props: {
    uploadedFiles: {
      type: Object as PropType<Map<string, File>>,
      required: true
    }
  },
  emits: ['file-upload', 'remove-file'],
  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null)

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = (event: Event) => {
      const target = event.target as HTMLInputElement
      const files = target.files
      if (files && files.length > 0) {
        emit('file-upload', files)
        target.value = '' // Reset input
      }
    }

    const removeFile = (fileId: string) => {
      emit('remove-file', fileId)
    }

    return {
      fileInput,
      triggerFileInput,
      handleFileSelect,
      removeFile
    }
  }
})
</script>

<style scoped>
.file-upload {
  margin-top: 20px;
}

.upload-area {
  margin: 10px 0;
  padding: 20px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  text-align: center;
}

.upload-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.file-list {
  margin-top: 10px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 5px;
}

.file-name {
  flex: 1;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-button {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
}

.remove-button:hover {
  color: #c82333;
}
</style> 