export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Donation Dapp',
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
    ],
    script: [
      {
        src: '/assets/libs/jquery/jquery.min.js',
        type: 'text/javascript',
        body: true,
        async: true
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'assets/css/tailwind.css',
    'assets/libs/tobii/css/tobii.min.css',
    'assets/libs/tiny-slider/tiny-slider.css',
    'assets/libs/iconscout/unicons/css/line.css',
    'assets/css/icons.css',
    '~/assets/css/style.css'

    // <script src="assets/libs/gumshoejs/gumshoe.polyfills.min.js"></script>
    // <script src="assets/libs/tobii/js/tobii.min.js"></script>
    // <script src="assets/libs/tiny-slider/min/tiny-slider.js"></script>
    // <script src="assets/libs/feather-icons/feather.min.js"></script>
    // <script src="assets/js/plugins.init.js"></script>
    // <script src="assets/js/app.js"></script>

  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/contract.js'},
    {src: '~/plugins/helpers.js'}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    // '@nuxtjs/tailwindcss'
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
