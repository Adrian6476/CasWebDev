<template>
  <div v-if="content" v-html="content"></div>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()
const content = ref<string>('')

const fetchContent = async (filename: string) => {
  try {
    // Use the full path including nested routes
    const response = await fetch(`/src/assets/markdown/${filename}.md`)
    if (!response.ok) {
      throw new Error('File not found')
    }
    const text = await response.text()
    content.value = marked(text)
  } catch (error) {
    console.error('Error loading file:', error)
    router.push('/404')
  }
}

const getFilename = () => {
  return route.params.pathMatch ? (route.params.pathMatch as string[]).join('/') : 'welcome'
}

onMounted(() => fetchContent(getFilename()))

watch(() => route.params.pathMatch, () => {
  fetchContent(getFilename())
})
</script>