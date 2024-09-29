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
  import AppParagraph from './AppParagraph.vue'; // Updated import
  
  export default {
    name: 'AboutUs',
    components: {
      AppParagraph, // Updated component registration
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
        default: () => [
          'We are a forward-thinking company committed to excellence.',
          'Our team works tirelessly to innovate and improve our services.',
          'We value collaboration, integrity, and customer satisfaction.',
        ],
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
  