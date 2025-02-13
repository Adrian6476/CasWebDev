import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/vue'
import * as matchers from '@testing-library/jest-dom/matchers'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Handle Vuetify CSS import
// @ts-ignore
// eslint-disable-next-line
global.CSS = { supports: () => false }

expect.extend(matchers)

// 全局Vuetify实例
export const vuetify = createVuetify({
  components,
  directives
})

// 清理测试
afterEach(() => {
  cleanup()
})
