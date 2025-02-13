import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import debounce from 'lodash/debounce'

// Use a WeakMap to cache theme calculation results
const themeCache = new WeakMap()

export function useThemeManager(settingsStore) {
  const theme = useTheme()
  const isTransitioning = ref(false)

  // Cache the system theme media query
  const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)')

  // Debounce theme switching
  const debouncedApplyTheme = debounce(newTheme => {
    applyTheme(newTheme)
  }, 300)

  // Calculate the current theme
  const currentTheme = computed(() => {
    if (settingsStore.isFollowingSystemTheme) {
      return systemThemeMedia.matches ? 'dark' : 'light'
    }
    return settingsStore.isDarkMode ? 'dark' : 'light'
  })

  // Apply theme settings
  const applyTheme = async (themeName = currentTheme.value) => {
    if (isTransitioning.value) return

    isTransitioning.value = true
    document.body.classList.add('theme-transitioning')

    // Use requestAnimationFrame to ensure the transition class has been applied
    requestAnimationFrame(() => {
      // Update the theme
      theme.global.name.value = themeName

      // Update theme colors
      const colors = {
        primary: settingsStore.primaryColor,
        secondary: settingsStore.secondaryColor,
        accent: settingsStore.accentColor
      }

      // Use caching to reduce redundant calculations
      if (!themeCache.has(colors)) {
        themeCache.set(colors, {
          light: {
            ...theme.themes.value.light,
            colors: { ...theme.themes.value.light.colors, ...colors }
          },
          dark: {
            ...theme.themes.value.dark,
            colors: { ...theme.themes.value.dark.colors, ...colors }
          }
        })
      }

      const cachedThemes = themeCache.get(colors)
      theme.themes.value.light = cachedThemes.light
      theme.themes.value.dark = cachedThemes.dark

      // Remove the transition class after the transition ends
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning')
        isTransitioning.value = false
      }, 400)
    })
  }

  // Handle system theme changes
  const handleSystemThemeChange = () => {
    if (settingsStore.isFollowingSystemTheme) {
      debouncedApplyTheme(systemThemeMedia.matches ? 'dark' : 'light')
    }
  }

  // Cleanup function
  const cleanup = () => {
    systemThemeMedia.removeEventListener('change', handleSystemThemeChange)
    debouncedApplyTheme.cancel()
  }

  return {
    currentTheme,
    applyTheme,
    debouncedApplyTheme,
    handleSystemThemeChange,
    cleanup,
    isTransitioning
  }
}
