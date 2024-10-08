const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },

  devServer: {
    host: '0.0.0.0',
    allowedHosts: 'all',
    client: {
      webSocketURL: {
        protocol: 'wss',
        port: 8080,
      }
    },
    https: true,
  }
})
