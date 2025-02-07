import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionTitle from '../SectionTitle.vue'
import { createVuetifyInstance } from './test-utils'

describe('SectionTitle.vue', () => {
  const vuetify = createVuetifyInstance()

  function mountComponent(props = {}) {
    return mount(SectionTitle, {
      props: {
        title: 'Test Title',
        ...props
      },
      global: {
        plugins: [vuetify]
      }
    })
  }

  it('renders title correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('h2').text()).toBe('Test Title')
  })

  it('renders subtitle when provided', () => {
    const wrapper = mountComponent({
      subtitle: 'Test Subtitle'
    })
    expect(wrapper.find('.text-subtitle-1').text()).toBe('Test Subtitle')
  })

  it('applies centered class when centered prop is true', () => {
    const wrapper = mountComponent({
      centered: true
    })
    expect(wrapper.classes()).toContain('centered')
  })

  it('shows divider by default', () => {
    const wrapper = mountComponent()
    expect(wrapper.findComponent({ name: 'v-divider' }).exists()).toBe(true)
  })

  it('hides divider when showDivider is false', () => {
    const wrapper = mountComponent({
      showDivider: false
    })
    expect(wrapper.findComponent({ name: 'v-divider' }).exists()).toBe(false)
  })

  it('applies custom classes to title and subtitle', () => {
    const wrapper = mountComponent({
      subtitle: 'Test Subtitle',
      titleClass: 'custom-title',
      subtitleClass: 'custom-subtitle'
    })
    expect(wrapper.find('h2').classes()).toContain('custom-title')
    expect(wrapper.find('.text-subtitle-1').classes()).toContain('custom-subtitle')
  })
})
