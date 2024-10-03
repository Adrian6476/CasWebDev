<!-- src/components/core/AppFooter.vue -->
<template>
  <v-footer color="primary">
    <v-container>
      <v-row>
        <!-- Section: Company Info -->
        <v-col cols="12" md="4">
          <FTitle title="Company" />
          <v-row dense>
            <v-col v-for="(link, index) in companyLinks" :key="index" cols="auto">
              <FLink :link="link" />
            </v-col>
          </v-row>
        </v-col>

        <!-- Section: Resources -->
        <v-col cols="12" md="4">
          <FTitle title="Resources" />
          <v-row dense>
            <v-col v-for="(link, index) in resourceLinks" :key="index" cols="auto">
              <FLink :link="link" />
            </v-col>
          </v-row>
        </v-col>

        <!-- Section: Language Switcher -->
        <v-col cols="12" md="4">
          <FTitle title="Language" />
          <LanguageSwitcher />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- Bottom Row -->
      <v-row align="center" justify="space-between">
        <v-col cols="12" sm="6">
          <span class="white--text">&copy; {{ new Date().getFullYear() }} Company Name</span>
        </v-col>
        <v-col cols="12" sm="6">
          <v-row justify="end" dense>
            <v-col v-for="(link, index) in legalLinks" :key="index" cols="auto">
              <FLink :link="link" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import FTitle from './footer/FTitle.vue';
import FLink from './footer/FLink.vue';
import LanguageSwitcher from './footer/LanguageSwitcher.vue';

export default {
  name: 'AppFooter',
  components: {
    FTitle,
    FLink,
    LanguageSwitcher,
  },
  data() {
    return {
      companyLinks: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
      ],
      resourceLinks: [
        { name: 'Help Center', path: '/help' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
      ],
      legalLinks: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
      ],
    };
  },
};
</script>

<style scoped>
.v-footer {
  padding-top: 40px;
  padding-bottom: 20px;
  color: white;
}
</style>