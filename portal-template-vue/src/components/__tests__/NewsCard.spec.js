import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { vuetify } from '../../../vitest.setup'
import NewsCard from '../NewsCard.vue'

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      news: {
        categories: {
          technology: 'Technology',
          business: 'Business'
        },
        readMore: 'Read More'
      }
    }
  }
})

// 测试数据
const mockProps = {
  title: 'Test News Title',
  abstract: 'This is a test news abstract',
  cover: 'https://example.com/image.jpg',
  date: '2024-01-27',
  category: 'technology',
  link: '/news/1',
  imageHeight: 200
}

describe('NewsCard.vue', () => {
  const mountComponent = (props = mockProps) => {
    return mount(NewsCard, {
      props,
      global: {
        plugins: [vuetify, i18n]
      }
    })
  }

  it('renders properly with all props', () => {
    const wrapper = mountComponent()

    // 测试标题渲染
    expect(wrapper.find('.news-title').text()).toBe(mockProps.title)

    // 测试摘要渲染
    expect(wrapper.find('.v-card-text').text()).toBe(mockProps.abstract)

    // 测试图片渲染 - 通过props检查
    const vImg = wrapper.findComponent({ name: 'VImg' })
    expect(vImg.props('src')).toBe(mockProps.cover)

    // 测试分类渲染
    expect(wrapper.find('.category-badge').text()).toBe('Technology')

    // 测试阅读更多链接
    const readMoreBtn = wrapper.findComponent({ name: 'VBtn' })
    expect(readMoreBtn.props('to')).toBe(mockProps.link)
    expect(readMoreBtn.text()).toContain('Read More')
  })

  it('formats date correctly', () => {
    const wrapper = mountComponent()
    const dateText = wrapper.find('.date-badge').text()
    expect(dateText).toMatch(/January 27, 2024/)
  })

  it('changes elevation on hover', async () => {
    const wrapper = mountComponent()
    const vCard = wrapper.findComponent({ name: 'VCard' })

    // 初始状态
    expect(wrapper.vm.hover).toBe(false)
    expect(vCard.props('elevation')).toBe(1)

    // 触发hover
    await vCard.trigger('mouseenter')
    expect(wrapper.vm.hover).toBe(true)
    expect(vCard.props('elevation')).toBe(4)

    // 取消hover
    await vCard.trigger('mouseleave')
    expect(wrapper.vm.hover).toBe(false)
    expect(vCard.props('elevation')).toBe(1)
  })

  it('handles invalid date gracefully', () => {
    const props = {
      ...mockProps,
      date: 'invalid-date'
    }
    const wrapper = mountComponent(props)
    const dateText = wrapper.find('.date-badge').text()
    expect(dateText).toBe('invalid-date')
  })

  it('applies default image height when not provided', () => {
    const props = { ...mockProps }
    delete props.imageHeight
    const wrapper = mountComponent(props)
    const vImg = wrapper.findComponent({ name: 'VImg' })
    expect(vImg.props('height')).toBe(200)
  })

  it('applies custom image height when provided', () => {
    const props = {
      ...mockProps,
      imageHeight: 300
    }
    const wrapper = mountComponent(props)
    const vImg = wrapper.findComponent({ name: 'VImg' })
    expect(vImg.props('height')).toBe(300)
  })
})
