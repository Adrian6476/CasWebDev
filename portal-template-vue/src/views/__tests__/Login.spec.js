import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import Home from '../Home.vue'
import Login from '../Login.vue'
import { useAuthStore } from '@/store/auth'

vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}))

describe('Login.vue', () => {
  let wrapper
  let mockAuthStore
  let router
  let mockPush

  beforeEach(async () => {
    // Setup Vuetify
    const vuetify = createVuetify({
      components,
      directives
    })

    // Setup i18n
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          'auth.login': 'Login',
          'auth.email': 'Email',
          'auth.password': 'Password',
          'auth.rememberMe': 'Remember me',
          'auth.signIn': 'Sign In',
          'auth.emailRequired': 'Email is required',
          'auth.emailValid': 'Email must be valid',
          'auth.passwordRequired': 'Password is required',
          'auth.forgotPassword': 'Forgot Password?',
          'auth.noAccount': "Don't have an account?",
          'auth.signUp': 'Sign up'
        }
      }
    })

    // Setup router with mock push
    mockPush = vi.fn()
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/auth/login', name: 'Login', component: Login },
        { path: '/auth/register', name: 'Register', component: Home },
        { path: '/auth/forgot-password', name: 'ForgotPassword', component: Home }
      ]
    })
    router.push = mockPush

    // Setup auth store
    mockAuthStore = {
      login: vi.fn().mockResolvedValue({ success: true }),
      loading: false,
      error: null
    }
    useAuthStore.mockReturnValue(mockAuthStore)

    // Mount component with initial data
    wrapper = mount(Login, {
      global: {
        plugins: [vuetify, i18n, router],
        stubs: {
          VApp: true,
          VMain: true,
          VContainer: {
            template: '<div class="v-container"><slot/></div>'
          },
          VRow: {
            template: '<div class="v-row"><slot/></div>'
          },
          VCol: {
            template: '<div class="v-col"><slot/></div>'
          },
          VCard: {
            template: '<div class="v-card"><slot/></div>'
          },
          VCardTitle: {
            template: '<div class="v-card-title"><slot/></div>'
          },
          VForm: {
            template: '<form @submit.prevent="onSubmit"><slot/></form>',
            methods: {
              validate: () => Promise.resolve({ valid: true }),
              onSubmit(e) {
                this.$emit('submit', e)
              }
            }
          },
          VTextField: {
            props: ['modelValue'],
            template: `
              <input
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                class="v-text-field"
              />
            `,
            emits: ['update:modelValue']
          },
          VCheckbox: {
            props: ['modelValue'],
            template: `
              <input
                type="checkbox"
                :checked="modelValue"
                @change="$emit('update:modelValue', $event.target.checked)"
                class="v-checkbox"
              />
            `,
            emits: ['update:modelValue']
          },
          VBtn: {
            props: ['loading', 'disabled'],
            template: `
              <button
                type="submit"
                :disabled="loading || disabled"
                class="v-btn"
                @click="$emit('click')"
              >
                <slot/>
              </button>
            `,
            emits: ['click']
          }
        }
      },
      data() {
        return {
          email: '',
          password: '',
          rememberMe: false,
          loading: false
        }
      }
    })

    // Initialize route
    await router.push('/auth/login')
    await router.isReady()
    await flushPromises()
  })

  it('renders login form', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('.v-text-field')).toHaveLength(2)
    expect(wrapper.find('.v-checkbox').exists()).toBe(true)
    expect(wrapper.find('.v-btn').exists()).toBe(true)
  })

  it('handles form submission', async () => {
    wrapper.vm.email = 'test@example.com'
    wrapper.vm.password = 'password123'

    await wrapper.vm.handleLogin()
    await flushPromises()

    expect(mockAuthStore.login).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false
      }),
      expect.any(Function)
    )
  })

  it('shows loading state', async () => {
    wrapper.vm.loading = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.v-btn').attributes('disabled')).toBeDefined()
  })

  it('navigates after successful login', async () => {
    wrapper.vm.email = 'test@example.com'
    wrapper.vm.password = 'password123'

    const loginPromise = wrapper.vm.handleLogin()
    await flushPromises()
    await loginPromise

    // Wait for navigation delay
    await new Promise(resolve => setTimeout(resolve, 1100))
    await flushPromises()

    expect(mockPush).toHaveBeenCalledWith({ name: 'Home' })
  })
})
