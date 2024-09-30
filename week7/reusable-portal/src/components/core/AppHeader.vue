<!-- src/components/core/AppHeader.vue -->
<template>
  <v-app-bar color="primary" dark app>
    <v-toolbar-title>
      <BrandIcon :logoSrc="logoSrc" />
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      v-for="(link, index) in navLinks"
      :key="index"
      text
      :to="link.path"
      router
    >
      {{ link.name }}
    </v-btn>
  </v-app-bar>
</template>

<script>
import BrandIcon from './BrandIcon.vue';

export default {
  name: 'AppHeader',
  components: {
    BrandIcon,
  },
  props: {
    logoSrc: {
      type: String,
      default: new URL('@/assets/logo.png', import.meta.url).href,
    },
    navLinks: {
      type: Array,
      default: () => [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' }, 
      ],
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin-left: 10px;
}
</style>
