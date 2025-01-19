<!-- src/views/AboutPage.vue -->
<template>
    <v-container>
      <h1 class="text-center mb-5">About Us</h1>
      <AboutUs :title="aboutTitle" :paragraphs="aboutParagraphs" />
    </v-container>
  </template>
  
  <script>
  import AboutUs from '@/components/core/AboutUs.vue';
  import api from '@/services/api.js';
  
  export default {
    name: 'AboutPage',
    components: {
      AboutUs,
    },
    data() {
      return {
        aboutTitle: 'Learn More About Us',
        aboutParagraphs: [],
      };
    },
    methods: {
      fetchAboutUs() {
        // Fetching user data to simulate 'About Us' content
        api.getUsers()
          .then((response) => {
            const user = response.data[0]; // Using the first user as example
            this.aboutParagraphs = [
              `Welcome to ${user.company.name}.`,
              user.company.catchPhrase,
              user.company.bs,
            ];
          })
          .catch((error) => {
            console.error('Failed to load About Us content:', error);
            this.aboutParagraphs = [
              'About Us content could not be loaded at this time.',
            ];
          });
      },
    },
    created() {
      this.fetchAboutUs();
    },
  };
  </script>
  
  <style scoped>
  </style>
  