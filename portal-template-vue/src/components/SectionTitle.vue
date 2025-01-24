<template>
  <div class="section-title" :class="{ centered }">
    <h2 class="text-h4 font-weight-bold mb-3" :class="titleClass">
      {{ title }}
    </h2>
    <div v-if="subtitle" class="text-subtitle-1 text-medium-emphasis" :class="subtitleClass">
      {{ subtitle }}
    </div>
    <v-divider
      v-if="showDivider"
      :class="[centered ? 'mx-auto' : '', 'mt-4']"
      :width="dividerWidth"
    ></v-divider>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  centered: {
    type: Boolean,
    default: false
  },
  showDivider: {
    type: Boolean,
    default: true
  },
  dividerWidth: {
    type: [Number, String],
    default: 100
  },
  titleClass: {
    type: String,
    default: ''
  },
  subtitleClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.section-title {
  margin-bottom: var(--section-spacing);
}

.section-title.centered {
  text-align: center;
}
</style>
