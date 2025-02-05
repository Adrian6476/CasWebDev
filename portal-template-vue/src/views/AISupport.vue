<template>
  <div class="ai-support">
    <h1>{{ $t('aiSupport.title') }}</h1>
    <div class="support-container">
      <AIChat />
    </div>
  </div>
</template>

<script setup>
  import AIChat from '@/components/AIChat.vue'
</script>

<style scoped>
  .ai-support {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 20px;
    color: #333;
    text-align: center;
  }

  .support-container {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
</style>
