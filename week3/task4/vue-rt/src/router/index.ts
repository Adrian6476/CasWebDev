import { createRouter, createWebHistory } from 'vue-router'
import TextDisplay from '../components/TextDisplay.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:filename',
      name: 'text-display',
      component: TextDisplay
    }
  ]
})

export default router