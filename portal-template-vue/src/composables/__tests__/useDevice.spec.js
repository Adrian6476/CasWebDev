import { describe, it, expect, vi } from 'vitest'
import { useDevice } from '../useDevice'
import { useDisplay } from 'vuetify'

const mockUseDisplay = vi.fn(() => ({
  mobile: { value: false }
}))

vi.mock('vuetify', () => ({
  useDisplay: () => mockUseDisplay()
}))

describe('useDevice', () => {
  it('should return isMobile as false when not on mobile', () => {
    const { isMobile } = useDevice()
    expect(isMobile.value).toBe(false)
  })

  it('should return isMobile as true when on mobile', () => {
    // Change the mock implementation for this test
    mockUseDisplay.mockImplementation(() => ({
      mobile: { value: true }
    }))

    const { isMobile } = useDevice()
    expect(isMobile.value).toBe(true)

    // Reset mock for other tests
    mockUseDisplay.mockImplementation(() => ({
      mobile: { value: false }
    }))
  })
})
