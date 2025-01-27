import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import eslint from 'vite-plugin-eslint'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    eslint({
      include: [
        'src/**/*.js',
        'src/**/*.vue',
        'src/*.js',
        'src/*.vue',
        'src/**/__tests__/**/*.{js,jsx}',
        'src/**/*.{test,spec}.{js,jsx}'
      ],
      overrideConfigFile: '.eslintrc.cjs'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.{test,spec}.{js,ts}',
        'coverage/**',
        'src/main.js',
        'src/firebase.js'
      ]
    },
    deps: {
      optimizer: {
        web: {
          include: [/vuetify/]
        }
      }
    },
    testTimeout: 10000, // 增加测试超时时间
    // 处理CSS文件
    css: true,
    // 模拟浏览器CSS功能
    server: {
      deps: {
        inline: ['vuetify', 'vuetify/lib/components/VBtn/VBtn.css']
      }
    }
  }
})
