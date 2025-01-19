<!-- src/components/core/AboutUs.vue -->
<template>
    <v-container class="about-us-container">
      <v-row>
        <v-col cols="12" md="6">
          <v-img
            :src="imageSrc"
            :alt="imageAlt"
            class="about-us-image"
          ></v-img>
        </v-col>
        <v-col cols="12" md="6">
          <h2 class="headline font-weight-bold">{{ title }}</h2>
          <AppParagraph
            v-for="(paragraph, index) in paragraphs"
            :key="index"
            :text="paragraph"
          />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import AppParagraph from './AppParagraph.vue';
  
  export default {
    name: 'AboutUs',
    components: {
      AppParagraph,
    },
    props: {
      title: {
        type: String,
        default: 'About Us',
      },
      imageSrc: {
        type: String,
        default: new URL('@/assets/about-us.jpg', import.meta.url).href,
      },
      imageAlt: {
        type: String,
        default: 'About Us Image',
      },
      paragraphs: {
        type: Array,
        default: () => [],
      },
    },
  };
  </script>
  
  <style scoped>
  .about-us-container {
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .about-us-image {
    border-radius: 8px;
  }
  </style>
  