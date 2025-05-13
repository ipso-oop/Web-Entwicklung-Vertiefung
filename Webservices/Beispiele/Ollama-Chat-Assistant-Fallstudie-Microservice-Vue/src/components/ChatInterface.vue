<template>
  <div class="chat-interface">
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <div class="message-content">
          {{ message.content }}
          <div v-if="message.loading" class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div ref="messagesEndRef"></div>
    </div>
    <div class="input-area">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Type your message..."
        :disabled="isLoading"
      />
      <button @click="sendMessage" :disabled="isLoading || !newMessage.trim()">
        Send
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ChatInterface',
  props: {
    messages: {
      type: Array,
      required: true
    },
    messagesEndRef: {
      type: Object,
      required: true
    }
  },
  emits: ['send-message'],
  setup(props, { emit }) {
    const newMessage = ref('')
    const isLoading = computed(() => {
      return props.messages.some(msg => msg.loading)
    })

    const sendMessage = () => {
      if (newMessage.value.trim() && !isLoading.value) {
        emit('send-message', newMessage.value)
        newMessage.value = ''
      }
    }

    return {
      newMessage,
      isLoading,
      sendMessage
    }
  }
}
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 20px;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
}

.message.bot {
  margin-right: auto;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #f0f0f0;
}

.message.user .message-content {
  background-color: #007bff;
  color: white;
}

.input-area {
  display: flex;
  padding: 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.loading-dots {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background-color: #666;
  border-radius: 50%;
  animation: loading 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {
  0%, 80%, 100% { 
    transform: scale(0);
  }
  40% { 
    transform: scale(1.0);
  }
}
</style> 