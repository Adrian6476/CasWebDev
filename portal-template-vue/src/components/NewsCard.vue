<template>
  <v-card
    :elevation="hover ? 4 : 1"
    class="news-card h-100"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Cover Image -->
    <v-img :src="cover" :height="imageHeight" cover class="news-card-image">
      <!-- Date -->
      <v-card-subtitle class="date-badge text-grey-darken-2">
        {{ formatDate(date) }}
      </v-card-subtitle>

      <!-- Category Badge -->
      <v-chip color="primary" label size="small" class="category-badge ma-4">
        {{ $t(`news.categories.${category.toLowerCase()}`) }}
      </v-chip>
    </v-img>

    <v-card-item class="pa-4 pb-0">
      <!-- Title -->
      <v-card-title class="text-h6 pa-0 mb-3 news-title">
        {{ title }}
      </v-card-title>

      <!-- Abstract -->
      <v-card-text class="pa-0 text-body-2 text-grey-darken-1">
        {{ abstract }}
      </v-card-text>
    </v-card-item>

    <v-card-actions class="px-4 pb-4">
      <v-btn variant="text" color="primary" :to="link" class="px-0">
        {{ $t('news.readMore') }}
        <v-icon class="ml-2">mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue'

  const hover = ref(false)

  defineProps({
    title: {
      type: String,
      required: true
    },
    abstract: {
      type: String,
      required: true
    },
    cover: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: ''
    },
    imageHeight: {
      type: [String, Number],
      default: 200
    }
  })

  const formatDate = dateString => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    } catch (e) {
      return dateString
    }
  }
</script>

<style scoped>
  .news-card {
    transition: all 0.3s ease-in-out;
  }

  .category-badge {
    position: absolute;
    top: 0;
    left: 0;
  }

  .date-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 0 0 0 8px;
    padding: 8px 16px;
  }

  .news-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .v-card-text {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
