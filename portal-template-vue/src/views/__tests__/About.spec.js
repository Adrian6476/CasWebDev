import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import About from '../About.vue'
import { createTestingPinia } from '@pinia/testing'
import { createVuetify } from 'vuetify'
import { createI18n } from 'vue-i18n'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { contactApi, teamApi } from '@/api'

// Mock the API modules
vi.mock('@/api', () => ({
  teamApi: {
    getTeamMembers: vi.fn()
  },
  contactApi: {
    sendContactForm: vi.fn()
  }
}))

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

// Mock translations
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      about: {
        title: 'About Us',
        subtitle: 'Our Story',
        company: {
          title: 'Our Company',
          description: 'Company description'
        },
        vision: {
          title: 'Our Vision',
          description: 'Vision description'
        },
        mission: {
          title: 'Our Mission',
          description: 'Mission description'
        },
        stats: {
          experience: 'Years Experience',
          clients: 'Happy Clients',
          projects: 'Projects Done',
          awards: 'Awards Won'
        },
        team: {
          title: 'Our Team',
          description: 'Team description'
        },
        contact: {
          title: 'Contact Us',
          address: 'Our Address',
          phone: 'Phone',
          email: 'Email',
          formTitle: 'Send us a message',
          form: {
            name: 'Name',
            nameRequired: 'Name is required',
            nameLength: 'Name must be at least 2 characters',
            email: 'Email',
            emailRequired: 'Email is required',
            emailValid: 'Email must be valid',
            message: 'Message',
            messageRequired: 'Message is required',
            messageLength: 'Message must be at least 10 characters',
            send: 'Send Message',
            success: 'Message sent successfully',
            error: 'Failed to send message'
          }
        },
        social: {
          title: 'Follow Us'
        }
      }
    }
  }
})

const vuetify = createVuetify({
  components,
  directives
})

// Mock useDevice composable
vi.mock('@/composables/useDevice', () => ({
  useDevice: () => ({
    isMobile: false
  })
}))

describe('About.vue', () => {
  let wrapper

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock API responses
    teamApi.getTeamMembers.mockResolvedValue([{ id: 1, name: 'John Doe', company: { bs: 'CEO' } }])
    contactApi.sendContactForm.mockResolvedValue({})

    wrapper = mount(About, {
      global: {
        plugins: [createTestingPinia(), vuetify, i18n],
        stubs: {
          'v-icon': true,
          'v-parallax': true,
          SectionTitle: true
        }
      }
    })
  })

  it('renders company stats correctly', () => {
    const stats = wrapper.findAll('.v-card')
    expect(stats.length).toBeGreaterThan(0)
    const statValue = wrapper.find('.text-h4')
    expect(statValue.text()).toBe('10+')
  })

  it('renders vision and mission sections', () => {
    const visionSection = wrapper.find('.v-card-title')
    expect(visionSection.text()).toContain('Vision')
  })

  it('renders contact form with proper validation', async () => {
    const form = wrapper.find('form')
    const nameInput = wrapper.find('input[type="text"]')
    const emailInput = wrapper.find('input[type="email"]')
    const messageInput = wrapper.find('textarea')
    const submitButton = wrapper.find('button[type="submit"]')

    expect(form.exists()).toBe(true)
    expect(nameInput.exists()).toBe(true)
    expect(emailInput.exists()).toBe(true)
    expect(messageInput.exists()).toBe(true)
    expect(submitButton.exists()).toBe(true)
  })

  it('validates form inputs correctly', async () => {
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    const errorMessages = wrapper.findAll('.v-messages__message')
    expect(errorMessages.length).toBeGreaterThan(0)
  })

  it('submits form successfully', async () => {
    // Create a new ref for the form with validate method
    const validateMock = vi.fn(() => Promise.resolve({ valid: true }))
    wrapper.vm.form = {
      validate: validateMock
    }

    // Trigger v-model updates
    wrapper.findComponent({ ref: 'form' }).vm.$emit('submit', { preventDefault: () => {} })

    // Wait for the next tick and promises to resolve
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Verify API call
    expect(contactApi.sendContactForm).toHaveBeenCalled()
    expect(validateMock).toHaveBeenCalled()
  })

  it('displays social media links', () => {
    const socialButtons = wrapper.findAll('.v-btn[href*="://"]')
    expect(socialButtons.length).toBeGreaterThan(0)
  })

  it('loads and displays team members', async () => {
    await wrapper.vm.fetchTeamMembers()
    await wrapper.vm.$nextTick()

    const teamMembers = wrapper.vm.teamMembers
    expect(teamMembers.length).toBe(1)
    expect(teamMembers[0].name).toBe('John Doe')
  })

  it('handles mobile view', () => {
    vi.mock('@/composables/useDevice', () => ({
      useDevice: () => ({
        isMobile: true
      })
    }))

    const mobileWrapper = mount(About, {
      global: {
        plugins: [createTestingPinia(), vuetify, i18n],
        stubs: {
          'v-icon': true,
          'v-parallax': true,
          SectionTitle: true
        }
      }
    })
    expect(wrapper.find('.about-banner').exists()).toBe(false)
  })
})
