<!-- src/components/core/AppHeader.vue -->
<template>
  <v-app-bar color="primary" dark app>
    <!-- Hamburger Menu Icon for Mobile -->
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none"></v-app-bar-nav-icon>

    <!-- Brand Logo -->
    <v-toolbar-title class="mr-4">
      <BrandIcon :logoSrc="logoSrc" />
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Desktop Navigation Links -->
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
        v-for="(link, index) in navLinks"
        :key="index"
        text
        :to="link.path"
        router
      >
        {{ link.name }}
      </v-btn>

      <!-- User Account or Login Button -->
      <v-btn v-if="isAuthenticated" @click="handleUserAction" icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn v-else text :to="'/login'" router>
        Login
      </v-btn>
    </v-toolbar-items>

    <!-- Mobile User Account or Login Button -->
    <v-btn
      v-if="isAuthenticated"
      @click="handleUserAction"
      icon
      class="d-sm-none"
    >
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn v-else text :to="'/login'" router class="d-sm-none">
      Login
    </v-btn>
  </v-app-bar>

  <!-- Navigation Drawer for Mobile -->
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    class="d-sm-none"
  >
    <v-list dense>
      <v-list-item
        v-for="(link, index) in navLinks"
        :key="index"
        :to="link.path"
        router
        @click="drawer = false"
      >
        <v-list-item-title>{{ link.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
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
      drawer: false,
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
/* Adjust spacing for navigation buttons */
.v-btn {
  margin-left: 10px;
}

/* Optional: Customize the navigation drawer appearance */
.v-navigation-drawer {
  width: 250px;
}
</style>
