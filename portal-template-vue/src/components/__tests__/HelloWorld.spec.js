import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld.vue'

describe('HelloWorld.vue', () => {
  const defaultProps = {
    msg: 'Test Message'
  }

  function mountComponent(props = {}) {
    return mount(HelloWorld, {
      props: {
        ...defaultProps,
        ...props
      }
    })
  }

  it('renders message correctly', () => {
    const msg = 'Hello Vue 3'
    const wrapper = mountComponent({ msg })
    expect(wrapper.find('h1').text()).toBe(msg)
  })

  it('initializes count as 0', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('button').text()).toContain('count is 0')
  })

  it('increments count when button is clicked', async () => {
    const wrapper = mountComponent()
    const button = wrapper.find('button')

    await button.trigger('click')
    expect(button.text()).toContain('count is 1')

    await button.trigger('click')
    expect(button.text()).toContain('count is 2')
  })

  it('renders documentation links', () => {
    const wrapper = mountComponent()
    const links = wrapper.findAll('a')

    expect(links).toHaveLength(2)
    expect(links[0].attributes('href')).toBe('https://vuejs.org/guide/quick-start.html#local')
    expect(links[1].attributes('href')).toBe(
      'https://vuejs.org/guide/scaling-up/tooling.html#ide-support'
    )
  })

  it('renders read the docs text', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.read-the-docs').text()).toBe(
      'Click on the Vite and Vue logos to learn more'
    )
  })
})
