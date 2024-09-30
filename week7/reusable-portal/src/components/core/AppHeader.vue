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
    <v-menu v-if="user" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item :to="'/profile'" router>
          <v-list-item-title>My Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn v-else text :to="'/login'" router>
      Login
    </v-btn>
  </v-app-bar>
</template>

<script>
import BrandIcon from './BrandIcon.vue';
import { ref, onMounted } from 'vue';
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
  setup() {
    const user = ref(null);

    onMounted(() => {
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
      });
    });

    const logout = () => {
      signOut(auth)
        .then(() => {
          alert('Logged out successfully!');
        })
        .catch((error) => {
          alert(error.message);
        });
    };

    return {
      user,
      logout,
    };
  },
};
</script>

<style scoped>
.v-btn {
  margin-left: 10px;
}
</style>
