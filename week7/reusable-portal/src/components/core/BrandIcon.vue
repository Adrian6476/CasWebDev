<template>
    <v-img :src="logoSrc" :alt="altText" class="brand-icon" max-width="200"></v-img>
  </template>
  
  <script>
  export default {
    name: 'BrandIcon',
    props: {
      logoSrc: {
        type: String,
        default: new URL('@/assets/logo.png', import.meta.url).href,
      },
      altText: {
        type: String,
        default: 'Company Logo',
      },
    },
  };
  </script>
  
  <style scoped>
  .brand-icon {
    cursor: pointer;
  }
  </style>
  