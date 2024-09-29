<!-- src/views/HomePage.vue -->
<template>
    <div>
      <AppSlogan :title="sloganTitle" :subtitle="sloganSubtitle" />
      <AboutUs :title="aboutTitle" :paragraphs="aboutParagraphs" />
      <AppCarousel :items="carouselItems" /> <!-- Updated component name -->
    </div>
  </template>
  
  <script>
  import AppSlogan from '@/components/core/AppSlogan.vue';
  import AboutUs from '@/components/core/AboutUs.vue';
  import AppCarousel from '@/components/core/AppCarousel.vue'; // Updated import
  
  export default {
    name: 'HomePage', // Updated component name
    components: {
      AppSlogan,
      AboutUs,
      AppCarousel, // Updated component registration
    },
    data() {
      return {
        sloganTitle: 'Welcome to Our Portal',
        sloganSubtitle: 'Empowering teams across the company',
        aboutTitle: 'About Our Company',
        aboutParagraphs: [
          'We are dedicated to providing the best services.',
          'Our mission is to innovate and lead the industry.',
          'Join us on our journey towards excellence.',
        ],
        carouselItems: [
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
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any specific styles for the HomePage view here */
  </style>
  