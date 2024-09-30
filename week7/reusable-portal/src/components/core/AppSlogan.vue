<!-- src/components/core/AppSlogan.vue -->
<template>
  <v-container class="slogan-container">
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="display-1 font-weight-bold">{{ title }}</h1>
        <p class="subtitle-1">{{ subtitle }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AppSlogan',
  props: {
    title: {
      type: String,
      default: 'Welcome to Our Portal',
    },
    subtitle: {
      type: String,
      default: 'Empowering teams across the company',
    },
  },
};
</script>

<style scoped>
.slogan-container {
  padding-top: 50px;
  padding-bottom: 50px;
}

.display-1 {
  font-size: 3rem;
}

.subtitle-1 {
  font-size: 1.25rem;
  color: grey;
}

@media (max-width: 600px) {
  .display-1 {
    font-size: 2rem;
  }
  .subtitle-1 {
    font-size: 1rem;
  }
}
</style>
