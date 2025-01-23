<template>
  <div class="news-list">
    <v-row>
      <v-col
        v-for="news in displayedNews"
        :key="news.id"
        cols="12"
        sm="6"
        md="4"
      >
        <news-card
          :title="news.title"
          :abstract="news.abstract"
          :cover="news.cover"
          :date="news.date"
          :category="news.category"
          :link="`/news/${news.id}`"
        />
      </v-col>
    </v-row>

    <!-- Load More Button -->
    <div v-if="hasMore" class="text-center mt-8">
      <v-btn
        color="primary"
        variant="outlined"
        size="large"
        :loading="loading"
        @click="loadMore"
      >
        {{ $t('news.loadMore') }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NewsCard from './NewsCard.vue'

const props = defineProps({
  news: {
    type: Array,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 6
  }
})

const currentPage = ref(1)
const loading = ref(false)

const displayedNews = computed(() => {
  return props.news.slice(0, currentPage.value * props.itemsPerPage)
})

const hasMore = computed(() => {
  return displayedNews.value.length < props.news.length
})

const loadMore = async () => {
  loading.value = true
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 500))
  currentPage.value++
  loading.value = false
}
</script>
