<template>
    <div>
      <h1>{{ filename }}</h1>
      <pre>{{ content }}</pre>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  export default {
    setup() {
      const route = useRoute()
      const filename = ref('')
      const content = ref('')
  
      onMounted(async () => {
        filename.value = route.params.filename
        try {
          const response = await fetch(`/src/assets/${filename.value}.txt`)
          if (!response.ok) {
            throw new Error('File not found')
          }
          content.value = await response.text()
        } catch (error) {
          console.error('Error loading file:', error)
          content.value = 'Error loading file'
        }
      })
  
      return { filename, content }
    }
  }
  </script>