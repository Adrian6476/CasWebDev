import { createApp } from 'vue'
import App from './App.vue'

// Pinia
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

// Vue Router
import router from './router'

// Vue I18n
import { createI18n } from 'vue-i18n'
import messages from './locales'

// Create Pinia instance
const pinia = createPinia()

// Create vuetify instance
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
          accent: '#FF4081',
        }
      }
    }
  }
})

// Create i18n instance with initial locale from saved settings
const savedSettings = localStorage.getItem('settings')
const defaultLocale = savedSettings ? JSON.parse(savedSettings).language || 'en' : 'en'

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages,
  sync: true, // Ensure locale syncs across components
  globalInjection: true // Enable global injection of translation functions
})

// Create and mount app
const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.use(router)
app.use(i18n)

// Initialize Firebase
import './firebase'

// Initialize auth listener
import { useAuthStore } from './store/auth'
const authStore = useAuthStore()
authStore.initializeAuthListener()

app.mount('#app')
