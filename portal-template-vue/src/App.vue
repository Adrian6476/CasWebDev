<template>
  <theme-provider>
    <v-locale-provider>
      <default-layout>
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </default-layout>
    </v-locale-provider>
  </theme-provider>
</template>

<script setup>
  import DefaultLayout from '@/layouts/DefaultLayout.vue'
  import ThemeProvider from '@/components/ThemeProvider.vue'
</script>

<style>
  /* Global styles */
  html,
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  /* Theme transition styles */
  .theme-transitioning * {
    transition:
      background-color var(--theme-transition-duration) var(--theme-transition-timing),
      border-color var(--theme-transition-duration) var(--theme-transition-timing),
      color var(--theme-transition-duration) var(--theme-transition-timing) !important;
  }

  /* Ensure page transitions work independently */
  .page-enter-active,
  .page-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease !important;
  }

  :root {
    --section-spacing: 4rem;
  }
</style>
