<template>
  <!-- Theme provider doesn't render anything, it just manages theme -->
  <slot></slot>
</template>

<script setup>
  import { watch, onMounted, onUnmounted } from 'vue'
  import { useSettingsStore } from '@/store/settings'
  import { useThemeManager } from '@/composables/useTheme'

  const settingsStore = useSettingsStore()
  const { currentTheme, applyTheme, handleSystemThemeChange, cleanup } =
    useThemeManager(settingsStore)

  // Watch for changes in theme settings
  watch(
    () => settingsStore.theme,
    () => {
      applyTheme(currentTheme.value)
    },
    { deep: true }
  )

  // Load and apply settings when the component is mounted
  onMounted(async () => {
    await settingsStore.loadSettings()

    // Check the system theme on initialization
    if (settingsStore.isFollowingSystemTheme) {
      settingsStore.updateSystemTheme()
    }

    applyTheme(currentTheme.value)

    // Add a listener for system theme changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleSystemThemeChange)
  })

  // Cleanup when the component is unmounted
  onUnmounted(() => {
    cleanup()
  })
</script>
