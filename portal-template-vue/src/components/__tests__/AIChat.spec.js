import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AIChat from '../AIChat.vue'
import { aiApi } from '@/api/ai'

// Mock the AI API
vi.mock('@/api/ai', () => ({
  aiApi: {
    sendMessage: vi.fn()
  }
}))

describe('AIChat.vue', () => {
  let wrapper
  let i18n

  beforeEach(() => {
    vi.clearAllMocks() // Clear all mocks before each test

    // Create a fresh i18n instance for each test
    i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          aiSupport: {
            welcomeMessage: 'Welcome to AI Chat',
            thinking: 'Thinking',
            placeholder: 'Type your message',
            send: 'Send',
            errorMessage: 'Error: '
          }
        }
      }
    })

    wrapper = mount(AIChat, {
      global: {
        plugins: [i18n]
      }
    })
  })

  it('displays welcome message on mount', () => {
    expect(wrapper.text()).toContain('Welcome to AI Chat')
  })

  it('adds user message and calls AI API when sending message', async () => {
    const response = { role: 'assistant', content: 'AI response' }
    aiApi.sendMessage.mockResolvedValueOnce(response)

    await wrapper.find('textarea').setValue('Hello AI')
    await wrapper.find('.send-button').trigger('click')

    expect(wrapper.text()).toContain('Hello AI')
    expect(wrapper.text()).toContain('AI response')
    expect(aiApi.sendMessage).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ role: 'user', content: 'Hello AI' })]),
      'en'
    )
  })

  it('disables input and button while loading', async () => {
    aiApi.sendMessage.mockImplementationOnce(() => new Promise(() => {})) // Never resolves

    await wrapper.find('textarea').setValue('Test message')
    await wrapper.find('.send-button').trigger('click')

    expect(wrapper.find('textarea').element.disabled).toBe(true)
    expect(wrapper.find('.send-button').element.disabled).toBe(true)
    expect(wrapper.text()).toContain('Thinking')
  })

  it('displays error message when API call fails', async () => {
    const error = new Error('API error')
    aiApi.sendMessage.mockRejectedValueOnce(error)

    await wrapper.find('textarea').setValue('Test message')
    await wrapper.find('.send-button').trigger('click')

    expect(wrapper.text()).toContain('Error: API error')
  })

  it('handles enter key to send message', async () => {
    const response = { role: 'assistant', content: 'AI response' }
    aiApi.sendMessage.mockResolvedValueOnce(response)

    await wrapper.find('textarea').setValue('Test message')
    await wrapper.find('textarea').trigger('keydown.enter')

    expect(aiApi.sendMessage).toHaveBeenCalled()
    expect(wrapper.vm.inputMessage).toBe('')
  })

  it('allows shift+enter for new line', async () => {
    await wrapper.find('textarea').setValue('Test message')
    await wrapper.find('textarea').trigger('keydown.enter', {
      shiftKey: true
    })

    expect(aiApi.sendMessage).not.toHaveBeenCalled()
    expect(wrapper.vm.inputMessage).toBe('Test message')
  })

  it('disables send button when input is empty or whitespace', async () => {
    await wrapper.find('textarea').setValue('')
    expect(wrapper.find('.send-button').element.disabled).toBe(true)

    await wrapper.find('textarea').setValue('   ')
    expect(wrapper.find('.send-button').element.disabled).toBe(true)
  })

  it('updates welcome message when locale changes', async () => {
    i18n.global.locale.value = 'en' // Should trigger the watch handler
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Welcome to AI Chat')
  })
})
