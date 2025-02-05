<template>
  <div>
    <!-- Hero Banner with Carousel -->
    <section class="hero-section">
      <v-carousel
        v-model="currentSlide"
        cycle
        height="100%"
        hide-delimiter-background
        :show-arrows="false"
      >
        <v-carousel-item
          v-for="(slide, index) in carouselSlides"
          :key="index"
          :src="`https://picsum.photos/1920/1080?random=${index + 1}`"
          cover
        >
          <div
            class="d-flex flex-column align-center justify-center text-white text-center fill-height carousel-content"
          >
            <h1 class="text-h2 font-weight-bold mb-4">{{ slide.title }}</h1>
            <div class="text-h5 mb-8">{{ slide.description }}</div>
            <v-btn color="primary" size="x-large" rounded :to="`/products/${slide.productId}`">
              {{ $t('home.hero.learnMore') }}
            </v-btn>
          </div>
        </v-carousel-item>
      </v-carousel>
    </section>

    <!-- About Section -->
    <section>
      <image-section
        :title="$t('home.about.productTitle')"
        :subtitle="$t('home.about.productSubtitle')"
        :content="$t('home.about.description')"
        image="https://picsum.photos/800/600?random=1"
        :button-text="$t('home.about.learnMore')"
        button-link="/about"
      />
    </section>

    <!-- Features Section -->
    <section class="features-section theme-section">
      <v-container class="py-16">
        <section-title
          :title="$t('home.features.title')"
          :subtitle="$t('home.features.subtitle')"
          centered
        />

        <v-row class="mt-8">
          <v-col v-for="feature in features" :key="feature.title" cols="12" md="4">
            <v-card class="h-100 feature-card" elevation="2">
              <v-card-item class="text-center pa-6">
                <v-icon :icon="feature.icon" size="64" color="primary" class="mb-6"></v-icon>
                <v-card-title class="text-h5 font-weight-bold mb-4 pt-2">
                  {{ feature.title }}
                </v-card-title>
                <v-card-text class="text-body-1">
                  {{ feature.description }}
                </v-card-text>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- News Section -->
    <section class="news-section">
      <v-container class="py-16">
        <section-title :title="$t('news.title')" :subtitle="$t('news.subtitle')" centered />

        <news-list :news="latestNews" :items-per-page="6" />
      </v-container>
    </section>

    <!-- Team Section -->
    <section class="team-section theme-section">
      <v-container class="py-16">
        <section-title
          :title="$t('home.team.title')"
          :subtitle="$t('home.team.subtitle')"
          centered
        />

        <v-row class="mt-8">
          <v-col v-for="member in teamMembers" :key="member.name" cols="12" sm="6" md="3">
            <v-card class="text-center h-100">
              <v-avatar size="120" class="mt-4">
                <v-img :src="member.avatar" />
              </v-avatar>

              <v-card-title class="justify-center">
                {{ member.name }}
              </v-card-title>

              <v-card-subtitle>
                {{ member.position }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ImageSection from '@/components/ImageSection.vue'
  import SectionTitle from '@/components/SectionTitle.vue'
  import NewsList from '@/components/NewsList.vue'
  import { newsApi, teamApi } from '@/api'

  const { t } = useI18n()
  const currentSlide = ref(0)

  // Carousel slides data
  const carouselSlides = [
    {
      title: '高性能工作站',
      description: '专业级工作站，为创意工作者打造',
      productId: 1
    },
    {
      title: '智能监控系统',
      description: '先进的AI监控解决方案',
      productId: 2
    },
    {
      title: '云存储服务器',
      description: '高可靠性企业级存储方案',
      productId: 3
    }
  ]

  // Features data - reactive to language changes
  const features = computed(() => [
    {
      icon: 'mdi-rocket-launch',
      title: t('home.features.items.fast.title'),
      description: t('home.features.items.fast.description')
    },
    {
      icon: 'mdi-shield-check',
      title: t('home.features.items.secure.title'),
      description: t('home.features.items.secure.description')
    },
    {
      icon: 'mdi-responsive',
      title: t('home.features.items.responsive.title'),
      description: t('home.features.items.responsive.description')
    }
  ])

  // News data
  const latestNews = ref([])
  const loading = ref(false)

  // Team members data
  const teamMembers = ref([])

  // Fetch news data
  const fetchNews = async () => {
    try {
      loading.value = true
      const data = await newsApi.getNewsList(1, 6)
      // Transform the data to match our news card format
      latestNews.value = data.map(item => ({
        id: item.id,
        title: item.title,
        abstract: item.body.substring(0, 120) + '...',
        cover: `https://picsum.photos/400/300?random=${item.id}`,
        date: new Date().toISOString(), // Since JSONPlaceholder doesn't provide dates
        category: ['Product', 'Company', 'Technology'][Math.floor(Math.random() * 3)] // Random category for demo
      }))
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      const data = await teamApi.getTeamMembers()
      // Transform the data to match our team member format
      teamMembers.value = data.map(item => ({
        name: item.name,
        position: item.company.bs,
        avatar: `https://picsum.photos/200/200?random=${item.id}`
      }))
    } catch (error) {
      console.error('Failed to fetch team members:', error)
    }
  }

  onMounted(() => {
    fetchNews()
    fetchTeamMembers()
  })
</script>

<style scoped>
  .hero-section {
    height: calc(100vh - 64px);
    min-height: 500px;
    position: relative;
  }

  .hero-section :deep(.v-carousel) {
    height: 100% !important;
  }

  .carousel-content {
    position: relative;
    z-index: 1;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6));
    height: 100%;
    padding: 0 1rem;
  }

  /* 自定义轮播指示器样式 */
  .hero-section :deep(.v-carousel__controls) {
    background: none;
    padding-bottom: 32px;
  }

  .hero-section :deep(.v-carousel__controls > .v-btn) {
    min-width: 24px;
    width: 24px;
    height: 3px;
    margin: 0 4px;
    padding: 0;
    border-radius: 1.5px;
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 1;
    transform: none !important;
  }

  .hero-section :deep(.v-carousel__controls > .v-btn--active) {
    background: white;
    width: 48px;
    transform: none !important;
  }

  /* 隐藏默认按钮样式 */
  .hero-section :deep(.v-carousel__controls > .v-btn::before),
  .hero-section :deep(.v-carousel__controls > .v-btn::after),
  .hero-section :deep(.v-carousel__controls > .v-btn .v-btn__content),
  .hero-section :deep(.v-carousel__controls > .v-btn .v-btn__overlay) {
    display: none;
  }

  /* 移动端优化 */
  @media (max-width: 600px) {
    .hero-section {
      height: calc(100vh - 64px);
      min-height: 400px;
    }
  }

  /* 平板设备优化 */
  @media (min-width: 601px) and (max-width: 960px) {
    .hero-section {
      height: calc(100vh - 64px);
      min-height: 450px;
    }
  }

  .theme-section {
    background-color: rgb(var(--v-theme-surface));
  }

  /* 浅色模式下使用柔和的灰色 */
  .v-theme--light .theme-section {
    background-color: #f8f8f8;
  }

  .feature-card {
    transition: all 0.3s ease;
    background-color: rgba(var(--v-theme-surface), 0.9); /* 使用主题surface颜色 */
    backdrop-filter: blur(10px); /* 添加模糊效果 */
    border: 1px solid rgba(var(--v-theme-on-surface), 0.1); /* 使用主题on-surface颜色 */
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* 添加悬停阴影 */
  }

  /* Team member card styling */
  .team-section .v-card {
    padding-bottom: 16px;
    background-color: rgba(var(--v-theme-surface), 0.9); /* 使用主题surface颜色 */
    backdrop-filter: blur(8px); /* 模糊效果 */
    border: 1px solid rgba(var(--v-theme-on-surface), 0.1); /* 使用主题on-surface颜色 */
  }

  .team-section .v-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 悬停阴影 */
  }

  .team-section .v-card-subtitle {
    margin-bottom: 16px;
  }
</style>
