// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AboutPage from '@/views/AboutPage.vue';
import BlogPage from '@/views/BlogPage.vue';
import BlogDetailsPage from '@/views/BlogDetailsPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogPage,
  },
  {
    path: '/blog/:id',
    name: 'BlogDetails',
    component: BlogDetailsPage,
    props: true,
  },
  // Other routes...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
