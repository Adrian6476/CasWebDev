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
        @keydown.enter.prevent="handleEnter"
      />
      <button :disabled="loading || !inputMessage.trim()" class="send-button" @click="sendMessage">
        {{ $t('aiSupport.send') || 'Send' }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { aiApi } from '@/api/ai'

  const { t, locale } = useI18n()

  const messages = ref([])

  // Initialize and watch for language changes
  watch(
    locale,
    () => {
      // Only update if the message list is empty (initialization) or has only one welcome message
      if (
        messages.value.length === 0 ||
        (messages.value.length === 1 && messages.value[0].role === 'assistant')
      ) {
        messages.value = [
          {
            role: 'assistant',
            content: t('aiSupport.welcomeMessage')
          }
        ]
      }
    },
    { immediate: true }
  )
  const inputMessage = ref('')
  const loading = ref(false)
  const messagesContainer = ref(null)

  // Automatically scroll to the bottom
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
    if (e.shiftKey) return // Shift + Enter for new line
    sendMessage()
  }

  const sendMessage = async () => {
    const userMessage = inputMessage.value.trim()
    if (!userMessage || loading.value) return

    try {
      loading.value = true
      // Add user message
      messages.value.push({
        role: 'user',
        content: userMessage
      })
      inputMessage.value = ''

      // Send to AI API
      const response = await aiApi.sendMessage([...messages.value], locale.value)

      // Add AI response
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
    height: 100%;
    background: rgb(var(--v-theme-surface));
    border-radius: 8px;
    border: 1px solid rgb(var(--v-theme-outline));
    position: relative;
    color: rgb(var(--v-theme-on-surface));
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px 20px 76px 20px; /* 调整底部内边距，适应新的输入框高度 */
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
    font-size: 15px;
    line-height: 1.5;
  }

  .message-user .message-content {
    background: rgb(var(--v-theme-surface-variant));
    color: rgb(var(--v-theme-on-surface-variant));
  }

  .message-assistant .message-content {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
  }

  .chat-input {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgb(var(--v-theme-surface-container));
    border-top: 1px solid rgb(var(--v-theme-outline));
    padding: 12px 16px;
    display: flex;
    gap: 12px;
    box-sizing: border-box;
    box-shadow: 0 -2px 10px rgba(var(--v-theme-on-surface), 0.05);
    min-height: 64px; /* 设置最小高度，与按钮保持一致 */
  }

  .chat-input textarea {
    flex: 1;
    border: 1px solid rgb(var(--v-theme-outline));
    border-radius: 4px;
    padding: 8px 12px;
    resize: none;
    font-size: 14px;
    line-height: 20px;
    min-height: 40px; /* 设置与按钮一致的高度 */
    height: 40px; /* 初始高度 */
    background: rgb(var(--v-theme-surface-container-lowest));
    color: rgb(var(--v-theme-on-surface));
  }

  .chat-input textarea:focus {
    outline: none;
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.25);
  }

  .chat-input .send-button {
    height: 40px; /* 与输入框相同高度 */
    min-width: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-input .send-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 96px;
    height: 40px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    color: rgb(var(--v-theme-on-primary));
    background-color: rgb(var(--v-theme-primary));
    border: none;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: capitalize;
  }

  .chat-input .send-button:hover:not(:disabled) {
    background-color: rgb(var(--v-theme-primary-darken-1));
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .chat-input .send-button:disabled {
    background-color: rgb(var(--v-theme-outline));
    color: rgb(var(--v-theme-on-surface-disabled));
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.7;
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

  /* 移动端适配 */
  @media (max-width: 600px) {
    .chat-input {
      padding: 8px 12px;
      padding-bottom: max(8px, env(safe-area-inset-bottom));
    }

    .chat-input textarea {
      font-size: 16px; /* 避免 iOS 自动缩放 */
    }

    .chat-messages {
      padding: 16px 16px 68px 16px;
    }

    .message-content {
      max-width: 85%;
      padding: 10px;
    }
  }
</style>
