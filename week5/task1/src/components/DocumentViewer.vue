<!-- src/components/DocumentViewer.vue -->
<template>
    <v-container>
      <v-row>
        <v-col cols="9">
          <md-content :content="markdownContent" />
        </v-col>
        <v-col cols="3">
          <md-toc :content="markdownContent" />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import MdContent from './MdContent.vue';
  import MdToc from './MdToc.vue';
  
  const route = useRoute();
  const markdownContent = ref('');
  
  async function fetchMarkdownContent() {
  try {
    const filePath = route.meta.filePath as string;
    if (!filePath) {
      throw new Error('File path not found in route meta');
    }
    const response = await fetch(`/content/${filePath}`);
    if (!response.ok) {
      throw new Error('Failed to fetch markdown content');
    }
    markdownContent.value = await response.text();
  } catch (error) {
    console.error('Error fetching markdown content:', error);
    markdownContent.value = '# Document not found';
  }
}
  
  onMounted(fetchMarkdownContent);
  watch(() => route.path, fetchMarkdownContent);
  </script>