<!-- src/components/core/AppSlogan.vue -->
<template>
  <div class="slogan-container" :style="backgroundStyle">
    <v-container fluid>
      <v-row justify="center" align="center" class="slogan-content">
        <v-col cols="12" :md="contentWidth" class="text-center">
          <h1 class="slogan-title">{{ title }}</h1>
          <p class="slogan-subtitle">{{ subtitle }}</p>
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
  min-height: 70vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 1rem;
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

.slogan-title {
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: bold;
}

.slogan-subtitle {
  font-size: 1.5rem;
  color: white;
}

@media (max-width: 960px) {
  .slogan-title {
    font-size: 2.5rem;
  }
  .slogan-subtitle {
    font-size: 1.25rem;
  }
}

@media (max-width: 600px) {
  .slogan-title {
    font-size: 2rem;
  }
  .slogan-subtitle {
    font-size: 1rem;
  }
}
</style>
