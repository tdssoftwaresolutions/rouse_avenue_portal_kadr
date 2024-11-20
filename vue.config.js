const webpack = require('webpack')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? process.env.VUE_BASE_URL
    : '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your Express server's port
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: 'mapbox-gl'
      })
    ],
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.common.js',
        'jquery': 'jquery/src/jquery.js'
      }
    }
  }
}
