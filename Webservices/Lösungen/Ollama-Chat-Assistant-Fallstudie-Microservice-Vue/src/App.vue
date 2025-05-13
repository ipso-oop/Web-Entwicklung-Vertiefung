<template>
  <div class="app">
    <div class="sidebar">
      <ModelSelector 
        :current-model="currentModel" 
        @update:model="currentModel = $event" 
      />
      <FileUpload 
        :uploaded-files="uploadedFiles"
        @file-upload="handleFileUpload"
        @remove-file="handleRemoveFile"
      />
    </div>
    <div class="main-content">
      <ChatInterface 
        :messages="messages"
        @send-message="handleSendMessage"
        :messages-end-ref="messagesEndRef"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import ChatInterface from './components/ChatInterface.vue'
import FileUpload from './components/FileUpload.vue'
import ModelSelector from './components/ModelSelector.vue'
import './App.css'

const API_BASE_URL = 'http://localhost:3000'

export default {
  name: 'App',
  components: {
    ChatInterface,
    FileUpload,
    ModelSelector
  },
  setup() {
    const currentModel = ref('local')
    const uploadedFiles = ref(new Map())
    const messages = ref([])
    const messagesEndRef = ref(null)

    const scrollToBottom = () => {
      messagesEndRef.value?.scrollIntoView({ behavior: "smooth" })
    }

    const loadChatHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/history/load`)
        if (response.ok) {
          const data = await response.json()
          messages.value = data.history
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }

    const saveMessageToHistory = async (role, content) => {
      try {
        await fetch(`${API_BASE_URL}/api/history/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role, content }),
        })
      } catch (error) {
        console.error('Error saving message to history:', error)
      }
    }

    const handleSendMessage = async (prompt) => {
      if (!prompt.trim()) return

      // Add user message
      const userMessage = { role: 'user', content: prompt }
      messages.value.push(userMessage)
      await saveMessageToHistory('user', prompt)

      // Add loading message
      const loadingMessage = { role: 'bot', content: 'Thinking...', loading: true }
      messages.value.push(loadingMessage)

      try {
        const fileIds = Array.from(uploadedFiles.value.keys())
        const response = await fetch(`${API_BASE_URL}/api/chat/${currentModel.value}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt,
            fileIds
          }),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        
        // Replace loading message with actual response
        messages.value[messages.value.length - 1] = { role: 'bot', content: data.response }
        await saveMessageToHistory('bot', data.response)
      } catch (error) {
        messages.value[messages.value.length - 1] = { 
          role: 'bot', 
          content: 'Sorry, I encountered an error while processing your request. Please try again.' 
        }
        console.error('Error:', error)
      }
    }

    const handleFileUpload = async (files) => {
      const formData = new FormData()
      for (const file of files) {
        formData.append('files', file)
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const result = await response.json()
        const newFiles = new Map(uploadedFiles.value)
        result.files.forEach(file => {
          newFiles.set(file.id, file)
        })
        uploadedFiles.value = newFiles
      } catch (error) {
        console.error('Error uploading files:', error)
        alert('Failed to upload files. Please try again.')
      }
    }

    const handleRemoveFile = async (fileId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete file')
        }

        const newFiles = new Map(uploadedFiles.value)
        newFiles.delete(fileId)
        uploadedFiles.value = newFiles
      } catch (error) {
        console.error('Error removing file:', error)
        alert('Failed to remove file. Please try again.')
      }
    }

    onMounted(() => {
      loadChatHistory()
    })

    watch(messages, () => {
      scrollToBottom()
    })

    return {
      currentModel,
      uploadedFiles,
      messages,
      messagesEndRef,
      handleSendMessage,
      handleFileUpload,
      handleRemoveFile
    }
  }
}
</script>

<style>
.app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 300px;
  padding: 20px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style> 