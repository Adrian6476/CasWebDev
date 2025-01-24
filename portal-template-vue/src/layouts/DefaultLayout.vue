<template>
  <v-app>
    <!-- Global Snackbar -->
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      :timeout="5000"
      location="top"
    >
      {{ snackbar.message }}
    </v-snackbar>

    <!-- App Bar -->
    <v-app-bar :color="$vuetify.theme.current.dark ? 'surface' : 'background'" elevation="1" height="64">
      <v-container class="d-flex align-center px-4">
        <!-- Logo -->
        <router-link to="/" class="d-flex align-center text-decoration-none app-logo">
          <v-img
            :src="vueLogo"
            width="32"
            height="32"
            class="mr-3 logo-image"
            alt="Vue Logo"
          ></v-img>
          <span class="text-h6 font-weight-medium" :class="$vuetify.theme.current.dark ? 'text-white' : 'text-black'">Portal</span>
        </router-link>

        <v-spacer></v-spacer>

        <!-- Navigation Menu -->
        <v-tabs
          v-model="activeTab"
          class="d-none d-md-flex mx-4"
          height="64"
        >
          <v-tab
            v-for="item in menuItems"
            :key="item.title"
            :to="item.to"
            :value="item.to"
          >
            {{ $t(`nav.${item.title.toLowerCase()}`) }}
          </v-tab>
        </v-tabs>

        <!-- Language Selector -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="mx-2"
              size="small"
              icon="mdi-translate"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="locale in availableLocales"
              :key="locale.value"
              @click="currentLocale = locale.value"
            >
              <v-list-item-title>{{ locale.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Theme Toggle -->
        <v-btn
          variant="text"
          class="mx-2"
          size="small"
          :icon="settingsStore.isDarkMode ? 'mdi-weather-night' : 'mdi-weather-sunny'"
          @click="toggleTheme"
        ></v-btn>

        <!-- Auth Buttons -->
        <template v-if="!authStore.isAuthenticated">
          <v-btn
            variant="text"
            class="mx-2 text-body-2 font-weight-medium"
            :to="{ name: 'login' }"
            min-width="80"
          >
            {{ $t('auth.login') }}
          </v-btn>
          <v-btn
            color="primary"
            class="mx-2 text-body-2 font-weight-medium"
            :to="{ name: 'register' }"
            min-width="80"
          >
            {{ $t('auth.register') }}
          </v-btn>
        </template>

        <template v-else>
          <v-menu min-width="200" location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="text"
                class="mx-2 pa-2"
                v-bind="props"
                height="40"
              >
                <v-avatar size="32" class="mr-2">
                  <v-img 
                    :src="authStore.currentUser?.photoURL || 'https://ui-avatars.com/api/?name=' + (authStore.userProfile?.name || authStore.currentUser?.displayName || authStore.currentUser?.email)"
                    cover
                  ></v-img>
                </v-avatar>
                <span class="text-body-2 font-weight-medium text-truncate" style="max-width: 120px;">
                  {{ authStore.userProfile?.name || authStore.currentUser?.displayName || authStore.currentUser?.email }}
                </span>
                <v-icon size="small" class="ml-1">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="item in userMenuItems"
                :key="item.title"
                :value="item.title"
                @click="item.action"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>
                <v-list-item-title>{{ $t(`auth.${item.title}`) }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <!-- Mobile Menu Button -->
        <v-app-bar-nav-icon
          class="d-md-none ml-2"
          @click="drawer = !drawer"
          size="24"
        ></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
    >
      <v-list>
        <!-- Navigation Items -->
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :title="$t(`nav.${item.title.toLowerCase()}`)"
          :value="item.title"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- Theme Toggle -->
        <v-list-item
          :title="$t('settings.darkMode')"
          :prepend-icon="settingsStore.isDarkMode ? 'mdi-weather-night' : 'mdi-weather-sunny'"
          @click="toggleTheme"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- Auth Items -->
        <template v-if="!authStore.isAuthenticated">
          <v-list-item
            :to="{ name: 'login' }"
            :title="$t('auth.login')"
            prepend-icon="mdi-login"
          ></v-list-item>
          <v-list-item
            :to="{ name: 'register' }"
            :title="$t('auth.register')"
            prepend-icon="mdi-account-plus"
          ></v-list-item>
        </template>
        <template v-else>
          <v-list-item
            v-for="item in userMenuItems"
            :key="item.title"
            :title="$t(`auth.${item.title}`)"
            :prepend-icon="item.icon"
            @click="item.action"
          ></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <slot></slot>
    </v-main>

    <!-- Footer -->
    <v-footer
      :color="$vuetify.theme.current.dark ? 'surface' : 'background'"
    >
      <v-container>
        <v-row class="py-8">
          <!-- Company Info -->
          <v-col cols="12" md="4">
            <h3 class="text-h6 mb-4">{{ $t('footer.aboutUs') }}</h3>
            <p class="text-body-2">
              {{ $t('home.about.description') }}
            </p>
          </v-col>

          <!-- Quick Links -->
          <v-col cols="12" md="4">
            <h3 class="text-h6 mb-4">{{ $t('footer.quickLinks') }}</h3>
            <v-list density="compact" bg-color="transparent">
              <v-list-item
                v-for="item in menuItems"
                :key="item.title"
                :to="item.to"
                :title="$t(`nav.${item.title.toLowerCase()}`)"
              ></v-list-item>
            </v-list>
          </v-col>

          <!-- Contact Info -->
          <v-col cols="12" md="4">
            <h3 class="text-h6 mb-4">{{ $t('footer.contactUs') }}</h3>
            <v-list density="compact" bg-color="transparent">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary" icon="mdi-map-marker"></v-icon>
                </template>
                <v-list-item-title>123 Business Street</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary" icon="mdi-phone"></v-icon>
                </template>
                <v-list-item-title>+1 234 567 890</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary" icon="mdi-email"></v-icon>
                </template>
                <v-list-item-title>contact@company.com</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <!-- Copyright -->
        <v-divider></v-divider>
        <div class="text-center py-4">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </div>
      </v-container>
    </v-footer>

  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'
import vueLogo from '@/assets/vue.svg'

const { t } = useI18n()
const i18n = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

// Theme toggle function
const toggleTheme = () => {
  if (settingsStore.isFollowingSystemTheme) {
    settingsStore.toggleFollowSystemTheme() // 关闭跟随系统
  }
  settingsStore.toggleDarkMode() // 切换深色模式
}

const userMenuItems = [
  {
    title: 'profile',
    icon: 'mdi-account',
    action: () => router.push('/profile')
  },
  {
    title: 'settings',
    icon: 'mdi-cog',
    action: () => router.push('/settings')
  },
  {
    title: 'logout',
    icon: 'mdi-logout',
    action: async () => {
      try {
        const result = await authStore.logout(t)
        snackbar.value = {
          visible: true,
          message: result.message,
          color: result.success ? 'success' : 'error'
        }
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } catch (error) {
        snackbar.value = {
          visible: true,
          message: error.message,
          color: 'error'
        }
      }
    }
  }
]

const drawer = ref(false)
const snackbar = ref({
  visible: false,
  message: '',
  color: 'success'
})

// Language settings
const currentLocale = computed({
  get: () => settingsStore.currentLanguage,
  set: (value) => {
    // Only update if actually changed
    if (value !== settingsStore.currentLanguage) {
      settingsStore.setLanguage(value)
    }
  }
})

// Keep i18n in sync with store
watch(
  () => settingsStore.currentLanguage,
  (newLang) => {
    if (newLang !== i18n.locale.value) {
      i18n.locale.value = newLang
    }
  },
  { immediate: true }
)

const availableLocales = [
  { title: 'English', value: 'en' },
  { title: '中文', value: 'zh' }
]

const menuItems = [
  { title: 'Home', to: '/' },
  { title: 'News', to: '/news' },
  { title: 'Contact', to: '/contact' }
]

const activeTab = computed(() => route.path)

// Watch auth errors
watch(() => authStore.error, (error) => {
  if (error) {
    console.error(error)
    authStore.clearError()
  }
})
</script>

<style scoped>
.language-select :deep(.v-field__input) {
  padding-top: 5px !important;
  min-height: 32px;
}

.language-select :deep(.v-field) {
  border-radius: 4px;
  background-color: transparent;
}

.language-select :deep(.v-field__append-inner) {
  padding-top: 6px;
}

/* Fix logo aspect ratio */
.v-img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

/* Navigation tabs styling */
.v-tabs :deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.3px;
  min-width: 80px;
  height: 64px;
  border-radius: 0;
  opacity: 0.87;
}

.v-tabs :deep(.v-tab--selected) {
  font-weight: 600;
  opacity: 1;
}

.v-tabs :deep(.v-tab:hover) {
  opacity: 1;
}

/* User menu styling */
.v-menu :deep(.v-list) {
  padding: 8px;
}

.v-menu :deep(.v-list-item) {
  min-height: 40px;
  padding: 0 16px;
  border-radius: 4px;
  margin: 4px 0;
}

.v-menu :deep(.v-list-item:hover) {
  background-color: rgb(var(--v-theme-primary), 0.1);
}

.v-menu :deep(.v-list-item-title) {
  font-size: 14px;
  font-weight: 500;
}

.v-menu :deep(.v-list-item__prepend) {
  margin-right: 12px;
}

/* Mobile drawer styling */
.v-navigation-drawer :deep(.v-list) {
  padding: 8px;
}

.v-navigation-drawer :deep(.v-list-item) {
  min-height: 48px;
  margin: 4px;
  border-radius: 4px;
}

/* Add smooth transitions */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* Auth buttons styling */
.v-btn {
  letter-spacing: 0.3px;
}

.v-btn.v-btn--size-default {
  padding: 0 20px;
}

/* Logo styling */
.app-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.app-logo:hover {
  opacity: 0.9;
}

.app-logo .text-h6 {
  font-weight: 600;
  font-size: 1.25rem;
  transition: color 0.3s ease;
}

.app-logo:hover .text-h6 {
  color: rgb(var(--v-theme-primary)) !important;
}

@media (max-width: 600px) {
  .app-logo .text-h6 {
    font-size: 1.125rem;
  }
}

.v-img.logo-image {
  transition: transform 0.3s ease;
}

.app-logo:hover .v-img.logo-image {
  transform: scale(1.05);
}
</style>
