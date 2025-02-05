import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    isOpen: false
  }),

  actions: {
    openChat() {
      this.isOpen = true
    },
    closeChat() {
      this.isOpen = false
    },
    toggleChat() {
      this.isOpen = !this.isOpen
    }
  }
})
