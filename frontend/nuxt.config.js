export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'frontend',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // '~/assets/vendors/css/vendors.min.css',
    '~/assets/css/bootstrap.min.css',
    '~/assets/css/bootstrap-extended.min.css',
    '~/assets/css/colors.min.css',
    '~/assets/css/components.min.css',
    '~/assets/css/themes/dark-layout.min.css',
    '~/assets/css/themes/semi-dark-layout.min.css',
    '~/assets/css/core/menu/menu-types/horizontal-menu.min.css',
    '~/assets/css/pages/page-misc.min.css'
    // '~/assets/css/style.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/contract.js', mode: 'all'},
    {src: '~/plugins/helpers.js', mode: 'all'},
    // {src: '~/plugins/contract-abi.js', mode: 'all'}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  publicRuntimeConfig: {
    baseURL: process.env.HARDHAT_NETWORK_BASE_URL
  },
  privateRuntimeConfig: {
    contractAddress: process.env.CONTRACT_ADDRESS
  },
  ssr: false
}
