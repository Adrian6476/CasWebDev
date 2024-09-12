<!-- src/components/MdToc.vue -->
<template>
    <v-list dense>
      <v-list-item
        v-for="(item, index) in tocItems"
        :key="index"
        :class="{ 'pl-' + (item.level * 2) }"
        @click="scrollToHeading(item.id)"
      >
        {{ item.text }}
      </v-list-item>
    </v-list>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { marked } from 'marked';
  
  const props = defineProps<{
    content: string;
  }>();
  
  const tocItems = computed(() => {
    const tokens = marked.lexer(props.content);
    return tokens
      .filter((token): token is marked.Tokens.Heading => token.type === 'heading')
      .map(token => ({
        level: token.depth,
        text: token.text,
        id: token.text.toLowerCase().replace(/\s+/g, '-')
      }));
  });
  
  function scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  </script>