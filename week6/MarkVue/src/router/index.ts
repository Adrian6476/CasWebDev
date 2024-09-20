import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { RouteService } from '../services/RouteService'
import DocumentViewer from '../components/DocumentViewer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // Catch-all route
    {
      path: '/:docId',
      name: 'document',
      component: DocumentViewer,
      props: true
    }
  ]
})

async function initializeRouter() {
  const routeService = RouteService.getInstance();
  const dynamicRoutes = await routeService.generateRoutes();
  dynamicRoutes.forEach(route => router.addRoute(route));
}

initializeRouter();

export default router