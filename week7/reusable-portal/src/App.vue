<!-- src/App.vue -->
<template>
  <v-app>
    <AppHeader :logoSrc="logoSrc" :navLinks="navLinks" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from '@/components/core/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
  },
  data() {
    return {
      logoSrc: new URL('@/assets/logo.png', import.meta.url).href,
      navLinks: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
      ],
    };
  },
};
</script>

<style>
/* Global styles */
</style>
