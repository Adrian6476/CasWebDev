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
  name: 'AppCarousel', // Updated component name
  props: {
    items: {
      type: Array,
      default: () => [
        {
          src: new URL('@/assets/slide1.jpg', import.meta.url).href,
          alt: 'Slide 1',
          title: 'First Slide',
          subtitle: 'This is the first slide subtitle.',
        },
        {
          src: new URL('@/assets/slide2.jpg', import.meta.url).href,
          alt: 'Slide 2',
          title: 'Second Slide',
          subtitle: 'This is the second slide subtitle.',
        },
        {
          src: new URL('@/assets/slide3.jpg', import.meta.url).href,
          alt: 'Slide 3',
          title: 'Third Slide',
          subtitle: 'This is the third slide subtitle.',
        },
      ],
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
