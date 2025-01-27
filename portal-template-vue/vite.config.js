import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import eslint from 'vite-plugin-eslint'
import { fileURLToPath, URL } from 'node:url'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import imagemin from 'vite-plugin-imagemin'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    // 基础配置
    base: '/',

    // 插件配置
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
      }),

      // Gzip 压缩
      env.VITE_ENABLE_COMPRESS === 'true' &&
        compression({
          verbose: true,
          algorithm: env.VITE_COMPRESS_TYPE || 'gzip',
          threshold: 10240 // 10KB
        }),

      // 构建分析
      env.VITE_ENABLE_ANALYZE === 'true' &&
        visualizer({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true
        }),

      // 图片压缩
      imagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        mozjpeg: {
          quality: 80
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox'
            },
            {
              name: 'removeEmptyAttrs',
              active: false
            }
          ]
        }
      })
    ],

    // 路径解析配置
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    // 构建配置
    build: {
      target: 'es2015',
      outDir: env.VITE_OUTPUT_DIR || 'dist',
      assetsDir: env.VITE_ASSETS_DIR || 'assets',
      cssCodeSplit: true,
      sourcemap: env.VITE_SOURCEMAP === 'true',

      // 代码分割配置
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            // 将 node_modules 中的代码单独打包
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            // 将异步加载的路由组件单独打包
            if (id.includes('src/views/')) {
              return 'pages'
            }
          }
        }
      },

      // 使用 esbuild 进行压缩（Vite 默认）
      minify: 'esbuild',
      esbuild: {
        drop: [
          env.VITE_DROP_CONSOLE === 'true' ? 'console' : null,
          env.VITE_DROP_DEBUGGER === 'true' ? 'debugger' : null
        ].filter(Boolean)
      },

      // 资源内联限制
      assetsInlineLimit: env.VITE_IMAGE_INLINE_SIZE_LIMIT || 4096,

      // 警告大小限制
      chunkSizeWarningLimit: env.VITE_CHUNK_SIZE_WARNING_LIMIT || 2000
    },

    // 开发服务器配置
    server: {
      host: env.VITE_DEV_SERVER_HOST || 'localhost',
      port: parseInt(env.VITE_DEV_SERVER_PORT || 3000),
      open: true,
      cors: true,
      strictPort: false,
      hmr: {
        overlay: false
      }
    },

    // 测试配置
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
      testTimeout: 10000,
      css: true,
      server: {
        deps: {
          inline: ['vuetify', 'vuetify/lib/components/VBtn/VBtn.css']
        }
      }
    },

    // 优化依赖预构建
    optimizeDeps: {
      include: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
      exclude: [],
      esbuildOptions: {
        target: 'es2020'
      }
    },

    // CSS 相关配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/settings.scss";`
        }
      },
      devSourcemap: true
    }
  }
})
