<template>
  <!-- Theme provider doesn't render anything, it just manages theme -->
  <slot></slot>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { useThemeManager } from '@/composables/useTheme'

const settingsStore = useSettingsStore()
const {
  currentTheme,
  applyTheme,
  handleSystemThemeChange,
  cleanup
} = useThemeManager(settingsStore)

// 监听主题设置变化
watch(() => settingsStore.theme, () => {
  applyTheme(currentTheme.value)
}, { deep: true })

// 组件挂载时加载和应用设置
onMounted(async () => {
  await settingsStore.loadSettings()
  
  // 初始化时检查系统主题
  if (settingsStore.isFollowingSystemTheme) {
    settingsStore.updateSystemTheme()
  }
  
  applyTheme(currentTheme.value)
  
  // 添加系统主题变化监听
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', handleSystemThemeChange)
})

// 组件卸载时清理
onUnmounted(() => {
  cleanup()
})
</script>
