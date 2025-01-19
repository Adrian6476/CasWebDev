<!-- src/components/core/footer/LanguageSwitcher.vue -->
<template>
    <v-select
      :items="languages"
      v-model="selectedLanguage"
      class="language-switcher"
      dense
      outlined
      hide-details
      @change="changeLanguage"
    ></v-select>
  </template>
  
  <script>
  export default {
    name: 'LanguageSwitcher',
    data() {
      return {
        languages: [
          { text: 'English', value: 'en' },
          { text: 'Español', value: 'es' },
        ],
        selectedLanguage: 'en',
      };
    },
    methods: {
      changeLanguage() {
        // Implement language change logic here
        // For now, we'll just log the selected language
        console.log('Language changed to:', this.selectedLanguage);
      },
    },
  };
  </script>
  
  <style scoped>
  .language-switcher {
    max-width: 150px;
    color: white;
  }
  </style>
  