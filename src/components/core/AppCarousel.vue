<!-- src/components/core/AppCarousel.vue -->
<template>
  <v-container class="carousel-container">
    <v-carousel
      :show-arrows="showArrows"
      :cycle="cycle"
      height="400"
    >
      <v-carousel-item
        v-for="(item, i) in items"
        :key="i"
      >
        <v-img
          :src="item.src"
          :alt="item.alt"
          class="fill-height"
        >
          <v-container
            class="fill-height"
            fluid
          >
            <v-row
              class="fill-height"
              align="center"
              justify="center"
            >
              <v-col
                cols="12"
                class="text-center"
              >
                <h2 class="display-2 font-weight-bold white--text">{{ item.title }}</h2>
                <p class="subtitle-1 white--text">{{ item.subtitle }}</p>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
export default {
  name: 'AppCarousel',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    showArrows: {
      type: Boolean,
      default: true,
    },
    cycle: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.carousel-container {
  padding-top: 50px;
  padding-bottom: 50px;
}
.v-carousel-item {
  position: relative;
}
</style>
