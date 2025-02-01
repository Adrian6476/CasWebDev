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
            <v-menu>
              <template #activator="{ props }">
                <v-btn icon="mdi-share-variant" v-bind="props"></v-btn>
              </template>
              <v-list>
                <v-list-item v-if="canNativeShare" @click="shareArticle">
                  <template #prepend>
                    <v-icon>mdi-share</v-icon>
                  </template>
                  <v-list-item-title>{{ isEnglish ? 'Share' : '系统分享' }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="copyLink">
                  <template #prepend>
                    <v-icon>mdi-link</v-icon>
                  </template>
                  <v-list-item-title>{{ isEnglish ? 'Copy Link' : '复制链接' }}</v-list-item-title>
                </v-list-item>
                <!-- Chinese Social Media -->
                <template v-if="!isEnglish">
                  <v-list-item target="_blank" :href="getWeiboShareUrl()">
                    <template #prepend>
                      <v-icon>mdi-sina-weibo</v-icon>
                    </template>
                    <v-list-item-title>分享到微博</v-list-item-title>
                  </v-list-item>
                  <v-list-item target="_blank" :href="getQQShareUrl()">
                    <template #prepend>
                      <v-icon>mdi-qqchat</v-icon>
                    </template>
                    <v-list-item-title>分享到QQ</v-list-item-title>
                  </v-list-item>
                </template>

                <!-- English Social Media -->
                <template v-else>
                  <v-list-item target="_blank" :href="getTwitterShareUrl()">
                    <template #prepend>
                      <v-icon>mdi-twitter</v-icon>
                    </template>
                    <v-list-item-title>Share on Twitter</v-list-item-title>
                  </v-list-item>
                  <v-list-item target="_blank" :href="getFacebookShareUrl()">
                    <template #prepend>
                      <v-icon>mdi-facebook</v-icon>
                    </template>
                    <v-list-item-title>Share on Facebook</v-list-item-title>
                  </v-list-item>
                </template>
              </v-list>
            </v-menu>
          </div>
        </div>

        <!-- Article Content -->
        <v-sheet class="article-content py-8">
          <div class="text-body-1" v-html="renderedContent"></div>
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
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { newsApi } from '@/api'
  import { marked } from 'marked'

  const route = useRoute()
  const { locale } = useI18n()
  const snackbar = ref({
    show: false,
    text: '',
    color: 'success'
  })

  const canNativeShare = computed(() => typeof navigator.share !== 'undefined')
  const isEnglish = computed(() => locale.value === 'en')
  const renderedContent = computed(() => {
    if (!article.value?.content) return ''
    return marked(article.value.content)
  })

  // Share Functions
  const showMessage = (text, color = 'success') => {
    snackbar.value = {
      show: true,
      text,
      color
    }
  }

  const copyLink = () => {
    try {
      // 创建临时文本区域
      const el = document.createElement('textarea')
      el.value = window.location.href
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      // 选择文本并复制
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)

      showMessage(isEnglish.value ? 'Link copied to clipboard' : '链接已复制到剪贴板')
    } catch (err) {
      console.error('Failed to copy:', err)
      showMessage(isEnglish.value ? 'Failed to copy link' : '复制链接失败', 'error')
    }
  }

  const getWeiboShareUrl = () => {
    const baseUrl = 'http://service.weibo.com/share/share.php'
    const params = new URLSearchParams({
      url: window.location.href,
      title: article.value?.title || '',
      pic: `https://picsum.photos/400/200?random=${article.value?.id}`,
      appkey: '',
      ralateUid: ''
    })
    return `${baseUrl}?${params.toString()}`
  }

  const getQQShareUrl = () => {
    const baseUrl = 'http://connect.qq.com/widget/shareqq/index.html'
    const params = new URLSearchParams({
      url: window.location.href,
      title: article.value?.title || '',
      desc: article.value?.abstract || '',
      pics: `https://picsum.photos/400/200?random=${article.value?.id}`
    })
    return `${baseUrl}?${params.toString()}`
  }

  const getTwitterShareUrl = () => {
    const baseUrl = 'https://twitter.com/intent/tweet'
    const params = new URLSearchParams({
      url: window.location.href,
      text: article.value?.title || ''
    })
    return `${baseUrl}?${params.toString()}`
  }

  const getFacebookShareUrl = () => {
    const baseUrl = 'https://www.facebook.com/sharer/sharer.php'
    const params = new URLSearchParams({
      u: window.location.href
    })
    return `${baseUrl}?${params.toString()}`
  }

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
  const shareArticle = async () => {
    try {
      await navigator.share({
        title: article.value.title,
        text: article.value.abstract,
        url: window.location.href
      })
      showMessage(isEnglish.value ? 'Shared successfully' : '分享成功')
    } catch (err) {
      console.error('Failed to share:', err)
      if (err.name !== 'AbortError') {
        showMessage(isEnglish.value ? 'Failed to share' : '分享失败', 'error') // 忽略用户取消分享的情况
      }
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

  /* Markdown styles */
  .article-content :deep(h1) {
    font-size: 2em;
    margin-bottom: 1rem;
  }
  .article-content :deep(h2) {
    font-size: 1.5em;
    margin-bottom: 0.875rem;
  }
  .article-content :deep(h3) {
    font-size: 1.25em;
    margin-bottom: 0.75rem;
  }
  .article-content :deep(p) {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
  .article-content :deep(ul),
  .article-content :deep(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }
  .article-content :deep(code) {
    background: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
  .article-content :deep(pre) {
    background: #f5f5f5;
    padding: 1em;
    margin-bottom: 1.5rem;
    overflow-x: auto;
  }
  .article-content :deep(blockquote) {
    border-left: 4px solid #ccc;
    margin: 0;
    padding-left: 1em;
  }
  .article-content :deep(img) {
    max-width: 100%;
    height: auto;
  }
  .article-content :deep(a) {
    color: var(--primary);
    text-decoration: none;
  }
  .article-content :deep(a:hover) {
    text-decoration: underline;
  }
  .article-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
  }
  .article-content :deep(th),
  .article-content :deep(td) {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
  }
  .article-content :deep(th) {
    background: #f5f5f5;
  }
</style>
