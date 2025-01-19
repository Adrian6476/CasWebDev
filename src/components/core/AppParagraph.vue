<!-- src/components/core/AppParagraph.vue -->
<template>
  <v-container class="paragraph-container">
    <v-row>
      <v-col cols="12">
        <p class="body-1">{{ text }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AppParagraph', // Updated component name
  props: {
    text: {
      type: String,
      default: 'This is a paragraph component. It can be used to display blocks of text throughout the portal.',
    },
  },
};
</script>

<style scoped>
.paragraph-container {
  margin-bottom: 16px;
}
.body-1 {
  font-size: 1rem;
  line-height: 1.5;
}
</style>
