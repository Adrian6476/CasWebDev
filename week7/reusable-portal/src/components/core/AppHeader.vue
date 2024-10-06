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
    <v-btn v-if="isAuthenticated" @click="handleUserAction" icon>
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn v-else text :to="'/login'" router>
      Login
    </v-btn>
  </v-app-bar>
</template>

<script>
import BrandIcon from './BrandIcon.vue';
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
  data() {
    return {
      user: null,
    };
  },
  computed: {
    isAuthenticated() {
      return !!this.user;
    },
  },
  methods: {
    handleUserAction() {
      this.$router.push('/profile');
    },
    async logout() {
      try {
        await signOut(auth);
        this.$router.push('/');
        alert('Logged out successfully!');
      } catch (error) {
        alert('Error logging out: ' + error.message);
      }
    },
  },
  created() {
    onAuthStateChanged(auth, (currentUser) => {
      this.user = currentUser;
    });
  },
};
</script>

<style scoped>
.v-btn {
  margin-left: 10px;
}
</style>