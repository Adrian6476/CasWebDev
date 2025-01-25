import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import debounce from 'lodash/debounce'

// 使用 WeakMap 缓存主题计算结果
const themeCache = new WeakMap()

export function useThemeManager(settingsStore) {
  const theme = useTheme()
  const isTransitioning = ref(false)
  
  // 缓存系统主题媒体查询
  const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  
  // 使用防抖处理主题切换
  const debouncedApplyTheme = debounce((newTheme) => {
    applyTheme(newTheme)
  }, 300)

  // 计算当前主题
  const currentTheme = computed(() => {
    if (settingsStore.isFollowingSystemTheme) {
      return systemThemeMedia.matches ? 'dark' : 'light'
    }
    return settingsStore.isDarkMode ? 'dark' : 'light'
  })

  // 应用主题设置
  const applyTheme = async (themeName = currentTheme.value) => {
    if (isTransitioning.value) return
    
    isTransitioning.value = true
    document.body.classList.add('theme-transitioning')
    
    // 使用 requestAnimationFrame 确保过渡类已被应用
    requestAnimationFrame(() => {
      // 更新主题
      theme.global.name.value = themeName
      
      // 更新主题颜色
      const colors = {
        primary: settingsStore.primaryColor,
        secondary: settingsStore.secondaryColor,
        accent: settingsStore.accentColor
      }
      
      // 使用缓存减少重复计算
      if (!themeCache.has(colors)) {
        themeCache.set(colors, {
          light: { ...theme.themes.value.light, colors: { ...theme.themes.value.light.colors, ...colors } },
          dark: { ...theme.themes.value.dark, colors: { ...theme.themes.value.dark.colors, ...colors } }
        })
      }
      
      const cachedThemes = themeCache.get(colors)
      theme.themes.value.light = cachedThemes.light
      theme.themes.value.dark = cachedThemes.dark

      // 在过渡结束后移除过渡类
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning')
        isTransitioning.value = false
      }, 400)
    })
  }

  // 处理系统主题变化
  const handleSystemThemeChange = () => {
    if (settingsStore.isFollowingSystemTheme) {
      debouncedApplyTheme(systemThemeMedia.matches ? 'dark' : 'light')
    }
  }

  // 清理函数
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
