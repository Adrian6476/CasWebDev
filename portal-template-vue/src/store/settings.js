import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import throttle from 'lodash/throttle'

/**
 * @typedef {Object} ThemeColors
 * @property {string} primary - Primary color
 * @property {string} secondary - Secondary color
 * @property {string} accent - Accent color
 */

/**
 * @typedef {Object} ThemeSettings
 * @property {boolean} dark - Dark mode enabled
 * @property {boolean} followSystem - Follow system theme
 * @property {ThemeColors} colors - Theme colors
 */

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: {
      dark: false,
      followSystem: true,
      colors: {
        primary: '#1867C0',
        secondary: '#5CBBF6',
        accent: '#FF4081'
      }
    },
    language: 'en'
  }),

  actions: {
    toggleDarkMode() {
      if (!this.theme.followSystem) {
        this.theme.dark = !this.theme.dark
        this.saveSettings()
      }
    },

    toggleFollowSystemTheme() {
      this.theme.followSystem = !this.theme.followSystem
      if (this.theme.followSystem) {
        this.theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      this.saveSettings()
    },

    updateSystemTheme() {
      if (this.theme.followSystem) {
        this.theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.saveSettings()
      }
    },

    setThemeColor(key, value) {
      if (key in this.theme.colors) {
        this.theme.colors[key] = value
        this.saveSettings()
      }
    },

    setLanguage(lang) {
      this.language = lang
      this.saveSettings()

      // Update i18n locale - needs to be after saveSettings to ensure persistence
      const i18n = useI18n()
      if (i18n.locale.value !== lang) {
        i18n.locale.value = lang
      }
    },

    // Load settings from local storage
    async loadSettings() {
      try {
        const savedSettings = localStorage.getItem('settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          this.$patch(settings)

          // Sync i18n locale with loaded settings
          const i18n = useI18n()
          if (settings.language && i18n.locale.value !== settings.language) {
            i18n.locale.value = settings.language
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    },

    // Use throttle to save settings
    saveSettings: throttle(function () {
      try {
        const settingsToSave = {
          theme: this.theme,
          language: this.language
        }
        localStorage.setItem('settings', JSON.stringify(settingsToSave))
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    }, 1000)
  },

  getters: {
    isDarkMode: state => state.theme.dark,
    isFollowingSystemTheme: state => state.theme.followSystem,
    currentLanguage: state => state.language,
    themeColors: state => state.theme.colors,
    primaryColor: state => state.theme.colors.primary,
    secondaryColor: state => state.theme.colors.secondary,
    accentColor: state => state.theme.colors.accent
  }
})
