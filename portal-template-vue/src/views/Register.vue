<template>
  <v-container class="fill-height">
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
    </v-snackbar>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-6">
          <v-card-title class="text-center text-h5 font-weight-bold mb-4">
            {{ $t('auth.createAccount') }}
          </v-card-title>
          <v-form @submit.prevent="handleRegister" ref="form">
            <v-text-field
              v-model="username"
              :label="$t('auth.username')"
              :rules="[v => !!v || $t('auth.usernameRequired')]"
              required
              variant="outlined"
              prepend-inner-icon="mdi-account"
              class="mb-4"
            />
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
              :rules="[
                v => !!v || $t('auth.passwordRequired'),
                v => v.length >= 8 || $t('auth.passwordRequirements')
              ]"
              required
              variant="outlined"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
            />
            <v-text-field
              v-model="confirmPassword"
              :label="$t('auth.confirmPassword')"
              :type="showConfirmPassword ? 'text' : 'password'"
              :rules="[
                v => !!v || $t('auth.passwordRequired'),
                v => v === password || $t('auth.passwordMatch')
              ]"
              required
              variant="outlined"
              prepend-inner-icon="mdi-lock-check"
              :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
            />
            <v-btn
              type="submit"
              color="primary"
              block
              :loading="loading"
              class="mb-4"
            >
              {{ $t('auth.signUp') }}
            </v-btn>
          </v-form>
          <v-divider class="mb-4" />
          <div class="text-center">
            <v-btn
              variant="text"
              color="primary"
              :to="{ name: 'login' }"
            >
              {{ $t('auth.haveAccount') }} {{ $t('auth.signIn') }}
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

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const form = ref(null)
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const snackbar = ref({
  visible: false,
  message: '',
  color: 'success',
  timeout: 10000
})

const handleRegister = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value
    }, t)
    
    // 如果注册成功
    snackbar.value = {
      visible: true,
      message: t('auth.accountCreated'),
      color: 'success',
      timeout: 10000
    }
    
    // 等待提示显示完成后再跳转
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 1000)
  } catch (error) {
    console.error('Registration error:', error)
    snackbar.value = {
      visible: true,
      message: error.message || t('auth.registrationError'),
      color: 'error',
      timeout: 10000
    }
  } finally {
    loading.value = false
  }
}
</script>
