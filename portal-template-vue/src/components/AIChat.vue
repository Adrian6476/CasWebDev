<template>
  <div class="ai-chat">
    <div ref="messagesContainer" class="chat-messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role === 'user' ? 'message-user' : 'message-assistant']"
      >
        <div class="message-content">
          {{ message.content }}
        </div>
      </div>
      <div v-if="loading" class="message message-assistant">
        <div class="message-content">
          <span class="loading-dots">{{ $t('aiSupport.thinking') }}</span>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <textarea
        v-model="inputMessage"
        :disabled="loading"
        :placeholder="$t('aiSupport.placeholder')"
        rows="3"
        @keydown.enter.prevent="handleEnter"
      />
      <button :disabled="loading || !inputMessage.trim()" @click="sendMessage">
        {{ $t('aiSupport.send') }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { aiApi } from '@/api/ai'

  const { t } = useI18n()

  const messages = ref([
    {
      role: 'assistant',
      content: t('aiSupport.welcomeMessage')
    }
  ])
  const inputMessage = ref('')
  const loading = ref(false)
  const messagesContainer = ref(null)

  // 自动滚动到底部
  watch(
    messages,
    () => {
      setTimeout(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      }, 100)
    },
    { deep: true }
  )

  const handleEnter = e => {
    if (e.shiftKey) return // Shift + Enter 换行
    sendMessage()
  }

  const sendMessage = async () => {
    const userMessage = inputMessage.value.trim()
    if (!userMessage || loading.value) return

    try {
      loading.value = true
      // 添加用户消息
      messages.value.push({
        role: 'user',
        content: userMessage
      })
      inputMessage.value = ''

      // 发送到 AI API
      const response = await aiApi.sendMessage([...messages.value])

      // 添加 AI 回复
      messages.value.push({
        role: response.role,
        content: response.content
      })
    } catch (error) {
      messages.value.push({
        role: 'assistant',
        content: t('aiSupport.errorMessage') + error.message
      })
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  .ai-chat {
    display: flex;
    flex-direction: column;
    height: 600px;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    overflow: hidden;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  .message {
    margin-bottom: 12px;
    display: flex;
  }

  .message-user {
    justify-content: flex-end;
  }

  .message-content {
    max-width: 80%;
    padding: 12px;
    border-radius: 8px;
    word-break: break-word;
  }

  .message-user .message-content {
    background: #007bff;
    color: white;
  }

  .message-assistant .message-content {
    background: #f5f5f5;
    color: #333;
  }

  .chat-input {
    border-top: 1px solid #e0e0e0;
    padding: 16px;
    display: flex;
    gap: 12px;
  }

  .chat-input textarea {
    flex: 1;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 8px;
    resize: none;
    font-size: 14px;
  }

  .chat-input button {
    padding: 8px 24px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .chat-input button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  .loading-dots::after {
    content: '...';
    animation: loading 1.5s infinite;
    display: inline-block;
    width: 12px;
  }

  @keyframes loading {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
</style>
