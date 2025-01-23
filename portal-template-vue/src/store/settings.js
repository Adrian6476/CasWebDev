import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

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
    language: 'en',
    notifications: {
      email: true,
      push: true
    }
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

    toggleNotification(type) {
      if (type in this.notifications) {
        this.notifications[type] = !this.notifications[type]
        this.saveSettings()
      }
    },

    // 从本地存储加载设置
    async loadSettings() {
      return new Promise((resolve) => {
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
        resolve()
      })
    },

    // 保存设置到本地存储
    saveSettings() {
      localStorage.setItem('settings', JSON.stringify({
        theme: this.theme,
        language: this.language,
        notifications: this.notifications
      }))
    }
  },

  getters: {
    isDarkMode: (state) => state.theme.dark,
    isFollowingSystemTheme: (state) => state.theme.followSystem,
    currentLanguage: (state) => state.language,
    primaryColor: (state) => state.theme.colors.primary,
    secondaryColor: (state) => state.theme.colors.secondary,
    accentColor: (state) => state.theme.colors.accent
  }
})
