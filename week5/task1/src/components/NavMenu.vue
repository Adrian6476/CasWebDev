<template>
    <v-navigation-drawer v-model="drawerModel" app>
      <v-list v-if="menuItems.length > 0">
        <template v-for="item in menuItems" :key="item.id">
          <v-list-item 
            v-if="item.type === 'doc' || item.type === 'link'" 
            :to="item.type === 'doc' ? { name: item.id } : undefined"
            :href="item.type === 'link' ? item.file : undefined"
            :target="item.type === 'link' ? '_blank' : undefined"
            link
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <template v-slot:append v-if="item.type === 'link'">
              <v-icon>mdi-open-in-new</v-icon>
            </template>
          </v-list-item>
          <v-list-group v-else-if="item.type === 'chapter'" :value="false">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" :title="item.name"></v-list-item>
            </template>
            <v-list-item 
              v-for="subItem in item.sub" 
              :key="subItem.id" 
              :to="subItem.type === 'doc' ? { name: subItem.id } : undefined"
              :href="subItem.type === 'link' ? subItem.file : undefined"
              :target="subItem.type === 'link' ? '_blank' : undefined"
              link
            >
              <v-list-item-title>{{ subItem.name }}</v-list-item-title>
              <template v-slot:append v-if="subItem.type === 'link'">
                <v-icon>mdi-open-in-new</v-icon>
              </template>
            </v-list-item>
          </v-list-group>
          <v-divider v-else-if="item.type === 'sep'"></v-divider>
        </template>
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-title>{{ errorMessage || 'Error loading menu items' }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import yaml from 'js-yaml';
  
  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const drawerModel = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  
  const menuItems = ref([]);
  const errorMessage = ref('');
  
  onMounted(async () => {
    try {
      const response = await fetch('/src/app/doc/toc.yaml');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const yamlText = await response.text();
      console.log('YAML content:', yamlText); // Debug: Log the YAML content
      const parsedYaml = yaml.load(yamlText) as any;
      console.log('Parsed YAML:', parsedYaml); // Debug: Log the parsed YAML
      if (parsedYaml && parsedYaml.docs && parsedYaml.docs.chapters) {
        menuItems.value = parsedYaml.docs.chapters;
      } else {
        throw new Error('Invalid YAML structure');
      }
    } catch (error) {
      console.error('Error loading YAML file:', error);
      errorMessage.value = `Error: ${error.message}`;
    }
  });
  </script>