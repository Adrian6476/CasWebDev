import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TextDisplay from '../components/TextDisplay.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TextDisplay
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'text-display',
      component: TextDisplay
    },
    {
      path: '/404',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

export default router