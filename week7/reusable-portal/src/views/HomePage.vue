<!-- src/views/HomePage.vue -->
<template>
  <v-container fluid>
    <!-- Slogan Section -->
    <section class="section-slogan">
      <AppSlogan :title="sloganTitle" :subtitle="sloganSubtitle" />
    </section>

    <!-- Carousel Section -->
    <section class="section-carousel" v-if="carouselItems.length > 0">
      <AppCarousel :items="carouselItems" />
    </section>
    <v-skeleton-loader
      v-else
      type="image, article"
      class="mx-auto"
    ></v-skeleton-loader>

    <!-- About Us Section -->
    <section class="section-about-us">
      <AboutUs :title="aboutTitle" :paragraphs="aboutParagraphs" />
    </section>

    <!-- News Section -->
    <section class="section-news" v-if="newsItems.length > 0">
      <v-container class="max-width-container">
        <h2 class="text-h4 mb-4 text-center">Latest News</h2>
        <v-row justify="center">
          <v-col v-for="(item, index) in newsItems" :key="index" cols="12" sm="6" md="4">
            <v-card class="mx-auto" max-width="400">
              <v-img :src="item.src" :alt="item.alt" height="200"></v-img>
              <v-card-title class="text-subtitle-1">{{ item.title }}</v-card-title>
              <v-card-text>{{ item.subtitle }}</v-card-text>
              <v-card-actions>
                <v-btn color="primary" text>Read More</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-container>
</template>

<script>
import AppSlogan from '@/components/core/AppSlogan.vue';
import AboutUs from '@/components/core/AboutUs.vue';
import AppCarousel from '@/components/core/AppCarousel.vue';
import api from '@/services/api.js';

export default {
  name: 'HomePage',
  components: {
    AppSlogan,
    AboutUs,
    AppCarousel,
  },
  data() {
    return {
      sloganTitle: 'Welcome to Our Portal',
      sloganSubtitle: 'Empowering teams across the company',
      aboutTitle: 'About Our Company',
      aboutParagraphs: [],
      carouselItems: [],
      newsItems: [],
    };
  },
  methods: {
    fetchAboutUs() {
      api.getUsers().then((response) => {
        const user = response.data[0];
        this.aboutParagraphs = [
          `Welcome to ${user.company.name}.`,
          user.company.catchPhrase,
          user.company.bs,
        ];
      });
    },
    fetchNews() {
      api.getPosts().then((response) => {
        const posts = response.data.slice(0, 5).map((post) => ({
          src: `https://picsum.photos/seed/${post.id}/800/400`,
          alt: post.title,
          title: post.title,
          subtitle: post.body.slice(0, 100) + '...',
        }));
        
        // Set the first two items for the carousel
        this.carouselItems = posts.slice(0, 2);
        
        // Set the remaining items for the news section
        this.newsItems = posts.slice(2);
      });
    },
  },
  created() {
    this.fetchAboutUs();
    this.fetchNews();
  },
};
</script>

<style scoped>
.section-slogan,
.section-about-us,
.section-carousel,
.section-news {
  padding: 50px 0;
}

.max-width-container {
  max-width: 1200px;
}

@media (max-width: 600px) {
  .section-slogan,
  .section-about-us,
  .section-carousel,
  .section-news {
    padding: 30px 0;
  }
}
</style>