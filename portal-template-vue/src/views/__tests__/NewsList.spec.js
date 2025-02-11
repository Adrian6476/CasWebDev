import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createI18n } from 'vue-i18n'
import NewsList from '../NewsList.vue'
import NewsCard from '@/components/NewsCard.vue'
import { newsApi } from '@/api'
import { useDevice } from '@/composables/useDevice'
import { flushPromises } from '@vue/test-utils'

// Mock the API
vi.mock('@/api', () => ({
  newsApi: {
    getNewsList: vi.fn()
  }
}))

// Mock useDevice composable
vi.mock('@/composables/useDevice', () => ({
  useDevice: vi.fn()
}))

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

describe('NewsList.vue', () => {
  let wrapper
  let vuetify
  let i18n

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock device composable
    useDevice.mockReturnValue({ isMobile: false })

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
      return origCreateElement(tag)
    }

    // Create Vuetify instance
    vuetify = createVuetify({
      components,
      directives,
      theme: false
    })

    // Create i18n instance with all required messages
    i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          'news.title': 'Latest News',
          'news.subtitle': 'Stay updated with our latest news and announcements',
          'news.search': 'Search news',
          'news.loadMore': 'Load More',
          'news.readMore': 'Read More',
          'news.categories.all': 'All',
          'news.categories.product': 'Product',
          'news.categories.company': 'Company',
          'news.categories.technology': 'Technology'
        }
      }
    })
  })

  const mountComponent = async () => {
    wrapper = mount(NewsList, {
      global: {
        plugins: [vuetify, i18n],
        stubs: {
          'v-parallax': {
            template: '<div class="v-parallax"><slot /></div>'
          }
        },
        components: {
          NewsCard
        }
      }
    })
    await flushPromises()
  }

  it('renders news banner when not on mobile', async () => {
    // Mock initial data
    newsApi.getNewsList.mockResolvedValue([{ id: 1, title: 'Article 1', body: 'Content 1' }])

    await mountComponent()

    expect(wrapper.find('.news-banner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Latest News')
  })

  it('hides news banner on mobile', async () => {
    // Mock initial data
    newsApi.getNewsList.mockResolvedValue([{ id: 1, title: 'Article 1', body: 'Content 1' }])

    useDevice.mockReturnValue({ isMobile: true })
    await mountComponent()

    expect(wrapper.find('.news-banner').exists()).toBe(false)
  })

  it('shows loading state while fetching news', async () => {
    newsApi.getNewsList.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    await mountComponent()

    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
  })

  it('renders news list after loading', async () => {
    // Mock initial data
    newsApi.getNewsList.mockResolvedValue([
      { id: 1, title: 'Article 1', body: 'Content 1' },
      { id: 2, title: 'Article 2', body: 'Content 2' }
    ])

    await mountComponent()
    await flushPromises()

    const newsCards = wrapper.findAllComponents(NewsCard)
    expect(newsCards).toHaveLength(2)
  })

  it('filters news by category', async () => {
    // Mock initial data
    newsApi.getNewsList.mockResolvedValue([{ id: 1, title: 'Article 1', body: 'Content 1' }])

    await mountComponent()

    const chips = wrapper.findAll('.v-chip')
    await chips[1].trigger('click') // Click "Product" category

    expect(wrapper.vm.selectedCategory).toBe('Product')
  })

  it('filters news by search query', async () => {
    // Mock initial data
    newsApi.getNewsList.mockResolvedValue([
      { id: 1, title: 'Article 1', body: 'Content 1' },
      { id: 2, title: 'Article 2', body: 'Content 2' }
    ])

    await mountComponent()

    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('Article 1')

    expect(wrapper.vm.searchQuery).toBe('Article 1')
    expect(wrapper.vm.filteredNews.length).toBeLessThan(wrapper.vm.newsList.length)
  })

  it('loads more news when clicking load more button', async () => {
    // Mock API responses
    const firstPage = Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      title: `Article ${i + 1}`,
      body: `Content ${i + 1}`
    }))

    const secondPage = [
      {
        id: 10,
        title: 'Article 10',
        body: 'Content 10'
      }
    ]

    // Set up API mock behavior
    let callCount = 0
    const getNewsListMock = vi.fn().mockImplementation(() => {
      callCount++
      return Promise.resolve(callCount === 1 ? firstPage : secondPage)
    })

    newsApi.getNewsList = getNewsListMock

    // Mount and wait for initial load
    await mountComponent()
    await flushPromises()

    // Verify initial state
    expect(wrapper.vm.hasMore).toBe(true)
    expect(wrapper.vm.newsList.length).toBe(9)
    expect(getNewsListMock).toHaveBeenCalledTimes(1)

    // Click load more and wait for the second page
    const loadMoreBtn = wrapper.find('.v-btn')
    expect(loadMoreBtn.exists()).toBe(true)

    await loadMoreBtn.trigger('click')
    await wrapper.vm.loadMore() // Directly call the method to ensure it's triggered
    await flushPromises()

    // Verify final state
    expect(getNewsListMock).toHaveBeenCalledTimes(2)
    expect(getNewsListMock).toHaveBeenNthCalledWith(1, 1, 9)
    expect(getNewsListMock).toHaveBeenNthCalledWith(2, 2, 9)
    expect(wrapper.vm.newsList.length).toBe(10)
  })

  it('resets pagination when changing filters', async () => {
    // Mock initial data
    newsApi.getNewsList.mockResolvedValue([{ id: 1, title: 'Article 1', body: 'Content 1' }])

    await mountComponent()

    // Change page
    await wrapper.vm.loadMore()
    await flushPromises()
    expect(wrapper.vm.page).toBe(2)

    // Change category
    const chips = wrapper.findAll('.v-chip')
    await chips[1].trigger('click')
    await flushPromises()

    expect(wrapper.vm.page).toBe(1)
    expect(newsApi.getNewsList).toHaveBeenLastCalledWith(1, 9)
  })

  it('handles error when fetching news', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('Failed to fetch news')
    newsApi.getNewsList.mockRejectedValue(error)

    await mountComponent()
    await flushPromises()

    expect(consoleError).toHaveBeenCalledWith('Failed to fetch news:', error)
    consoleError.mockRestore()
  })
})
