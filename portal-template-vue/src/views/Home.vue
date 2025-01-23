<template>
  <div>
    <!-- Hero Banner -->
    <section class="hero-section">
      <v-parallax src="https://picsum.photos/1920/1080?random">
        <div class="d-flex flex-column align-center justify-center text-white text-center fill-height">
          <h1 class="text-h2 font-weight-bold mb-4">{{ $t('home.hero.title') }}</h1>
          <div class="text-h5 mb-8">{{ $t('home.hero.slogan') }}</div>
          <v-btn
            color="primary"
            size="x-large"
            rounded
          >
            {{ $t('home.hero.getStarted') }}
          </v-btn>
        </div>
      </v-parallax>
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
    <section class="features-section bg-grey-lighten-4">
      <v-container class="py-16">
        <section-title
          :title="$t('home.features.title')"
          :subtitle="$t('home.features.subtitle')"
          centered
        />
        
        <v-row class="mt-8">
          <v-col
            v-for="feature in features"
            :key="feature.title"
            cols="12"
            md="4"
          >
            <v-card class="h-100 feature-card" elevation="2">
              <v-card-item class="text-center pa-6">
                <v-icon
                  :icon="feature.icon"
                  size="64"
                  color="primary"
                  class="mb-6"
                ></v-icon>
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
        <section-title
          :title="$t('news.title')"
          :subtitle="$t('news.subtitle')"
          centered
        />
        
        <news-list
          :news="latestNews"
          :items-per-page="6"
        />
      </v-container>
    </section>

    <!-- Team Section -->
    <section class="team-section bg-grey-lighten-4">
      <v-container class="py-16">
        <section-title
          :title="$t('home.team.title')"
          :subtitle="$t('home.team.subtitle')"
          centered
        />
        
        <v-row class="mt-8">
          <v-col
            v-for="member in teamMembers"
            :key="member.name"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card class="text-center h-100">
              <v-avatar
                size="120"
                class="mt-4"
              >
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
  height: 100vh;
  min-height: 600px;
}

.features-section, .team-section {
  background-color: var(--v-grey-lighten-4);
}

.feature-card {
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

/* Team member card styling */
.team-section .v-card {
  padding-bottom: 16px;
}

.team-section .v-card-subtitle {
  margin-bottom: 16px;
}
</style>
