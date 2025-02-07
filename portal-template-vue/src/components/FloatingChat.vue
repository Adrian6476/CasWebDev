<template>
  <div class="floating-chat">
    <!-- Chat window -->
    <v-card v-show="chatStore.isOpen" class="chat-window">
      <v-card-title class="chat-header">
        <span>{{ $t('aiSupport.title') }}</span>
        <v-btn
          icon
          size="small"
          :aria-label="$t('common.close')"
          variant="text"
          color="white"
          @click="chatStore.closeChat"
        >
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
</script>

<style scoped>
  .floating-chat {
    position: fixed;
    bottom: 32px; /* Increased bottom spacing */
    right: 24px;
    z-index: 99999; /* Higher priority */
    pointer-events: auto; /* Ensure interactivity */
  }

  .chat-window {
    width: 360px;
    height: calc(100vh - 80px); /* Dynamic height calculation */
    max-height: 600px; /* Maximum height limit */
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
    padding: 16px; /* Uniform padding */
    display: flex;
    align-items: center;
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
    font-size: 16px;
    font-weight: 500;
    gap: 12px; /* Set spacing */
  }

  .chat-header span {
    margin-left: 8px;
    flex-grow: 1; /* Let title occupy remaining space */
  }

  .chat-header span {
    margin-left: 8px;
    font-weight: 500;
  }

  .chat-container {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 56px); /* Subtract header height */
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

  /* Mobile adaptation */
  @media (max-width: 600px) {
    .floating-chat {
      bottom: 0;
      right: 0;
    }

    .chat-window {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100vh;
      max-height: none;
      border-radius: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      padding: env(safe-area-inset-top) env(safe-area-inset-right) 12px env(safe-area-inset-left);
      min-height: 56px;
    }

    .chat-container {
      flex: 1;
      height: calc(100vh - 56px);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
</style>
