<!-- week6/MarkVue/src/components/NavMenu.vue -->

<template>
  <v-navigation-drawer v-model="drawerModel" app>
    <v-list>
      <template v-for="item in menuItems" :key="item.id">
        <!-- Document Item -->
        <v-list-item 
          v-if="item.type === 'doc'" 
          :to="`/${lang}/${item.id}`"
          link
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
        <!-- Chapter Item -->
        <v-list-group v-else-if="item.type === 'chapter'" :value="false">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="item.name"></v-list-item>
          </template>
          <v-list-item 
            v-for="subItem in item.sub" 
            :key="subItem.id" 
            :to="`/${lang}/${subItem.id}`"
            link
          >
            <v-list-item-title>{{ subItem.name }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <!-- Separator -->
        <v-divider v-else-if="item.type === 'sep'"></v-divider>
        <!-- External Link -->
        <v-list-item 
          v-else-if="item.type === 'link'" 
          :href="item.file"
          target="_blank"
          link
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <template v-slot:append>
            <v-icon>mdi-open-in-new</v-icon>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import yaml from 'js-yaml';
import { ConfigService } from '../services/ConfigService';

const props = defineProps(['modelValue', 'lang']);
const emit = defineEmits(['update:modelValue']);

const drawerModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const menuItems = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('/src/app/doc/toc.yaml');
    const yamlText = await response.text();
    const parsedYaml = yaml.load(yamlText) as any;
    if (parsedYaml && parsedYaml.docs && parsedYaml.docs.chapters) {
      menuItems.value = parsedYaml.docs.chapters;
    }
  } catch (error) {
    console.error('Error loading YAML file:', error);
  }
});

const lang = computed(() => props.lang);
</script>
