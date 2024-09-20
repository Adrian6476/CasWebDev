<template>
    <v-navigation-drawer v-model="drawerModel" app>
      <v-list>
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
  </script>