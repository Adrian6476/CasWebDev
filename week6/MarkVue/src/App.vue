<template>
  <v-app :theme="theme">
    <NavMenu v-model="drawer" :lang="currentLang" />
    <v-app-bar app>
      <v-app-bar-nav-icon @click="toggleDrawer" v-if="!mdAndUp"></v-app-bar-nav-icon>
      <v-toolbar-title>Documentation System</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Theme toggle button -->
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
      </v-btn>
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
            @click="changeLanguage(languageCode.toString())"
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
import { ref, computed, onMounted, watch } from 'vue';
import NavMenu from './components/NavMenu.vue';
import { useRoute, useRouter } from 'vue-router';
import { ConfigService } from './services/ConfigService';
import { useTheme, useDisplay } from 'vuetify';

const drawer = ref(true);
const theme = ref('light');
const vuetifyTheme = useTheme();
const { mdAndUp, mobile } = useDisplay();

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  vuetifyTheme.global.name.value = theme.value;
  localStorage.setItem('theme', theme.value);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.value = savedTheme;
    vuetifyTheme.global.name.value = savedTheme;
  }
});

watch(mobile, (newValue) => {
  drawer.value = !newValue;
});

const route = useRoute();
const router = useRouter();

const configService = ConfigService.getInstance();

const currentLang = computed(() => route.params.lang || configService.defaultLang);

const languages: { [key: string]: string } = configService.languages;

const changeLanguage = (languageCode: string) => {
  localStorage.setItem('selectedLanguage', languageCode);
  const docId = route.params.docId || configService.landingPage;
  router.push(`/${languageCode}/${docId}`);
};
</script>