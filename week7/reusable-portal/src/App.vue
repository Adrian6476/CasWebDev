<!-- src/App.vue -->
<template>
  <v-app>
    <AppHeader :logoSrc="logoSrc" :navLinks="navLinks" />
    <v-main>
      <router-view />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import AppHeader from '@/components/core/AppHeader.vue';
import AppFooter from '@/components/core/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
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
html,
body,
#app {
  height: 100%;
}

.v-application {
  min-height: 100%;
}
</style>
