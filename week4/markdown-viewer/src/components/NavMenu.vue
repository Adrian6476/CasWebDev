<template>
  <nav>
    <ul>
      <li v-for="item in menuItems" :key="item.id">
        <router-link :to="'/' + item.id">{{ item.name }}</router-link>
        <ul v-if="item.sub">
          <li v-for="subItem in item.sub" :key="subItem.id">
            <router-link :to="'/' + subItem.id">{{ subItem.name }}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import yaml from 'js-yaml'

interface MenuItem {
  id: string
  name: string
  file?: string
  sub?: MenuItem[]
}

const menuItems = ref<MenuItem[]>([])

onMounted(async () => {
  try {
    const response = await fetch('/src/assets/toc.yaml')
    const yamlText = await response.text()
    const parsedYaml = yaml.load(yamlText) as { docs: MenuItem[] }
    menuItems.value = parsedYaml.docs
  } catch (error) {
    console.error('Error loading YAML:', error)
  }
})
</script>