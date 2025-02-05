<template>
  <div class="floating-chat">
    <div
      v-if="false"
      style="
        position: fixed;
        top: 0;
        right: 0;
        background: red;
        color: white;
        padding: 10px;
        z-index: 99999;
      "
    >
      Debug: {{ chatStore.isOpen }}
    </div>
    <!-- 聊天窗口 -->
    <v-card v-show="chatStore.isOpen" class="chat-window">
      <v-card-title class="chat-header">
        <span>{{ $t('aiSupport.title') }}</span>
        <v-btn icon size="small" :aria-label="$t('common.close')" @click="chatStore.closeChat">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="chat-container pa-0">
        <AIChat ref="chatComponent" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import AIChat from './AIChat.vue'
  import { useChatStore } from '@/store/chat'

  const chatComponent = ref(null)
  const chatStore = useChatStore()

  // Debugging: Watch state changes
  watch(
    () => chatStore.isOpen,
    newVal => {
      console.log('Chat state changed:', newVal)
    }
  )
</script>

<style scoped>
  .floating-chat {
    position: fixed;
    bottom: 32px; /* 增加底部间距 */
    right: 24px;
    z-index: 99999; /* 提高优先级 */
    pointer-events: auto; /* 确保可交互 */
  }

  .chat-window {
    width: 360px;
    height: calc(100vh - 80px); /* 动态计算高度 */
    max-height: 600px; /* 最大高度限制 */
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    animation: slide-up 0.3s ease;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgb(var(--v-theme-outline));
    box-shadow: 0 4px 16px rgba(var(--v-theme-on-surface), 0.1);
  }

  .chat-header {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
  }

  .chat-container {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 56px); /* 减去头部高度 */
    color: rgb(var(--v-theme-on-surface));
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* 移动端适配 */
  @media (max-width: 600px) {
    .chat-window {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  }
</style>
