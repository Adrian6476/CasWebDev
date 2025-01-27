<template>
  <div>
    <v-container>
      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 400px">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="d-flex flex-column justify-center align-center"
        style="min-height: 400px"
      >
        <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
        <div class="text-h6">{{ error }}</div>
        <v-btn color="primary" class="mt-4" to="/news"> Back to News </v-btn>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Article Header -->
        <div class="article-header py-8">
          <div class="d-flex align-center mb-4">
            <span class="text-primary">{{ category }}</span>
            <v-divider vertical class="mx-4"></v-divider>
            <span class="text-grey">{{ formatDate(article.date) }}</span>
          </div>
          <h1 class="text-h3 font-weight-bold mb-4">{{ article.title }}</h1>
          <div class="d-flex align-center">
            <v-avatar size="40" class="mr-4">
              <v-img :src="`https://picsum.photos/100/100?random=${article.id}`"></v-img>
            </v-avatar>
            <span class="text-subtitle-1">{{ article.author || 'Anonymous' }}</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-share-variant" @click="shareArticle"></v-btn>
          </div>
        </div>

        <!-- Article Content -->
        <v-sheet class="article-content py-8">
          <div class="text-body-1">
            {{ article.content }}
          </div>
        </v-sheet>

        <!-- Related Articles -->
        <div v-if="relatedArticles.length" class="related-articles py-8">
          <v-divider class="mb-8"></v-divider>
          <h2 class="text-h5 mb-6">{{ $t('news.relatedArticles') }}</h2>
          <v-row>
            <v-col
              v-for="relatedArticle in relatedArticles"
              :key="relatedArticle.id"
              cols="12"
              md="4"
            >
              <v-card :to="`/news/${relatedArticle.id}`" class="h-100">
                <v-img
                  height="200"
                  :src="`https://picsum.photos/400/200?random=${relatedArticle.id}`"
                  cover
                ></v-img>
                <v-card-title>{{ relatedArticle.title }}</v-card-title>
                <v-card-text>
                  {{ relatedArticle.abstract }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-container>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { newsApi } from '@/api'

  const route = useRoute()

  const article = ref(null)
  const relatedArticles = ref([])
  const loading = ref(true)
  const error = ref(null)
  const category = ref('News') // This would come from API in real app

  // Format date
  const formatDate = dateString => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // Share article
  const shareArticle = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.value.title,
          text: article.value.abstract,
          url: window.location.href
        })
        .catch(console.error)
    }
  }

  // Fetch article and related articles
  const fetchArticleData = async () => {
    try {
      loading.value = true
      error.value = null

      // Get article ID from route
      const id = route.params.id

      // Fetch article detail
      const articleData = await newsApi.getNewsDetail(id)
      article.value = {
        ...articleData,
        date: new Date().toISOString(), // Mock date
        content: articleData.body, // Use body as content
        abstract: articleData.body.substring(0, 120) + '...'
      }

      // Fetch related articles
      const relatedData = await newsApi.getRelatedNews(id)
      relatedArticles.value = relatedData.map(item => ({
        id: item.id,
        title: item.title,
        abstract: item.body.substring(0, 120) + '...',
        date: new Date().toISOString()
      }))
    } catch (err) {
      console.error('Failed to fetch article:', err)
      error.value = 'Failed to load the article. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchArticleData()
  })
</script>

<style scoped>
  .article-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .article-content p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
</style>
