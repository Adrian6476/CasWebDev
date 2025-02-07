import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import ThemeProvider from '../ThemeProvider.vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: key => key
  })
}))

// Mock the settings store with theme colors
const mockStore = {
  theme: 'light',
  isFollowingSystemTheme: false,
  isDarkMode: false,
  primaryColor: '#1867C0',
  secondaryColor: '#5CBBF6',
  accentColor: '#82B1FF',
  loadSettings: vi.fn(),
  updateSystemTheme: vi.fn()
}

vi.mock('@/store/settings', () => ({
  useSettingsStore: () => mockStore
}))

describe('ThemeProvider.vue', () => {
  let wrapper
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#1867C0',
            secondary: '#5CBBF6',
            accent: '#82B1FF'
          }
        },
        dark: {
          dark: true,
          colors: {
            primary: '#2196F3',
            secondary: '#424242',
            accent: '#FF4081'
          }
        }
      }
    }
  })
  const pinia = createPinia()

  const mockMatchMedia = {
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }

  global.window.matchMedia = vi.fn().mockImplementation(() => mockMatchMedia)

  beforeEach(() => {
    setActivePinia(pinia)
    wrapper = mount(ThemeProvider, {
      global: {
        plugins: [vuetify, pinia]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
    vi.clearAllMocks()
  })

  it('renders slot content', () => {
    const wrapper = mount(ThemeProvider, {
      global: {
        plugins: [vuetify, pinia]
      },
      slots: {
        default: '<div class="test-content">Test Content</div>'
      }
    })
    expect(wrapper.find('.test-content').exists()).toBe(true)
  })

  it('loads settings on mount', () => {
    expect(mockStore.loadSettings).toHaveBeenCalled()
  })

  it('adds system theme change listener when following system theme', async () => {
    mockStore.isFollowingSystemTheme = true
    await wrapper.vm.$nextTick()
    expect(mockMatchMedia.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('updates system theme when following system theme', async () => {
    mockStore.isFollowingSystemTheme = true
    await wrapper.vm.$nextTick()
    expect(mockStore.updateSystemTheme).toHaveBeenCalled()
  })

  it('cleans up event listeners on unmount', () => {
    wrapper.unmount()
    expect(mockMatchMedia.removeEventListener).toHaveBeenCalled()
  })
})
