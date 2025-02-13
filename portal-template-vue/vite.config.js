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
    // Base configuration
    base: '/',

    // Plugin configuration
    plugins: [
      vue(),
      vuetify(),
      // Temporarily disable eslint plugin due to compatibility issues
      // eslint({
      //   include: [
      //     'src/**/*.js',
      //     'src/**/*.vue',
      //     'src/*.js',
      //     'src/*.vue',
      //     'src/**/__tests__/**/*.{js,jsx}',
      //     'src/**/*.{test,spec}.{js,jsx}'
      //   ],
      //   overrideConfigFile: '.eslintrc.cjs'
      // }),

      // Gzip compression
      env.VITE_ENABLE_COMPRESS === 'true' &&
        compression({
          verbose: true,
          algorithm: env.VITE_COMPRESS_TYPE || 'gzip',
          threshold: 10240 // 10KB
        }),

      // Build analysis
      env.VITE_ENABLE_ANALYZE === 'true' &&
        visualizer({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true
        })

      // Image compression
      // Temporarily disable imagemin plugin to resolve potential conflicts
      // imagemin({
      //   gifsicle: {
      //     optimizationLevel: 7,
      //     interlaced: false
      //   },
      //   optipng: {
      //     optimizationLevel: 7
      //   },
      //   mozjpeg: {
      //     quality: 80
      //   },
      //   pngquant: {
      //     quality: [0.8, 0.9],
      //     speed: 4
      //   },
      //   svgo: {
      //     plugins: [
      //       {
      //         name: 'removeViewBox'
      //       },
      //       {
      //         name: 'removeEmptyAttrs',
      //         active: false
      //       }
      //     ]
      //   }
      // })
    ],

    // Path resolution configuration
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    // Build configuration
    build: {
      target: 'es2022',
      outDir: env.VITE_OUTPUT_DIR || 'dist',
      assetsDir: env.VITE_ASSETS_DIR || 'assets',
      cssCodeSplit: true,
      sourcemap: env.VITE_SOURCEMAP === 'true',

      // Code splitting configuration
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            // Separate node_modules code
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            // Separate the asynchronously loaded route components
            if (id.includes('src/views/')) {
              return 'pages'
            }
          }
        }
      },

      // Use esbuild for minification (default in Vite)
      minify: 'esbuild',
      esbuild: {
        drop: [
          env.VITE_DROP_CONSOLE === 'true' ? 'console' : null,
          env.VITE_DROP_DEBUGGER === 'true' ? 'debugger' : null
        ].filter(Boolean)
      },

      // Asset inline limit
      assetsInlineLimit: env.VITE_IMAGE_INLINE_SIZE_LIMIT || 4096,

      // Warning size limit
      chunkSizeWarningLimit: env.VITE_CHUNK_SIZE_WARNING_LIMIT || 2000
    },

    // Development server configuration
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_DEV_SERVER_PORT || 3001),
      open: false,
      cors: true,
      strictPort: false,
      hmr: {
        overlay: false
      }
    },

    // Test configuration
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

    // Optimize dependency pre-build
    optimizeDeps: {
      include: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
      exclude: ['chunk-NA75W7IT'], // Exclude problematic dependency
      esbuildOptions: {
        target: 'es2020'
      }
    },

    // CSS related configuration
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
