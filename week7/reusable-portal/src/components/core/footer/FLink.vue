<!-- src/components/core/footer/FLink.vue -->
<template>
    <v-btn
      text
      class="footer-link"
      :to="link.path"
      router
    >
      {{ link.name }}
    </v-btn>
  </template>
  
  <script>
  export default {
    name: 'FLink',
    props: {
      link: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .footer-link {
    color: black;
    text-transform: none;
    padding: 0;
    min-width: unset;
  }
  </style>
  