<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- Loading overlay -->
        <v-overlay
          :model-value="isLoading"
          class="align-center justify-center"
        >
          <v-progress-circular
            color="primary"
            indeterminate
            size="64"
          ></v-progress-circular>
        </v-overlay>

        <v-card class="mx-auto pa-6">
          <h2 class="text-h5 mb-6">{{ i18n.t('settings.title') }}</h2>

          <!-- Theme Settings -->
          <v-card-text>
            <h3 class="text-h6 mb-4">{{ i18n.t('settings.appearance') }}</h3>
            
            <!-- Follow System Theme -->
            <v-switch
              v-model="isFollowingSystemTheme"
              :label="i18n.t('settings.followSystemTheme')"
              color="primary"
              class="mb-4"
              @update:model-value="() => showNotification(i18n.t('settings.updated'))"
            ></v-switch>

            <!-- Dark Mode -->
            <v-switch
              v-model="isDarkMode"
              :label="i18n.t('settings.darkMode')"
              color="primary"
              class="mb-4"
              :disabled="isFollowingSystemTheme"
              @update:model-value="() => showNotification(i18n.t('settings.updated'))"
            ></v-switch>

            <!-- Theme Colors -->
            <v-row class="mb-4">
              <v-col cols="12" sm="4">
                <v-color-picker
                  v-model="primaryColor"
                  :label="i18n.t('settings.primaryColor')"
                  dot-size="25"
                  mode="hex"
                  elevation="2"
                  class="mb-2"
                  @update:model-value="value => handleColorChange('primary', value)"
                ></v-color-picker>
                <div class="text-caption">{{ i18n.t('settings.primaryColor') }}</div>
              </v-col>
              <v-col cols="12" sm="4">
                <v-color-picker
                  v-model="secondaryColor"
                  :label="i18n.t('settings.secondaryColor')"
                  dot-size="25"
                  mode="hex"
                  elevation="2"
                  class="mb-2"
                  @update:model-value="value => handleColorChange('secondary', value)"
                ></v-color-picker>
                <div class="text-caption">{{ i18n.t('settings.secondaryColor') }}</div>
              </v-col>
              <v-col cols="12" sm="4">
                <v-color-picker
                  v-model="accentColor"
                  :label="i18n.t('settings.accentColor')"
                  dot-size="25"
                  mode="hex"
                  elevation="2"
                  class="mb-2"
                  @update:model-value="value => handleColorChange('accent', value)"
                ></v-color-picker>
                <div class="text-caption">{{ i18n.t('settings.accentColor') }}</div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider class="my-4"></v-divider>

          <!-- Language Settings -->
          <v-card-text>
            <h3 class="text-h6 mb-4">{{ i18n.t('settings.language') }}</h3>
            <v-select
              v-model="currentLanguage"
              :items="availableLanguages"
              :label="i18n.t('settings.selectLanguage')"
              variant="outlined"
              class="mb-4"
              @update:model-value="value => handleLanguageChange(value)"
            ></v-select>
          </v-card-text>

          <v-divider class="my-4"></v-divider>

          <!-- Notification Settings -->
          <v-card-text>
            <h3 class="text-h6 mb-4">{{ i18n.t('settings.notifications') }}</h3>
            <v-switch
              v-model="notifications.email"
              :label="i18n.t('settings.emailNotifications')"
              color="primary"
              class="mb-2"
              @change="() => handleNotificationChange('email')"
            ></v-switch>
            <v-switch
              v-model="notifications.push"
              :label="i18n.t('settings.pushNotifications')"
              color="primary"
              class="mb-2"
              @change="() => handleNotificationChange('push')"
            ></v-switch>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Notification Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          {{ i18n.t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const settingsStore = useSettingsStore()

// Snackbar state
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const showNotification = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

// 等待设置加载完成
const isLoading = ref(true)

onMounted(async () => {
  try {
    await settingsStore.loadSettings()
  } finally {
    isLoading.value = false
  }
})

// Keep language state in sync with single source of truth
watch(
  () => settingsStore.currentLanguage,
  (newLang) => {
    if (newLang !== i18n.locale.value) {
      i18n.locale.value = newLang
    }
  },
  { immediate: true }
)

// Theme settings
const isFollowingSystemTheme = computed({
  get: () => settingsStore.isFollowingSystemTheme,
  set: () => settingsStore.toggleFollowSystemTheme()
})

const isDarkMode = computed({
  get: () => settingsStore.isDarkMode,
  set: () => {
    if (!settingsStore.isFollowingSystemTheme) {
      settingsStore.toggleDarkMode()
    }
  }
})

// Watch system theme changes
const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)')
systemThemeMedia.addEventListener('change', () => {
  settingsStore.updateSystemTheme()
})

const themeColors = computed(() => ({
  primary: settingsStore.primaryColor,
  secondary: settingsStore.secondaryColor,
  accent: settingsStore.accentColor
}))

const primaryColor = computed({
  get: () => themeColors.value.primary,
  set: (value) => settingsStore.setThemeColor('primary', value)
})

const secondaryColor = computed({
  get: () => themeColors.value.secondary,
  set: (value) => settingsStore.setThemeColor('secondary', value)
})

const accentColor = computed({
  get: () => themeColors.value.accent,
  set: (value) => settingsStore.setThemeColor('accent', value)
})

// Language settings
const currentLanguage = computed({
  get: () => {
    // Always return the store's language value to ensure consistency
    return settingsStore.currentLanguage
  },
  set: (value) => settingsStore.setLanguage(value)
})

const availableLanguages = [
  { title: 'English', value: 'en' },
  { title: '中文', value: 'zh' }
]

// Notification settings
const notifications = computed(() => ({ ...settingsStore.notifications }))

// Handlers
const handleColorChange = (key, value) => {
  settingsStore.setThemeColor(key, value)
  showNotification(i18n.t('settings.updated'))
}

const handleLanguageChange = (value) => {
  settingsStore.setLanguage(value)
  showNotification(i18n.t('settings.updated'))
}

const handleNotificationChange = (type) => {
  settingsStore.toggleNotification(type)
  showNotification(i18n.t('settings.updated'))
}
</script>

<style scoped>
.v-color-picker {
  max-width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
</style>
