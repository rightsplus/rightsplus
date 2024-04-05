import i18n from './config/i18n'
import postcss from './config/postcss'
import pwa from './config/pwa'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: "RightsPlus",
      meta: [
        { name: 'description', content: '' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, interactive-widget=resizes-content' },
        { name: 'HandheldFriendly', content: 'true' }
      ],
    }
  },
  modules: [
    '@nuxtjs/algolia',
    '@nuxtjs/i18n',
    '@formkit/nuxt',
    '@nuxtjs/supabase',
    '@vue-email/nuxt',
  ],
  buildModules: [
    '@nuxtjs/pwa',
  ],
  build: {
    transpile: [
      // "primevue",
      "@fortawesome/vue-fontawesome",
      'vue-i18n'
    ]
  },
  nitro: {
    compressPublicAssets: true,
  },
  formkit: {
    configFile: './formkit.config.ts',
  },
  css: [
    '~/assets/css/main.scss',
    '~/assets/css/transitions.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    // "primevue/resources/themes/lara-light-blue/theme.css",
    "primevue/resources/primevue.css"
  ],
  components: [
    '~/components',
    '~/components/core',
  ],
  pwa,
  i18n,
  postcss,
  sourcemap: {
    server: process.env.NODE_ENV === 'development',
    client: process.env.NODE_ENV === 'development',
  },
  vueEmail: {
    baseUrl: 'https://rightsplus.up.railway.app/',
    autoImport: true,
  },
  runtimeConfig: {
    public: {
      stripe: {
        key: process.env.STRIPE_KEY,
      },
      google: {
        key: process.env.GOOGLE_KEY,
        placeId: process.env.GOOGLE_PLACE_ID
      },
      flight: {
        aviationEdge: process.env.AVIATION_EDGE_KEY,
        key: process.env.APP_KEY,
        appId: process.env.APP_ID
      }
    },
  },
})
