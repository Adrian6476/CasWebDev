<template>
  <v-navigation-drawer location="right" width="200">
    <v-list dense>
      <v-list-item 
        v-for="(item, index) in toc" 
        :key="index"
        :title="item.text"
        :to="{ hash: item.id }"
        :class="getItemClass(item.level)"
      >
        <template v-slot:prepend>
          <v-icon :icon="getIcon(item.level)" size="small"></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ content: string }>();

const toc = computed(() => {
  const headings = props.content.match(/#{1,6}.+/g) || [];
  return headings.map((heading: string) => {
    const match = heading.match(/^#+/);
    const level = match ? match[0].length : 0;
    const text = heading.replace(/^#+\s*/, '');
    const id = text.toLowerCase().replace(/\s+/g, '-');
    return { level, text, id };
  });
});

const getItemClass = (level: number) => {
  return `pl-${level * 2}`;
};

const getIcon = (level: number) => {
  switch (level) {
    case 1:
      return 'mdi-bookmark';
    case 2:
      return 'mdi-bookmark-outline';
    default:
      return 'mdi-chevron-right';
  }
};
</script>

<style scoped>
.v-list-item {
  min-height: 32px;
}
</style>
