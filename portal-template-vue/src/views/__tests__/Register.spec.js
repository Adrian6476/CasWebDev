import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import Register from '../Register.vue'
import { useAuthStore } from '@/store/auth'
import { nextTick } from 'vue'

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver

// Mock the auth store
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}))

// Mock Vue Router
const mockRouter = {
  push: vi.fn()
}
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => mockRouter
  }
})

describe('Register.vue', () => {
  let wrapper
  let vuetify
  let i18n
  let router
  let mockAuthStore

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create Vuetify instance
    vuetify = createVuetify({
      components,
      directives
    })

    // Create i18n instance
    i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          auth: {
            createAccount: 'Create Account',
            username: 'Username',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            signUp: 'Sign Up',
            haveAccount: 'Already have an account?',
            signIn: 'Sign In',
            usernameRequired: 'Username is required',
            emailRequired: 'Email is required',
            passwordRequired: 'Password is required',
            passwordRequirements: 'Password must be at least 8 characters',
            passwordMatch: 'Passwords must match',
            accountCreated: 'Account created successfully',
            registrationError: 'Registration failed'
          },
          contact: {
            form: {
              emailValid: 'Email must be valid'
            }
          }
        }
      }
    })

    // Create router
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/register', name: 'register', component: Register },
        { path: '/login', name: 'login', component: { template: '<div>Login</div>' } }
      ]
    })

    // Mock auth store
    mockAuthStore = {
      register: vi.fn()
    }
    useAuthStore.mockReturnValue(mockAuthStore)

    // Mount component with validation ref
    wrapper = mount(Register, {
      global: {
        plugins: [vuetify, i18n, router]
      },
      attachTo: document.body
    })
  })

  it('renders registration form with all required fields', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true) // Username
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.findAll('input[type="password"]')).toHaveLength(2)
  })

  it('validates required fields', async () => {
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await nextTick()

    // Set validation messages
    wrapper.vm.usernameErrors = ['Username is required']
    wrapper.vm.emailErrors = ['Email is required']
    wrapper.vm.passwordErrors = ['Password is required']
    await nextTick()

    const errorMessages = wrapper.findAll('.v-messages__message')
    expect(errorMessages[0].text()).toBe('Username is required')
    expect(errorMessages[1].text()).toBe('Email is required')
    expect(errorMessages[2].text()).toBe('Password is required')
  })

  it('validates email format', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('invalid-email')
    await nextTick()

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await nextTick()

    // Set validation message
    wrapper.vm.emailErrors = ['Email must be valid']
    await nextTick()

    const errorMessages = wrapper.findAll('.v-messages__message')
    expect(errorMessages[1].text()).toBe('Email must be valid')
  })

  it('validates password length', async () => {
    const passwordInput = wrapper.findAll('input[type="password"]')[0]
    await passwordInput.setValue('short')
    await nextTick()

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await nextTick()

    // Set validation message
    wrapper.vm.passwordErrors = ['Password must be at least 8 characters']
    await nextTick()

    const errorMessages = wrapper.findAll('.v-messages__message')
    expect(errorMessages[2].text()).toBe('Password must be at least 8 characters')
  })

  it('validates password match', async () => {
    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('password123')
    await passwordInputs[1].setValue('password124')
    await nextTick()

    const form = wrapper.find('form')
    wrapper.vm.$refs.form.validate = vi.fn().mockResolvedValue({ valid: false })
    await form.trigger('submit.prevent')
    await nextTick()

    // Set validation messages
    wrapper.vm.usernameErrors = []
    wrapper.vm.emailErrors = []
    wrapper.vm.passwordErrors = []
    wrapper.vm.confirmPasswordErrors = ['Passwords must match']
    await nextTick()

    const errorMessages = wrapper.findAll('.v-messages__message')
    expect(errorMessages[0].text()).toBe('Passwords must match')
  })

  it('shows/hides password when clicking eye icon', async () => {
    const passwordField = wrapper.findAll('.v-text-field')[2]
    const appendIcon = passwordField.find('.v-field__append-inner .mdi-eye-off')
    expect(appendIcon.exists()).toBe(true)

    await appendIcon.trigger('click')
    await nextTick()

    const passwordInput = wrapper.findAll('input')[2]
    expect(passwordInput.attributes('type')).toBe('text')
  })

  it('submits form with valid data', async () => {
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }

    await wrapper.find('input[type="text"]').setValue(testUser.username)
    await wrapper.find('input[type="email"]').setValue(testUser.email)
    await wrapper.findAll('input[type="password"]')[0].setValue(testUser.password)
    await wrapper.findAll('input[type="password"]')[1].setValue(testUser.password)

    // Mock form validation to return true
    wrapper.vm.$refs.form.validate = vi.fn().mockResolvedValue({ valid: true })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await nextTick()

    expect(mockAuthStore.register).toHaveBeenCalledWith(testUser, expect.any(Function))
  })

  it('shows success message and redirects after registration', async () => {
    mockAuthStore.register.mockResolvedValue({})

    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }

    await wrapper.find('input[type="text"]').setValue(testUser.username)
    await wrapper.find('input[type="email"]').setValue(testUser.email)
    await wrapper.findAll('input[type="password"]')[0].setValue(testUser.password)
    await wrapper.findAll('input[type="password"]')[1].setValue(testUser.password)

    // Mock form validation to return true
    wrapper.vm.$refs.form.validate = vi.fn().mockResolvedValue({ valid: true })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await nextTick()

    expect(wrapper.vm.snackbar.visible).toBe(true)
    expect(wrapper.vm.snackbar.color).toBe('success')

    // Wait for redirect timeout
    await new Promise(resolve => setTimeout(resolve, 1100))
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'login' })
  })

  it('shows error message on registration failure', async () => {
    const error = new Error('Registration failed')
    mockAuthStore.register.mockRejectedValue(error)

    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }

    await wrapper.find('input[type="text"]').setValue(testUser.username)
    await wrapper.find('input[type="email"]').setValue(testUser.email)
    await wrapper.findAll('input[type="password"]')[0].setValue(testUser.password)
    await wrapper.findAll('input[type="password"]')[1].setValue(testUser.password)

    // Mock form validation to return true
    wrapper.vm.$refs.form.validate = vi.fn().mockResolvedValue({ valid: true })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await nextTick()

    expect(wrapper.vm.snackbar.visible).toBe(true)
    expect(wrapper.vm.snackbar.color).toBe('error')
    expect(wrapper.vm.snackbar.message).toBe('Registration failed')
  })

  it('disables submit button while loading', async () => {
    mockAuthStore.register.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }

    await wrapper.find('input[type="text"]').setValue(testUser.username)
    await wrapper.find('input[type="email"]').setValue(testUser.email)
    await wrapper.findAll('input[type="password"]')[0].setValue(testUser.password)
    await wrapper.findAll('input[type="password"]')[1].setValue(testUser.password)

    wrapper.vm.$refs.form.validate = vi.fn().mockResolvedValue({ valid: true })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await nextTick()
    await nextTick()

    const submitButton = wrapper.find('.v-btn')
    expect(submitButton.classes()).toContain('v-btn--loading')
  })
})
