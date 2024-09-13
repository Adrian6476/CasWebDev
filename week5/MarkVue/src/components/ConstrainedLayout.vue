<template>
  <v-app>
    <NavMenu v-model="drawer" />
    <v-app-bar app>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Documentation System</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer app>
      <!-- Add footer content here -->
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavMenu from './NavMenu.vue';

const drawer = ref(true);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
</script>