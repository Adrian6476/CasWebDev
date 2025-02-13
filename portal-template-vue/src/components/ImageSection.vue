<template>
  <v-container class="image-section py-16">
    <v-row :class="{ 'flex-row-reverse': imageRight }" align="center">
      <!-- Image Column -->
      <v-col cols="12" md="6">
        <v-img
          :src="image"
          :alt="title"
          :width="imageWidth"
          :height="imageHeight"
          :cover="cover"
          :class="imageClass"
        ></v-img>
      </v-col>

      <!-- Content Column -->
      <v-col cols="12" md="6" class="px-md-8">
        <div :class="{ 'text-right': imageRight && alignTextWithImage }">
          <section-title
            :title="title"
            :subtitle="subtitle"
            :centered="false"
            :show-divider="false"
          />

          <div class="text-body-1 mb-6">
            <slot>{{ content }}</slot>
          </div>

          <v-btn
            v-if="buttonText"
            :color="buttonColor"
            :variant="buttonVariant"
            :to="buttonLink"
            :href="buttonHref"
            :target="buttonTarget"
          >
            {{ buttonText }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import SectionTitle from './SectionTitle.vue'

  // Define the props for the component
  defineProps({
    image: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    imageRight: {
      type: Boolean,
      default: false
    },
    alignTextWithImage: {
      type: Boolean,
      default: true
    },
    imageWidth: {
      type: [Number, String],
      default: undefined
    },
    imageHeight: {
      type: [Number, String],
      default: undefined
    },
    cover: {
      type: Boolean,
      default: true
    },
    imageClass: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: ''
    },
    buttonColor: {
      type: String,
      default: 'primary'
    },
    buttonVariant: {
      type: String,
      default: 'tonal'
    },
    buttonLink: {
      type: String,
      default: ''
    },
    buttonHref: {
      type: String,
      default: ''
    },
    buttonTarget: {
      type: String,
      default: '_self'
    }
  })
</script>

<style scoped>
  .image-section {
    overflow: hidden;
  }
</style>
