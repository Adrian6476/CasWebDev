<!-- week6/MarkVue/src/App.vue -->

<template>
  <v-app>
    <NavMenu v-model="drawer" :lang="currentLang" />
    <v-app-bar app>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Documentation System</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Language selection -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item 
            v-for="(languageName, languageCode) in languages" 
            :key="languageCode"
            @click="changeLanguage(languageCode)"
          >
            <v-list-item-title>{{ languageName }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
import { ref, computed } from 'vue';
import NavMenu from './components/NavMenu.vue';
import { useRoute, useRouter } from 'vue-router';
import { ConfigService } from './services/ConfigService';

const drawer = ref(true);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const route = useRoute();
const router = useRouter();

const configService = ConfigService.getInstance();

const currentLang = computed(() => route.params.lang || configService.defaultLang);

const languages = configService.languages;

const changeLanguage = (languageCode: string) => {
  localStorage.setItem('selectedLanguage', languageCode);
  const docId = route.params.docId || configService.landingPage;
  router.push(`/${languageCode}/${docId}`);
};
</script>
