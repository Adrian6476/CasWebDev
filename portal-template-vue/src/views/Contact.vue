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
    <section v-if="!isMobile" class="contact-banner">
      <v-parallax src="https://picsum.photos/1920/1080?random=2">
        <div
          class="d-flex flex-column align-center justify-center text-white text-center fill-height"
        >
          <h1 class="text-h2 font-weight-bold mb-4">{{ $t('contact.title') }}</h1>
          <div class="text-h5 mb-8">{{ $t('contact.subtitle') }}</div>
          <v-btn color="primary" size="x-large" rounded @click="scrollToForm">
            {{ $t('contact.form.getInTouch') }}
          </v-btn>
        </div>
      </v-parallax>
    </section>

    <!-- Contact Form Section -->
    <v-container id="contact-form" class="py-16">
      <v-row>
        <v-col cols="12" md="6">
          <h2 class="text-h4 mb-6">{{ $t('contact.form.title') }}</h2>
          <v-form ref="form" v-model="formValid" @submit.prevent="submitForm">
            <v-text-field
              v-model="formData.name"
              :label="$t('contact.form.name')"
              :rules="rules.name"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="formData.email"
              :label="$t('contact.form.email')"
              :rules="rules.email"
              type="email"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            <v-textarea
              v-model="formData.message"
              :label="$t('contact.form.message')"
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
              {{ $t('contact.form.send') }}
            </v-btn>
          </v-form>
        </v-col>
        <v-col cols="12" md="6">
          <h2 class="text-h4 mb-6">{{ $t('contact.info.title') }}</h2>
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
                  {{ $t('contact.info.address') }}
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
                  {{ $t('contact.info.phone') }}
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
                  {{ $t('contact.info.email') }}
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
            <h3 class="text-h6 mb-4">{{ $t('contact.social.title') }}</h3>
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
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { contactApi } from '@/api'
  import { useDevice } from '@/composables/useDevice'

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

  // Form rules
  const rules = {
    name: [
      v => !!v || t('contact.form.nameRequired'),
      v => v.length >= 2 || t('contact.form.nameLength')
    ],
    email: [
      v => !!v || t('contact.form.emailRequired'),
      v => /.+@.+\..+/.test(v) || t('contact.form.emailValid')
    ],
    message: [
      v => !!v || t('contact.form.messageRequired'),
      v => v.length >= 10 || t('contact.form.messageLength')
    ]
  }

  // Submit form
  const scrollToForm = () => {
    const formSection = document.getElementById('contact-form')
    if (formSection) {
      formSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
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
          message: t('contact.form.success'),
          color: 'success',
          timeout: 3000
        }
      } catch (error) {
        console.error('Failed to send message:', error)
        snackbar.value = {
          visible: true,
          message: t('contact.form.error'),
          color: 'error',
          timeout: 3000
        }
      } finally {
        loading.value = false
      }
    }
  }
</script>

<style scoped>
  .contact-banner {
    height: 60vh;
    min-height: 400px;
  }

  /* Fix gap utility class for older browsers */
  .gap-4 {
    gap: 1rem;
  }
</style>
