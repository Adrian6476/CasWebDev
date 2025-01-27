import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { vuetify } from '../../../vitest.setup'
import NewsList from '../NewsList.vue'

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      news: {
        loadMore: 'Load More',
        categories: {
          technology: 'Technology',
          business: 'Business'
        },
        readMore: 'Read More'
      }
    }
  }
})

// Mock数据
const mockNews = [
  {
    id: 1,
    title: 'News 1',
    abstract: 'Abstract 1',
    cover: 'cover1.jpg',
    date: '2024-01-27',
    category: 'technology'
  },
  {
    id: 2,
    title: 'News 2',
    abstract: 'Abstract 2',
    cover: 'cover2.jpg',
    date: '2024-01-28',
    category: 'business'
  },
  {
    id: 3,
    title: 'News 3',
    abstract: 'Abstract 3',
    cover: 'cover3.jpg',
    date: '2024-01-29',
    category: 'technology'
  },
  {
    id: 4,
    title: 'News 4',
    abstract: 'Abstract 4',
    cover: 'cover4.jpg',
    date: '2024-01-30',
    category: 'business'
  }
]

describe('NewsList.vue', () => {
  const mockNewsCardComponent = vi.fn()

  const mountComponent = (props = {}) => {
    return mount(NewsList, {
      props: {
        news: mockNews,
        ...props
      },
      global: {
        plugins: [vuetify, i18n],
        stubs: {
          NewsCard: {
            name: 'NewsCard',
            template:
              '<div class="news-card-stub" v-bind="$attrs" @click="$emit(\'click\')"></div>',
            props: ['title', 'abstract', 'cover', 'date', 'category', 'link'],
            setup(props) {
              mockNewsCardComponent(props)
              return {}
            }
          }
        }
      }
    })
  }

  beforeEach(() => {
    vi.useFakeTimers()
    mockNewsCardComponent.mockClear()
  })

  it('renders the correct number of news cards based on itemsPerPage', () => {
    const wrapper = mountComponent({ itemsPerPage: 2 })
    const newsCards = wrapper.findAll('.news-card-stub')
    expect(newsCards).toHaveLength(2)
  })

  it('uses default itemsPerPage value when not provided', () => {
    const wrapper = mountComponent()
    const newsCards = wrapper.findAll('.news-card-stub')
    expect(newsCards).toHaveLength(Math.min(6, mockNews.length))
  })

  it('passes correct props to NewsCard components', () => {
    mountComponent({ itemsPerPage: 1 })
    expect(mockNewsCardComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        title: mockNews[0].title,
        abstract: mockNews[0].abstract,
        cover: mockNews[0].cover,
        date: mockNews[0].date,
        category: mockNews[0].category,
        link: `/news/${mockNews[0].id}`
      })
    )
  })

  it('shows load more button when there are more items to load', () => {
    const wrapper = mountComponent({ itemsPerPage: 2 })
    expect(wrapper.text()).toContain('Load More')
  })

  it('hides load more button when all items are displayed', () => {
    const wrapper = mountComponent({ itemsPerPage: mockNews.length })
    expect(wrapper.text()).not.toContain('Load More')
  })

  it('loads more items when load more button is clicked', async () => {
    const wrapper = mountComponent({ itemsPerPage: 2 })
    expect(wrapper.findAll('.news-card-stub')).toHaveLength(2)

    await wrapper.find('.v-btn').trigger('click')
    await vi.runAllTimers()
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.news-card-stub')).toHaveLength(4)
  })

  it('shows loading state when loading more items', async () => {
    const wrapper = mountComponent({ itemsPerPage: 2 })
    expect(wrapper.vm.loading).toBe(false)

    await wrapper.find('.v-btn').trigger('click')
    expect(wrapper.vm.loading).toBe(true)

    await vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('computes hasMore correctly', () => {
    // 初始状态（显示2项，总共4项）
    const wrapper = mountComponent({ itemsPerPage: 2 })
    expect(wrapper.vm.hasMore).toBe(true)

    // 修改currentPage以显示所有项目
    wrapper.vm.currentPage = 2
    expect(wrapper.vm.hasMore).toBe(false)
  })
})
