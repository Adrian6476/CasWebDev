import { createApp } from 'vue'
import App from './App.vue'

// Import Pinia for state management.
import { createPinia } from 'pinia'

// Import Vuetify styles and createVuetify function for UI components.
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import './styles/theme.css'

// Import Vue Router for handling routes.
import router from './router'

// Import Vue I18n for internationalization support.
import { createI18n } from 'vue-i18n'
import messages from './locales'

// Create a Pinia instance for state management.
const pinia = createPinia()

// Create a Vuetify instance with theme configuration.
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
          accent: '#FF4081'
        }
      }
    }
  }
})

// Retrieve saved settings from localStorage to determine the default locale.
const savedSettings = localStorage.getItem('settings')
const defaultLocale = savedSettings ? JSON.parse(savedSettings).language || 'en' : 'en'

// Create an i18n instance for internationalization.
const i18n = createI18n({
  legacy: false, // Use Composition API mode for i18n.
  locale: defaultLocale, // Set the initial locale.
  fallbackLocale: 'en', // Fallback locale if key is missing.
  messages, // Translation messages.
  sync: true, // Sync locale across components.
  globalInjection: true // Allow global access to translation functions.
})

// Create the Vue application instance using the root component.
const app = createApp(App)

// Register Pinia for state management.
app.use(pinia)
// Register Vuetify for UI components.
app.use(vuetify)
// Register Vue Router for navigation.
app.use(router)
// Register i18n for translation support.
app.use(i18n)

// Import the Firebase configuration module to initialize Firebase.
import './firebase'

// Initialize the authentication listener using the auth store.
import { useAuthStore } from './store/auth'
const authStore = useAuthStore()
authStore.initializeAuthListener()

// Mount the Vue application to the DOM element with id 'app'.
app.mount('#app')
