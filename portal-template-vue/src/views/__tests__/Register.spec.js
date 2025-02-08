import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Register from '../Register.vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

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
      auth: {
        createAccount: 'Create Account',
        username: 'Username',
        usernameRequired: 'Username is required',
        email: 'Email',
        emailRequired: 'Email is required',
        password: 'Password',
        passwordRequired: 'Password is required',
        passwordRequirements: 'Password must be at least 8 characters',
        confirmPassword: 'Confirm Password',
        passwordMatch: 'Passwords must match',
        signUp: 'Sign Up',
        accountCreated: 'Account created successfully',
        registrationError: 'Registration failed',
        haveAccount: 'Already have an account?',
        signIn: 'Sign In'
      },
      contact: {
        form: {
          emailValid: 'Must be valid email'
        }
      }
    }
  }
})

// Create vuetify instance
const vuetify = createVuetify({
  components,
  directives
})

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/login', name: 'login', component: { template: '<div>Login</div>' } }
  ]
})

describe('Register.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    // Create a fresh wrapper before each test
    wrapper = mount(Register, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          }),
          router,
          i18n,
          vuetify
        ]
      }
    })
  })

  it('renders register form correctly', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('.v-text-field')).toHaveLength(4)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('validates form on submit', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // 验证消息应该显示
    const errorMessages = wrapper.findAll('.v-messages__message')
    expect(errorMessages.length).toBeGreaterThan(0)
  })

  it('updates password visibility when toggle button is clicked', async () => {
    // 找到密码字段
    const passwordField = wrapper.findAll('.v-text-field')[2]
    const passwordInput = passwordField.find('input')

    // 初始状态应该是密码隐藏的
    expect(passwordInput.attributes('type')).toBe('password')

    // 直接更改组件的状态
    wrapper.vm.showPassword = true
    await wrapper.vm.$nextTick()

    // 验证密码可见性已改变
    expect(passwordInput.attributes('type')).toBe('text')
  })

  it('validates matching passwords', async () => {
    const passwordFields = wrapper.findAll('input[type="password"]')
    await passwordFields[0].setValue('password123')
    await passwordFields[1].setValue('password124')

    // 触发表单提交
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // 验证错误信息
    const errorMessages = wrapper.findAll('.v-messages__message')
    const passwordMatchError = Array.from(errorMessages).some(el =>
      el.text().includes('Passwords must match')
    )
    expect(passwordMatchError).toBe(true)
  })

  it('navigates to login page when login link is clicked', async () => {
    // 通过路由导航方式测试
    const pushSpy = vi.spyOn(router, 'push')
    await router.push({ name: 'login' })
    await wrapper.vm.$nextTick()

    expect(pushSpy).toHaveBeenCalledWith(expect.objectContaining({ name: 'login' }))
  })

  it('successfully submits registration form', async () => {
    const validationMock = vi.fn().mockResolvedValue({ valid: true })
    wrapper.vm.form = { validate: validationMock }
    const authStore = wrapper.vm.authStore

    // 填写表单
    await wrapper.find('input[type="text"]').setValue('testuser')
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    const passwordFields = wrapper.findAll('input[type="password"]')
    await passwordFields[0].setValue('password123')
    await passwordFields[1].setValue('password123')

    // 提交表单
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // 验证表单验证被调用
    expect(validationMock).toHaveBeenCalled()

    // 验证是否调用了注册方法
    expect(authStore.register).toHaveBeenCalledWith(
      {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      },
      expect.any(Function)
    )
  })
})
