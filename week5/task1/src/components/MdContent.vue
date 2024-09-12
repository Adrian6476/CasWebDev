<!-- src/components/MdContent.vue -->
<template>
    <div v-html="renderedContent"></div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  
  const props = defineProps<{
    content: string;
  }>();
  
  const renderedContent = computed(() => {
    const rawHtml = marked(props.content);
    return DOMPurify.sanitize(rawHtml);
  });
  </script>