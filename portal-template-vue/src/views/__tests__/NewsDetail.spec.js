import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import NewsDetail from '../NewsDetail.vue'
import { newsApi } from '@/api'

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

// Mock the API
vi.mock('@/api', () => ({
  newsApi: {
    getNewsDetail: vi.fn(),
    getRelatedNews: vi.fn()
  }
}))

describe('NewsDetail.vue', () => {
  let wrapper
  let router
  let i18n
  let vuetify

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock document head for Vuetify theme system
    document.head.appendChild = vi.fn()
    document.head.removeChild = vi.fn()

    // Create fresh style element mock
    const mockStyleElement = {
      type: 'text/css',
      textContent: '',
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      remove: vi.fn(),
      sheet: {
        insertRule: vi.fn(),
        cssRules: []
      }
    }

    // Mock document.createElement
    const origCreateElement = document.createElement.bind(document)
    document.createElement = tag => {
      if (tag === 'style') return mockStyleElement
      if (tag === 'textarea') {
        return {
          value: '',
          setAttribute: vi.fn(),
          select: vi.fn(),
          remove: vi.fn(),
          style: {}
        }
      }
      return origCreateElement(tag)
    }

    // Create router with initial route params
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
        { path: '/news', name: 'NewsList', component: { template: '<div>News</div>' } },
        { path: '/news/:id', name: 'NewsDetail', component: NewsDetail }
      ]
    })

    // Create i18n instance
    i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          news: {
            relatedArticles: 'Related Articles'
          }
        }
      }
    })

    // Create Vuetify instance with test-specific theme settings
    vuetify = createVuetify({
      components,
      directives,
      theme: false // Disable theme system for tests
    })

    // Mock successful API response
    newsApi.getNewsDetail.mockResolvedValue({
      id: 1,
      title: 'Test Article',
      body: 'Test content',
      date: '2024-01-01'
    })

    newsApi.getRelatedNews.mockResolvedValue([
      {
        id: 2,
        title: 'Related Article',
        body: 'Related content',
        date: '2024-01-02'
      }
    ])

    // Mock document.execCommand
    document.execCommand = vi.fn().mockReturnValue(true)

    // Mock document.body.appendChild and removeChild
    document.body.appendChild = vi.fn()
    document.body.removeChild = vi.fn()

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'http://test.com/news/1' },
      writable: true
    })

    // Set up route with ID before mounting
    router.push('/news/1')
  })

  async function mountComponent() {
    // Wait for route to be ready
    await router.isReady()

    wrapper = mount(NewsDetail, {
      global: {
        plugins: [router, i18n, vuetify],
        stubs: {
          'v-card': true,
          'v-progress-circular': true
        }
      }
    })

    // Wait for initial API calls to complete
    await wrapper.vm.$nextTick()
    await vi.dynamicImportSettled()
  }

  it('renders the article title and content', async () => {
    await mountComponent()
    expect(wrapper.text()).toContain('Test Article')
    expect(wrapper.text()).toContain('Test content')
  })

  it('renders related articles section when articles exist', async () => {
    await mountComponent()
    expect(wrapper.text()).toContain('Related Articles')
    expect(wrapper.text()).toContain('Related Article')
  })

  it('displays success message when copying link', async () => {
    await mountComponent()
    await wrapper.vm.copyLink()

    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(wrapper.vm.snackbar.show).toBe(true)
    expect(wrapper.vm.snackbar.color).toBe('success')
  })

  it('displays error message when copying link fails', async () => {
    document.execCommand = vi.fn(() => {
      throw new Error('Copy failed')
    })

    await mountComponent()
    await wrapper.vm.copyLink()

    expect(wrapper.vm.snackbar.show).toBe(true)
    expect(wrapper.vm.snackbar.color).toBe('error')
  })

  it('shows loading state while fetching article', async () => {
    // Delay API response
    newsApi.getNewsDetail.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    await router.isReady()
    wrapper = mount(NewsDetail, {
      global: {
        plugins: [router, i18n, vuetify],
        stubs: {
          'v-card': true,
          'v-progress-circular': {
            template: '<div class="v-progress-circular" data-testid="loading" />'
          }
        }
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
  })

  it('shows error state when loading article fails', async () => {
    newsApi.getNewsDetail.mockRejectedValue(new Error('Failed to load article'))

    await mountComponent()
    expect(wrapper.text()).toContain('Failed to load the article')
  })
})
