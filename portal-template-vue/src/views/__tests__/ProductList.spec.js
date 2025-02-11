import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductList from '../ProductList.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} }
})

describe('ProductList.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(ProductList, {
      global: {
        plugins: [i18n]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
