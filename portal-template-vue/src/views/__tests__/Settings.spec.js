import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import Settings from '../Settings.vue'
import { createVuetify } from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useSettingsStore } from '@/store/settings'
import { nextTick } from 'vue'

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

// Create i18n instance with composition API
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      settings: {
        title: 'Settings',
        appearance: 'Appearance',
        followSystemTheme: 'Follow System Theme',
        darkMode: 'Dark Mode',
        language: 'Language',
        selectLanguage: 'Select Language',
        updated: 'Settings updated'
      },
      common: {
        close: 'Close'
      }
    },
    zh: {
      settings: {
        title: '设置',
        appearance: '外观',
        followSystemTheme: '跟随系统主题',
        darkMode: '深色模式',
        language: '语言',
        selectLanguage: '选择语言',
        updated: '设置已更新'
      },
      common: {
        close: '关闭'
      }
    }
  }
})

describe('Settings.vue', () => {
  const vuetify = createVuetify()
  let wrapper
  let store

  // Mock matchMedia
  global.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }))

  beforeEach(async () => {
    // Create a fresh Pinia instance
    const pinia = createPinia()
    setActivePinia(pinia)

    // Create and configure store with initial state
    store = useSettingsStore()

    // Mock store methods
    store.loadSettings = vi.fn().mockResolvedValue()
    store.toggleFollowSystemTheme = vi.fn()
    store.toggleDarkMode = vi.fn()
    store.setLanguage = vi.fn()

    // Set initial store state
    store.$patch({
      isDarkMode: false,
      isFollowingSystemTheme: false,
      currentLanguage: 'en'
    })

    // Mount component with all dependencies
    wrapper = mount(Settings, {
      global: {
        plugins: [[vuetify], [pinia], [i18n]],
        provide: {
          i18n: i18n.global
        },
        stubs: {
          'v-switch': {
            name: 'v-switch',
            template: `
              <button 
                type="button"
                class="v-switch mb-4" 
                :class="{ 'v-switch--disabled': disabled }"
                :disabled="disabled"
                :aria-checked="modelValue"
                @click="onClick"
              >
                {{ label }}
              </button>
            `,
            props: ['modelValue', 'disabled', 'label'],
            methods: {
              onClick() {
                if (!this.disabled) {
                  this.$emit('update:modelValue', !this.modelValue)
                }
              }
            }
          }
        }
      }
    })

    // Wait for initial setup
    await nextTick()
  })

  it('shows loading state initially', async () => {
    const localWrapper = mount(Settings, {
      global: {
        plugins: [[vuetify], [createPinia()], [i18n]],
        provide: {
          i18n: i18n.global
        }
      }
    })

    expect(localWrapper.vm.isLoading).toBe(true)
  })

  it('loads settings on mount', () => {
    expect(store.loadSettings).toHaveBeenCalled()
  })

  it('toggles system theme following', async () => {
    const systemThemeSwitch = wrapper.findAll('.v-switch')[0]
    await systemThemeSwitch.trigger('click')
    await nextTick()

    expect(store.toggleFollowSystemTheme).toHaveBeenCalled()
  })

  it('dark mode switch is disabled when following system theme', async () => {
    // Enable system theme following
    store.$patch({ isFollowingSystemTheme: true })
    await nextTick()

    const darkModeSwitch = wrapper.findAll('.v-switch')[1]
    expect(darkModeSwitch.attributes('disabled')).toBeDefined()
    expect(darkModeSwitch.classes()).toContain('v-switch--disabled')
  })

  it('changes language', async () => {
    await wrapper.vm.handleLanguageChange('zh')
    expect(store.setLanguage).toHaveBeenCalledWith('zh')
  })

  it('shows notification when settings are updated', async () => {
    const testMessage = 'Test notification'
    await wrapper.vm.showNotification(testMessage)

    expect(wrapper.vm.snackbar.show).toBe(true)
    expect(wrapper.vm.snackbar.text).toBe(testMessage)
  })
})
