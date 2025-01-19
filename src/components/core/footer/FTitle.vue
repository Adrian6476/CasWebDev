<!-- src/components/core/footer/FTitle.vue -->
<template>
    <h3 class="footer-title">{{ title }}</h3>
  </template>
  
  <script>
  export default {
    name: 'FTitle',
    props: {
      title: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .footer-title {
    color: white;
    margin-bottom: 10px;
    font-weight: bold;
  }
  </style>
  