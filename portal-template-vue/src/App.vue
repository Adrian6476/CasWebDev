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
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

:root {
  --section-spacing: 4rem;
}
</style>
