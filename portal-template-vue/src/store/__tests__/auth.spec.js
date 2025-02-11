import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have initial state', () => {
    const authStore = useAuthStore()
    expect(authStore.user).toBeNull()
    expect(authStore.userProfile).toBeNull()
    expect(authStore.loading).toBe(false)
    expect(authStore.error).toBeNull()
  })

  it('isAuthenticated getter should return false when no user is set', () => {
    const authStore = useAuthStore()
    expect(authStore.isAuthenticated).toBe(false)
  })
})
