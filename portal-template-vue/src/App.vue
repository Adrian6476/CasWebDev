<template>
  <!-- Use Theme Provider for managing app theme -->
  <theme-provider>
    <!-- Use Locale Provider for internationalization -->
    <v-locale-provider>
      <!-- Default layout wrapper -->
      <default-layout>
        <!-- Render current route component with transitions -->
        <router-view v-slot="{ Component }">
          <!-- Animated page transitions -->
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </default-layout>
    </v-locale-provider>
  </theme-provider>
</template>

<script setup>
  // Import DefaultLayout component for layout structure.
  import DefaultLayout from '@/layouts/DefaultLayout.vue'
  // Import ThemeProvider component for theme management.
  import ThemeProvider from '@/components/ThemeProvider.vue'
</script>

<style>
  /* Global styles for html and body elements */
  html,
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  /* Styles for theme transition effects */
  .theme-transitioning * {
    transition:
      background-color var(--theme-transition-duration) var(--theme-transition-timing),
      border-color var(--theme-transition-duration) var(--theme-transition-timing),
      color var(--theme-transition-duration) var(--theme-transition-timing) !important;
  }

  /* Page transition animations for entering and leaving */
  .page-enter-active,
  .page-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease !important;
  }

  /* Root level CSS variable for section spacing */
  :root {
    --section-spacing: 4rem;
  }
</style>
