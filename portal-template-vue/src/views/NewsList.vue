<template>
  <div>
    <!-- Banner Section -->
    <section class="news-banner">
      <v-parallax src="https://picsum.photos/1920/1080?random=3">
        <div
          class="d-flex flex-column align-center justify-center text-white text-center fill-height"
        >
          <h1 class="text-h2 font-weight-bold mb-4">{{ $t('news.title') }}</h1>
          <div class="text-h5 mb-8">{{ $t('news.subtitle') }}</div>
        </div>
      </v-parallax>
    </section>

    <!-- News List Section -->
    <v-container class="py-8">
      <!-- Categories and Search -->
      <v-row class="mb-3 align-center" style="min-height: 48px">
        <v-col cols="12" md="8" class="py-2">
          <v-chip-group v-model="selectedCategory" selected-class="primary" class="mt-n1">
            <v-chip
              v-for="category in categories"
              :key="category.value"
              :value="category.value"
              filter
            >
              {{ category.label }}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col cols="12" md="4" class="py-2">
          <v-text-field
            v-model="searchQuery"
            :label="$t('news.search')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            class="mt-n1"
            bg-color="surface"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <!-- News List -->
      <v-row v-else class="mt-n2">
        <v-col v-for="article in filteredNews" :key="article.id" cols="12" sm="6" md="4">
          <news-card
            :title="article.title"
            :abstract="article.abstract"
            :cover="article.cover"
            :date="article.date"
            :category="article.category"
            :link="`/news/${article.id}`"
          />
        </v-col>
      </v-row>

      <!-- Load More -->
      <v-row v-if="hasMore" class="mt-8">
        <v-col cols="12" class="text-center">
          <v-btn
            color="primary"
            variant="outlined"
            size="large"
            :loading="loadingMore"
            @click="loadMore"
          >
            {{ $t('news.loadMore') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import NewsCard from '@/components/NewsCard.vue'
  import { newsApi } from '@/api'

  const { t } = useI18n()

  // State
  const loading = ref(true)
  const loadingMore = ref(false)
  const page = ref(1)
  const newsList = ref([])
  const searchQuery = ref('')
  const selectedCategory = ref(null)

  // Categories
  const categories = [
    { label: t('news.categories.all'), value: null },
    { label: t('news.categories.product'), value: 'Product' },
    { label: t('news.categories.company'), value: 'Company' },
    { label: t('news.categories.technology'), value: 'Technology' }
  ]

  // Computed
  const filteredNews = computed(() => {
    let filtered = [...newsList.value]

    // Filter by category
    if (selectedCategory.value) {
      filtered = filtered.filter(article => article.category === selectedCategory.value)
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        article =>
          article.title.toLowerCase().includes(query) ||
          article.abstract.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  const hasMore = computed(() => newsList.value.length % 9 === 0)

  // Methods
  const fetchNews = async (currentPage = 1) => {
    try {
      loading.value = true
      const data = await newsApi.getNewsList(currentPage, 9)
      // Transform the data
      const formattedNews = data.map(item => ({
        id: item.id,
        title: item.title,
        abstract: item.body.substring(0, 120) + '...',
        cover: `https://picsum.photos/400/300?random=${item.id}`,
        date: new Date().toISOString(),
        category: ['Product', 'Company', 'Technology'][Math.floor(Math.random() * 3)]
      }))

      if (currentPage === 1) {
        newsList.value = formattedNews
      } else {
        newsList.value = [...newsList.value, ...formattedNews]
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  const loadMore = async () => {
    loadingMore.value = true
    page.value++
    await fetchNews(page.value)
  }

  // Watch for filters change
  watch(
    [searchQuery, selectedCategory],
    () => {
      // Reset pagination when filters change
      if (page.value !== 1) {
        page.value = 1
        fetchNews(1)
      }
    },
    { deep: true }
  )

  // Initial fetch
  onMounted(() => {
    fetchNews()
  })
</script>

<style scoped>
  .news-banner {
    height: 40vh;
    min-height: 300px;
  }
</style>
