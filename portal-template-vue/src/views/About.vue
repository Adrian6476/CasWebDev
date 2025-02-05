<template>
  <div>
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top"
    >
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Banner Section -->
    <section v-if="!isMobile" class="about-banner">
      <v-parallax src="/src/assets/about-us.jpg">
        <div
          class="d-flex flex-column align-center justify-center text-white text-center fill-height"
        >
          <h1 class="text-h2 font-weight-bold mb-4">{{ $t('about.title') }}</h1>
          <div class="text-h5 mb-8">{{ $t('about.subtitle') }}</div>
        </div>
      </v-parallax>
    </section>

    <!-- Company Info Section -->
    <v-container class="py-16">
      <!-- About Us Section -->
      <v-row class="mb-16">
        <v-col cols="12" md="6" class="d-flex flex-column">
          <div class="about-content h-100">
            <SectionTitle :title="$t('about.company.title')" />
            <div class="text-body-1 mb-8">
              {{ $t('about.company.description') }}
            </div>
            <v-row>
              <v-col v-for="stat in companyStats" :key="stat.label" cols="6">
                <v-card class="pa-4 text-center" variant="outlined">
                  <div class="text-h4 font-weight-bold primary--text mb-2">{{ stat.value }}</div>
                  <div class="text-subtitle-1">{{ stat.label }}</div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="d-flex align-center">
          <div class="about-image-wrapper">
            <v-img src="/src/assets/about-us.jpg" cover class="rounded-lg" :height="450"></v-img>
          </div>
        </v-col>
      </v-row>

      <!-- Vision & Mission Section -->
      <v-row class="mb-16">
        <v-col cols="12">
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="h-100 pa-6" variant="outlined">
                <v-card-item>
                  <v-icon icon="mdi-eye" size="36" color="primary" class="mb-4"></v-icon>
                  <v-card-title class="text-h5 mb-4">{{ $t('about.vision.title') }}</v-card-title>
                  <v-card-text class="text-body-1">
                    {{ $t('about.vision.description') }}
                  </v-card-text>
                </v-card-item>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="h-100 pa-6" variant="outlined">
                <v-card-item>
                  <v-icon icon="mdi-flag" size="36" color="primary" class="mb-4"></v-icon>
                  <v-card-title class="text-h5 mb-4">{{ $t('about.mission.title') }}</v-card-title>
                  <v-card-text class="text-body-1">
                    {{ $t('about.mission.description') }}
                  </v-card-text>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Team Section -->
    <section class="team-section theme-section">
      <v-container class="py-16">
        <SectionTitle
          :title="$t('about.team.title')"
          :subtitle="$t('about.team.description')"
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

    <!-- Contact Section -->
    <v-container class="py-16">
      <v-row>
        <v-col cols="12" md="6">
          <SectionTitle :title="$t('about.contact.title')" />
          <v-list>
            <v-list-item>
              <template #prepend>
                <v-icon color="primary" icon="mdi-map-marker"></v-icon>
              </template>
              <v-list-item-title>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=123+Business+Street,+Suite+100,+City,+Country"
                  target="_blank"
                  class="text-decoration-none text-primary-darken-1"
                >
                  {{ $t('about.contact.address') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=123+Business+Street,+Suite+100,+City,+Country"
                  target="_blank"
                  class="text-decoration-none text-primary-darken-1"
                >
                  123 Business Street, Suite 100, City, Country
                </a>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="primary" icon="mdi-phone"></v-icon>
              </template>
              <v-list-item-title>
                <a href="tel:+1234567890" class="text-decoration-none text-primary-darken-1">
                  {{ $t('about.contact.phone') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                <a href="tel:+1234567890" class="text-decoration-none text-primary-darken-1">
                  +1 234 567 890
                </a>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="primary" icon="mdi-email"></v-icon>
              </template>
              <v-list-item-title>
                <a
                  href="mailto:contact@company.com"
                  class="text-decoration-none text-primary-darken-1"
                >
                  {{ $t('about.contact.email') }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                <a
                  href="mailto:contact@company.com"
                  class="text-decoration-none text-primary-darken-1"
                >
                  contact@company.com
                </a>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <!-- Social Media Links -->
          <div class="mt-8">
            <h3 class="text-h6 mb-4">{{ $t('about.social.title') }}</h3>
            <div class="d-flex gap-4">
              <v-btn
                icon="mdi-facebook"
                variant="text"
                color="primary"
                href="https://www.facebook.com"
                target="_blank"
              ></v-btn>
              <v-btn
                icon="mdi-twitter"
                variant="text"
                color="primary"
                href="https://x.com"
                target="_blank"
              ></v-btn>
              <v-btn
                icon="mdi-linkedin"
                variant="text"
                color="primary"
                href="https://www.linkedin.com"
                target="_blank"
              ></v-btn>
              <v-btn
                icon="mdi-instagram"
                variant="text"
                color="primary"
                href="https://www.instagram.com"
                target="_blank"
              ></v-btn>
            </div>
          </div>
        </v-col>

        <!-- Contact Form -->
        <v-col cols="12" md="6">
          <h3 class="text-h6 mb-4">{{ $t('about.contact.formTitle') }}</h3>
          <v-form ref="form" v-model="formValid" @submit.prevent="submitForm">
            <v-text-field
              v-model="formData.name"
              :label="$t('about.contact.form.name')"
              :rules="rules.name"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="formData.email"
              :label="$t('about.contact.form.email')"
              :rules="rules.email"
              type="email"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            <v-textarea
              v-model="formData.message"
              :label="$t('about.contact.form.message')"
              :rules="rules.message"
              variant="outlined"
              rows="5"
              class="mb-4"
            ></v-textarea>
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              :disabled="!formValid || loading"
            >
              {{ $t('about.contact.form.send') }}
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { contactApi, teamApi } from '@/api'
  import { useDevice } from '@/composables/useDevice'
  import SectionTitle from '@/components/SectionTitle.vue'

  const { isMobile } = useDevice()

  const snackbar = ref({
    visible: false,
    message: '',
    color: 'success',
    timeout: 3000
  })

  const { t } = useI18n()

  const form = ref(null)
  const formValid = ref(false)
  const loading = ref(false)
  const formData = ref({
    name: '',
    email: '',
    message: ''
  })

  // Company stats data
  const companyStats = ref([
    { label: t('about.stats.experience'), value: '10+' },
    { label: t('about.stats.clients'), value: '1000+' },
    { label: t('about.stats.projects'), value: '500+' },
    { label: t('about.stats.awards'), value: '50+' }
  ])

  // Team members data
  const teamMembers = ref([])

  // Form rules
  const rules = {
    name: [
      v => !!v || t('about.contact.form.nameRequired'),
      v => v.length >= 2 || t('about.contact.form.nameLength')
    ],
    email: [
      v => !!v || t('about.contact.form.emailRequired'),
      v => /.+@.+\..+/.test(v) || t('about.contact.form.emailValid')
    ],
    message: [
      v => !!v || t('about.contact.form.messageRequired'),
      v => v.length >= 10 || t('about.contact.form.messageLength')
    ]
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

  const submitForm = async () => {
    const { valid } = await form.value.validate()

    if (valid) {
      try {
        loading.value = true
        await contactApi.sendContactForm(formData.value)

        // Reset form after successful submission
        form.value.reset()
        formData.value = {
          name: '',
          email: '',
          message: ''
        }

        // Show success message
        snackbar.value = {
          visible: true,
          message: t('about.contact.form.success'),
          color: 'success',
          timeout: 3000
        }
      } catch (error) {
        console.error('Failed to send message:', error)
        snackbar.value = {
          visible: true,
          message: t('about.contact.form.error'),
          color: 'error',
          timeout: 3000
        }
      } finally {
        loading.value = false
      }
    }
  }

  onMounted(() => {
    fetchTeamMembers()
  })
</script>

<style scoped>
  .about-banner {
    height: 60vh;
    min-height: 400px;
  }

  /* Fix gap utility class for older browsers */
  .gap-4 {
    gap: 1rem;
  }

  .theme-section {
    background-color: rgb(var(--v-theme-surface));
  }

  /* 浅色模式下使用柔和的灰色 */
  .v-theme--light .theme-section {
    background-color: #f8f8f8;
  }

  /* Team member card styling */
  .team-section .v-card {
    padding-bottom: 16px;
    background-color: rgba(var(--v-theme-surface), 0.9);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
    transition: all 0.3s ease;
  }

  .team-section .v-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .team-section .v-card-subtitle {
    margin-bottom: 16px;
  }

  .about-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 450px;
  }

  .about-image-wrapper {
    width: 100%;
    height: 450px;
  }
</style>
