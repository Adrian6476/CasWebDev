import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChatStore } from '../chat'

describe('chat store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with isOpen false', () => {
    const chatStore = useChatStore()
    expect(chatStore.isOpen).toBe(false)
  })

  it('openChat sets isOpen to true', () => {
    const chatStore = useChatStore()
    chatStore.openChat()
    expect(chatStore.isOpen).toBe(true)
  })

  it('closeChat sets isOpen to false', () => {
    const chatStore = useChatStore()
    chatStore.openChat()
    chatStore.closeChat()
    expect(chatStore.isOpen).toBe(false)
  })

  it('toggleChat toggles isOpen state', () => {
    const chatStore = useChatStore()
    chatStore.toggleChat()
    expect(chatStore.isOpen).toBe(true)
    chatStore.toggleChat()
    expect(chatStore.isOpen).toBe(false)
  })
})
