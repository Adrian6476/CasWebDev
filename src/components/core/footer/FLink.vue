<!-- src/components/core/footer/FLink.vue -->
<template>
  <v-btn
    text
    class="footer-link px-3 py-1 mb-2 mr-2"
    :to="link.path"
    router
    small
  >
    {{ link.name }}
  </v-btn>
</template>

<script>
export default {
  name: 'FLink',
  props: {
    link: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.footer-link {
  color: white !important;
  text-transform: none;
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: 400;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.footer-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>