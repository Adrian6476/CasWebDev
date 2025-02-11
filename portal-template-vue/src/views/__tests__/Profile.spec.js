import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createI18n } from 'vue-i18n'
import Profile from '../Profile.vue'
import { useAuthStore } from '@/store/auth'
import { ref, storage } from '@/firebase'
import { updateProfile } from 'firebase/auth'
import { uploadBytes, getDownloadURL } from 'firebase/storage'

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver

// Mock Firebase storage functions
const mockStorageRef = {}
vi.mock('@/firebase', () => ({
  storage: {},
  ref: vi.fn(() => mockStorageRef)
}))

vi.mock('firebase/storage', () => ({
  ref: vi.fn(() => mockStorageRef),
  uploadBytes: vi.fn(() => Promise.resolve()),
  getDownloadURL: vi.fn(() => Promise.resolve('https://example.com/new-photo.jpg'))
}))

vi.mock('firebase/auth', () => ({
  updateProfile: vi.fn(() => Promise.resolve())
}))

vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}))

describe('Profile.vue', () => {
  let wrapper
  let mockAuthStore
  let i18n
  let validateMock

  beforeEach(async () => {
    vi.clearAllMocks()

    // Create validate mock
    validateMock = vi.fn()

    // Mock auth store
    mockAuthStore = {
      currentUser: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg'
      },
      userProfile: {
        name: 'Test User',
        phone: '+1234567890',
        bio: 'Test bio'
      },
      updateUserProfile: vi.fn(() => Promise.resolve()),
      loadUserProfile: vi.fn(() => Promise.resolve())
    }
    useAuthStore.mockReturnValue(mockAuthStore)

    // Create i18n instance
    i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          profile: {
            displayName: 'Display Name',
            displayNameRequired: 'Display name is required',
            phone: 'Phone',
            phoneRequired: 'Phone number is required',
            phoneValid: 'Please enter a valid phone number',
            bio: 'Bio',
            bioLength: 'Bio must not exceed 500 characters',
            saved: 'Profile updated successfully',
            avatarUpdated: 'Avatar updated successfully',
            avatarError: 'Failed to update avatar',
            error: 'Failed to update profile'
          },
          auth: {
            email: 'Email'
          },
          common: {
            save: 'Save',
            close: 'Close'
          }
        }
      }
    })

    // Create Vuetify instance
    const vuetify = createVuetify({
      components,
      directives
    })

    // Create VForm stub
    const VForm = {
      name: 'VForm',
      template: '<form><slot/></form>',
      data() {
        return {
          valid: false
        }
      },
      methods: {
        async validate() {
          const result = await validateMock()
          this.valid = result
          return result
        }
      }
    }

    // Mount component with stubs
    wrapper = mount(Profile, {
      global: {
        plugins: [vuetify, i18n],
        stubs: {
          'v-progress-circular': true,
          'v-form': VForm,
          transition: false,
          'fade-transition': false
        }
      }
    })

    // Wait for initial setup
    await flushPromises()
  })

  it('renders profile form with user data', async () => {
    const displayNameField = wrapper.find('.v-field__input')
    const emailField = wrapper.find('input[disabled]')
    const phoneField = wrapper.findAll('.v-field__input')[2]
    const bioField = wrapper.find('textarea')

    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    expect(displayNameField.element.value).toBe('Test User')
    expect(emailField.element.value).toBe('test@example.com')
    expect(phoneField.element.value).toBe('+1234567890')
    expect(bioField.element.value).toBe('Test bio')
  })

  it('validates form fields properly', async () => {
    // Set up validation to fail
    validateMock.mockResolvedValue(false)

    // Reset updateUserProfile mock
    mockAuthStore.updateUserProfile.mockClear()

    // Get form reference and call validate directly
    const formComponent = wrapper.findComponent({ name: 'VForm' }).vm
    await formComponent.validate()
    await wrapper.vm.saveProfile()
    await flushPromises()

    // Verify validation was called and update was not
    expect(validateMock).toHaveBeenCalled()
    expect(mockAuthStore.updateUserProfile).not.toHaveBeenCalled()
  })

  it('updates profile successfully', async () => {
    // Set up form validation to pass
    validateMock.mockResolvedValue(true)

    // Set form values
    await wrapper.find('.v-field__input').setValue('New Name')
    await wrapper.findAll('.v-field__input')[2].setValue('+1987654321')
    await wrapper.find('textarea').setValue('New bio')

    // Call saveProfile directly
    await wrapper.vm.saveProfile()
    await flushPromises()

    expect(mockAuthStore.updateUserProfile).toHaveBeenCalledWith('test-uid', {
      name: 'New Name',
      phone: '+1987654321',
      bio: 'New bio'
    })
  })

  it('shows error notification when profile update fails', async () => {
    validateMock.mockResolvedValue(true)
    mockAuthStore.updateUserProfile.mockRejectedValue(new Error('Update failed'))

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const snackbar = wrapper.findComponent({ name: 'VSnackbar' })
    expect(snackbar.props('color')).toBe('error')
  })

  it('handles avatar upload successfully', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    // Set up the event object
    const event = { target: { files: [file] } }

    // Call the handler directly
    await wrapper.vm.handleAvatarChange(event)
    await flushPromises()

    expect(uploadBytes).toHaveBeenCalledWith(mockStorageRef, file)
    expect(updateProfile).toHaveBeenCalledWith(mockAuthStore.currentUser, {
      photoURL: 'https://example.com/new-photo.jpg'
    })

    const snackbar = wrapper.findComponent({ name: 'VSnackbar' })
    expect(snackbar.props('color')).toBe('success')
  })

  it('handles avatar upload failure', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    uploadBytes.mockRejectedValue(new Error('Upload failed'))

    // Call the handler directly
    await wrapper.vm.handleAvatarChange({ target: { files: [file] } })
    await flushPromises()

    const snackbar = wrapper.findComponent({ name: 'VSnackbar' })
    expect(snackbar.props('color')).toBe('error')
  })
})
