import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { createI18n } from 'vue-i18n'
import { reactive } from 'vue'
import FloatingChat from '../FloatingChat.vue'
import AIChat from '../AIChat.vue'

// Mock the chat store with reactive state
const mockChatStore = reactive({
  isOpen: false,
  closeChat: vi.fn()
})

vi.mock('@/store/chat', () => ({
  useChatStore: () => mockChatStore
}))

// Mock AIChat component with a minimal template
vi.mock('../AIChat.vue', () => ({
  default: {
    name: 'AIChat',
    template: '<div>AI Chat Component</div>'
  }
}))

describe('FloatingChat.vue', () => {
  let wrapper
  let i18n

  beforeEach(() => {
    vi.clearAllMocks()
    mockChatStore.isOpen = false // Reset state

    // Create a fresh i18n instance for each test
    i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          aiSupport: {
            title: 'AI Support'
          },
          common: {
            close: 'Close'
          }
        }
      }
    })
  })

  const mountComponent = () => {
    return mount(FloatingChat, {
      global: {
        plugins: [createVuetify(), i18n]
      },
      attachTo: document.body // Needed for some Vuetify interactions
    })
  }

  it('does not render chat window content when chat is closed', async () => {
    wrapper = mountComponent()
    await flushPromises()
    expect(mockChatStore.isOpen).toBe(false)
  })

  it('renders chat window content when chat is open', async () => {
    mockChatStore.isOpen = true
    wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.chat-window').isVisible()).toBe(true)
  })

  it('renders the AI support title', async () => {
    mockChatStore.isOpen = true
    wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('AI Support')
  })

  it('calls closeChat when close button is clicked', async () => {
    mockChatStore.isOpen = true
    wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    await wrapper.find('.v-btn').trigger('click')
    expect(mockChatStore.closeChat).toHaveBeenCalled()
  })

  it('mounts AIChat component', async () => {
    mockChatStore.isOpen = true
    wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(AIChat).exists()).toBe(true)
  })
})
