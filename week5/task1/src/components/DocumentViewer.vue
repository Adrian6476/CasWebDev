<template>
    <div class="document-viewer">
      <md-content :content="content" />
      <md-toc :content="content" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import MdContent from './MdContent.vue';
  import MdToc from './MdToc.vue';
  
  const props = defineProps(['docId']);
  const content = ref('');
  
  async function fetchContent() {
    try {
      const response = await fetch(`/src/app/doc/${props.docId}.md`);
      if (response.ok) {
        content.value = await response.text();
      } else {
        content.value = '# Document not found';
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      content.value = '# Error loading document';
    }
  }
  
  onMounted(fetchContent);
  
  watch(() => props.docId, fetchContent);
  </script>