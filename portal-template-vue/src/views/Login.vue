<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-6">
          <v-card-title class="text-center text-h5 font-weight-bold mb-4">
            {{ $t('auth.login') }}
          </v-card-title>
          <v-form @submit.prevent="handleLogin" ref="form">
            <v-text-field
              v-model="email"
              :label="$t('auth.email')"
              type="email"
              :rules="[
                v => !!v || $t('auth.emailRequired'),
                v => /.+@.+\..+/.test(v) || $t('contact.form.emailValid')
              ]"
              required
              variant="outlined"
              prepend-inner-icon="mdi-email"
            />
            <v-text-field
              v-model="password"
              :label="$t('auth.password')"
              :type="showPassword ? 'text' : 'password'"
              :rules="[v => !!v || $t('auth.passwordRequired')]"
              required
              variant="outlined"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
            />
            <v-checkbox
              v-model="rememberMe"
              :label="$t('auth.rememberMe')"
              color="primary"
              hide-details
              class="mb-4"
            />
            <v-btn
              type="submit"
              color="primary"
              block
              :loading="loading"
              class="mb-4"
            >
              {{ $t('auth.signIn') }}
            </v-btn>
          </v-form>
          <v-divider class="mb-4" />
          <div class="text-center">
            <router-link to="/auth/forgot-password" class="text-decoration-none mb-4 d-block">
              {{ $t('auth.forgotPassword') }}
            </router-link>
            <v-btn
              variant="text"
              color="primary"
              :to="{ name: 'register' }"
              class="mt-2"
            >
              {{ $t('auth.noAccount') }} {{ $t('auth.signUp') }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const form = ref(null)
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    })
    router.push({ name: 'home' })
  } catch (error) {
    // Handle error
  } finally {
    loading.value = false
  }
}
</script>
