import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageSection from '../ImageSection.vue'
import { createVuetifyInstance } from './test-utils'

describe('ImageSection.vue', () => {
  const vuetify = createVuetifyInstance()

  const defaultProps = {
    image: '/test-image.jpg',
    title: 'Test Title'
  }

  function createStub(name, template) {
    return {
      name,
      template: template || `<div data-testid="${name}" v-bind="$attrs"><slot /></div>`,
      inheritAttrs: true
    }
  }

  const SectionTitleStub = {
    name: 'section-title',
    props: {
      title: String,
      subtitle: String,
      centered: Boolean,
      showDivider: Boolean
    },
    template: `
      <div class="section-title">
        <h2>{{ title }}</h2>
        <div v-if="subtitle">{{ subtitle }}</div>
      </div>
    `
  }

  function mountComponent(props = {}, slots = {}) {
    return mount(ImageSection, {
      props: {
        ...defaultProps,
        ...props
      },
      slots,
      global: {
        plugins: [vuetify],
        stubs: {
          'v-container': createStub('v-container', '<div class="v-container"><slot /></div>'),
          'v-row': createStub('v-row', '<div class="v-row" :class="$attrs.class"><slot /></div>'),
          'v-col': createStub('v-col', '<div class="v-col"><slot /></div>'),
          'v-img': createStub('v-img'),
          'v-btn': {
            name: 'v-btn',
            template: '<button type="button" data-testid="v-btn" v-bind="$attrs"><slot /></button>',
            inheritAttrs: true
          },
          'section-title': SectionTitleStub
        }
      }
    })
  }

  it('renders basic content correctly', () => {
    const wrapper = mountComponent({
      subtitle: 'Test Subtitle',
      content: 'Test Content'
    })

    const img = wrapper.find('[data-testid="v-img"]')
    const title = wrapper.findComponent(SectionTitleStub)

    expect(img.attributes('src')).toBe('/test-image.jpg')
    expect(title.props('title')).toBe('Test Title')
    expect(title.props('subtitle')).toBe('Test Subtitle')
    expect(wrapper.find('.text-body-1').text()).toBe('Test Content')
  })

  it('applies image right layout when imageRight is true', () => {
    const wrapper = mountComponent({
      imageRight: true
    })
    const row = wrapper.find('.v-row')
    expect(row.classes()).toContain('flex-row-reverse')
  })

  it('aligns text with image position', () => {
    const wrapper = mountComponent({
      imageRight: true,
      alignTextWithImage: true
    })
    const contentCol = wrapper.findAll('.v-col').at(1)
    expect(contentCol.find('.text-right').exists()).toBe(true)
  })

  it('renders image with custom dimensions', () => {
    const wrapper = mountComponent({
      imageWidth: 500,
      imageHeight: 300,
      imageClass: 'custom-image'
    })
    const img = wrapper.find('[data-testid="v-img"]')
    expect(img.attributes('width')).toBe('500')
    expect(img.attributes('height')).toBe('300')
    expect(img.classes()).toContain('custom-image')
  })

  it('renders button with correct props when buttonText is provided', async () => {
    const wrapper = mountComponent({
      buttonText: 'Click Me',
      buttonColor: 'secondary',
      buttonVariant: 'outlined',
      buttonLink: '/test',
      buttonHref: 'https://example.com',
      buttonTarget: '_blank'
    })

    // 等待DOM更新
    await wrapper.vm.$nextTick()

    const button = wrapper.find('[data-testid="v-btn"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Click Me')
    expect(button.attributes()).toEqual(
      expect.objectContaining({
        color: 'secondary',
        variant: 'outlined',
        to: '/test',
        href: 'https://example.com',
        target: '_blank'
      })
    )
  })

  it('does not render button when buttonText is empty', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="v-btn"]').exists()).toBe(false)
  })

  it('renders slot content instead of content prop', () => {
    const slotContent = '<p>Custom slot content</p>'
    const wrapper = mountComponent({ content: 'Default Content' }, { default: slotContent })
    expect(wrapper.find('.text-body-1').html()).toContain(slotContent)
  })

  it('applies default values correctly', () => {
    const wrapper = mountComponent()
    const img = wrapper.find('[data-testid="v-img"]')
    const title = wrapper.findComponent(SectionTitleStub)

    expect(img.attributes('cover')).toBe('true')
    expect(title.props('centered')).toBe(false)
    expect(title.props('showDivider')).toBe(false)
  })
})
