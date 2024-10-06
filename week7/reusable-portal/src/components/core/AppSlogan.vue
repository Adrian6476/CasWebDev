<!-- src/components/core/AppSlogan.vue -->
<template>
  <div class="slogan-container" :style="backgroundStyle">
    <v-container fluid :class="[`px-${sideSpacing}`]">
      <v-row justify="center" align="center" class="slogan-content">
        <v-col cols="12" :md="contentWidth" class="text-center">
          <h1 class="display-1 font-weight-bold white--text">{{ title }}</h1>
          <p class="subtitle-1 white--text">{{ subtitle }}</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
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
    sideSpacing: {
      type: [Number, String],
      default: 6, // Vuetify's default spacing
    },
    contentWidth: {
      type: [Number, String],
      default: 8,
    },
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${new URL('@/assets/slogan.jpg', import.meta.url).href})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },
  },
};
</script>

<style scoped>
.slogan-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 1rem;
  margin-right: 1rem;
}

.slogan-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.slogan-content {
  position: relative;
  z-index: 1;
}

.display-1 {
  font-size: 4rem;
  color: white;
  margin-bottom: 1rem;
}

.subtitle-1 {
  font-size: 1.75rem;
  color: white;
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