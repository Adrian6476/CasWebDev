import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { createI18n } from 'vue-i18n'
import { VCarousel, VCarouselItem } from 'vuetify/components'
import Home from '../Home.vue'
import ImageSection from '@/components/ImageSection.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import NewsList from '@/components/NewsList.vue'
import { newsApi, teamApi } from '@/api'

// Mock API calls
vi.mock('@/api', () => ({
  newsApi: {
    getNewsList: vi.fn()
  },
  teamApi: {
    getTeamMembers: vi.fn()
  }
}))

describe('Home.vue', () => {
  const vuetify = createVuetify()
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        'home.about.productTitle': 'Product Title',
        'home.about.productSubtitle': 'Product Subtitle',
        'home.about.description': 'Description',
        'home.about.learnMore': 'Learn More',
        'home.features.title': 'Features',
        'home.features.subtitle': 'Our Features',
        'home.features.items.fast.title': 'Fast',
        'home.features.items.fast.description': 'Fast Description',
        'home.features.items.secure.title': 'Secure',
        'home.features.items.secure.description': 'Secure Description',
        'home.features.items.responsive.title': 'Responsive',
        'home.features.items.responsive.description': 'Responsive Description',
        'home.team.title': 'Team',
        'home.team.subtitle': 'Our Team',
        'news.title': 'News',
        'news.subtitle': 'Latest News',
        'news.readMore': 'Read More',
        'home.hero.learnMore': 'Learn More',
        'products.items.workstation.name': 'Workstation',
        'products.items.workstation.shortDescription': 'Workstation Description',
        'products.items.surveillance.name': 'Surveillance',
        'products.items.surveillance.shortDescription': 'Surveillance Description',
        'products.items.storage.name': 'Storage',
        'products.items.storage.shortDescription': 'Storage Description'
      }
    }
  })
  let wrapper

  beforeEach(async () => {
    // Reset API mocks
    newsApi.getNewsList.mockReset()
    teamApi.getTeamMembers.mockReset()

    // Mock API responses
    newsApi.getNewsList.mockResolvedValue([
      { id: 1, title: 'News 1', body: 'News content 1' },
      { id: 2, title: 'News 2', body: 'News content 2' }
    ])

    teamApi.getTeamMembers.mockResolvedValue([
      { id: 1, name: 'John Doe', company: { bs: 'CEO' } },
      { id: 2, name: 'Jane Smith', company: { bs: 'CTO' } }
    ])

    // Mount component with minimal stubbing
    wrapper = mount(Home, {
      global: {
        plugins: [vuetify, i18n],
        components: {
          ImageSection,
          SectionTitle,
          NewsList,
          VCarousel,
          VCarouselItem
        },
        stubs: {
          'v-img': true,
          'v-avatar': true,
          'v-icon': true
        }
      }
    })

    // Wait for all promises to resolve
    await Promise.all([wrapper.vm.$nextTick(), new Promise(resolve => setTimeout(resolve, 0))])
  })

  it('renders carousel slides correctly', async () => {
    await wrapper.vm.$nextTick()
    const slides = wrapper.findAll('.v-carousel-item')
    expect(slides).toHaveLength(3)
  })

  it('renders about section with ImageSection component', () => {
    const imageSection = wrapper.findComponent(ImageSection)
    expect(imageSection.exists()).toBe(true)
    expect(imageSection.props('title')).toBe('Product Title')
    expect(imageSection.props('subtitle')).toBe('Product Subtitle')
  })

  it('renders features section with correct number of features', async () => {
    const features = wrapper.findAll('.feature-card')
    expect(features).toHaveLength(3)
  })

  it('fetches and displays news items', async () => {
    const newsList = wrapper.findComponent(NewsList)
    expect(newsApi.getNewsList).toHaveBeenCalledWith(1, 6)
    expect(newsList.exists()).toBe(true)
    expect(newsList.props('news')).toHaveLength(2)
  })

  it('fetches and displays team members', async () => {
    expect(teamApi.getTeamMembers).toHaveBeenCalled()
    const teamSection = wrapper.find('.team-section')
    expect(teamSection.exists()).toBe(true)
    const teamCards = wrapper.findAll('.team-section .v-card')
    expect(teamCards).toHaveLength(2)
  })

  it('handles API errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Reset mocks with rejected promises
    newsApi.getNewsList.mockRejectedValueOnce(new Error('API Error'))
    teamApi.getTeamMembers.mockRejectedValueOnce(new Error('API Error'))

    const errorWrapper = mount(Home, {
      global: {
        plugins: [vuetify, i18n],
        components: {
          ImageSection,
          SectionTitle,
          NewsList,
          VCarousel,
          VCarouselItem
        }
      }
    })

    // Wait for error handling
    await Promise.all([errorWrapper.vm.$nextTick(), new Promise(resolve => setTimeout(resolve, 0))])

    expect(consoleError).toHaveBeenCalledTimes(2)
    consoleError.mockRestore()
  })
})
