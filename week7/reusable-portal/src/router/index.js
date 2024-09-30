// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AboutPage from '@/views/AboutPage.vue';
import BlogPage from '@/views/BlogPage.vue';
import BlogDetailsPage from '@/views/BlogDetailsPage.vue';
import CareersPage from '@/views/CareersPage.vue';
import HelpPage from '@/views/HelpPage.vue';
import PrivacyPolicyPage from '@/views/PrivacyPolicyPage.vue';
import TermsOfServicePage from '@/views/TermsOfServicePage.vue';
import ContactPage from '@/views/ContactPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import UserProfile from '@/views/UserProfile.vue';

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
  {
    path: '/careers',
    name: 'Careers',
    component: CareersPage,
  },
  {
    path: '/help',
    name: 'Help',
    component: HelpPage,
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicyPage,
  },
  {
    path: '/terms',
    name: 'TermsOfService',
    component: TermsOfServicePage,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage, 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guards
import { auth } from '@/firebase';

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;

  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' });
  } else if (to.meta.requiresGuest && user) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;