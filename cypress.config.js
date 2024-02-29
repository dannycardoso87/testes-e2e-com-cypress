const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  e2e: {
    //baseUrl: 'https://app.proposify.com',
    baseUrl: 'https://notes-serverless-app.com',
    env: {
      viewportWidthBreakpoint: 768,
    },
    defaultCommandTimeout: 5000,
    requestTimeout: 6000,
    video: true,
  },
  projectId: 'h14e78',
})
