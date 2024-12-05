module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: 'usage', // Tells Babel to include polyfills based on the usage of certain features in the code
        corejs: 3 // Tells Babel to use core-js version 3
      }
    ]
  ]
}
