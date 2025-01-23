<template>
  <!-- Theme provider doesn't render anything, it just manages theme -->
  <slot></slot>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useSettingsStore } from '@/store/settings'

const theme = useTheme()
const settingsStore = useSettingsStore()

// 监听系统主题变化
const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)')
const handleSystemThemeChange = () => {
  if (settingsStore.isFollowingSystemTheme) {
    settingsStore.updateSystemTheme()
  }
}

// 应用主题设置
const applyTheme = () => {
  // 如果跟随系统主题，则使用系统主题
  if (settingsStore.isFollowingSystemTheme) {
    theme.global.name.value = systemThemeMedia.matches ? 'dark' : 'light'
  } else {
    // 否则使用手动设置的主题
    theme.global.name.value = settingsStore.isDarkMode ? 'dark' : 'light'
  }

  // 更新主题颜色
  theme.themes.value.light = {
    ...theme.themes.value.light,
    colors: {
      ...theme.themes.value.light.colors,
      primary: settingsStore.primaryColor,
      secondary: settingsStore.secondaryColor,
      accent: settingsStore.accentColor
    }
  }

  theme.themes.value.dark = {
    ...theme.themes.value.dark,
    colors: {
      ...theme.themes.value.dark.colors,
      primary: settingsStore.primaryColor,
      secondary: settingsStore.secondaryColor,
      accent: settingsStore.accentColor
    }
  }
}

// 监听主题设置变化
watch(() => settingsStore.theme, applyTheme, { deep: true })

// 组件挂载时加载和应用设置
onMounted(() => {
  settingsStore.loadSettings()
  // 初始化时检查系统主题
  if (settingsStore.isFollowingSystemTheme) {
    settingsStore.updateSystemTheme()
  }
  applyTheme()
  
  // 添加系统主题变化监听
  systemThemeMedia.addEventListener('change', handleSystemThemeChange)
})
</script>
