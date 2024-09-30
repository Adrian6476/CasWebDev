<!-- src/views/HomePage.vue -->
<template>
    <v-container fluid>
      <!-- Slogan Section -->
      <section class="section-slogan">
        <AppSlogan :title="sloganTitle" :subtitle="sloganSubtitle" />
      </section>
  
      <!-- About Us Section -->
      <section class="section-about-us">
        <AboutUs :title="aboutTitle" :paragraphs="aboutParagraphs" />
      </section>
  
      <!-- News Carousel Section -->
      <section class="section-carousel">
        <AppCarousel :items="carouselItems" />
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
    };
},
methods: {
    fetchAboutUs() {
    // Simulate fetching 'about us' content
    api.getUsers().then((response) => {
        const user = response.data[0]; // Using the first user as example
        this.aboutParagraphs = [
        `Welcome to ${user.company.name}.`,
        user.company.catchPhrase,
        user.company.bs,
        ];
    });
    },
    fetchNews() {
    api.getPosts().then((response) => {
        // Use the first 5 posts as news items
        this.carouselItems = response.data.slice(0, 5).map((post) => ({
        src: 'https://via.placeholder.com/800x400?text=News', // Placeholder image
        alt: post.title,
        title: post.title,
        subtitle: post.body,
        }));
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
.section-carousel {
padding: 50px 0;
}

@media (max-width: 600px) {
.section-slogan,
.section-about-us,
.section-carousel {
    padding: 30px 0;
}
}
</style>
