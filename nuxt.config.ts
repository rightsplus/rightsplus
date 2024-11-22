import i18n from './config/i18n'
import postcss from './config/postcss'
import pwa from './config/pwa'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: "RightsPlus",
      meta: [
        { name: 'description', content: '' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, interactive-widget=resizes-content' },
        { name: 'HandheldFriendly', content: 'true' }
      ],
      htmlAttrs: {
        lang: 'de'
      }
    }
  },

  modules: [
    '@nuxtjs/algolia',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@formkit/nuxt',
    '@nuxtjs/supabase',
    '@vue-email/nuxt',
    '@vite-pwa/nuxt',
    "@nuxt/image",
    '@nuxt/content',
  ],

  build: {
    transpile: [
      "primevue",
      "@fortawesome/vue-fontawesome",
      'vue-i18n'
    ]
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: [
        '/', // Add the root path so it's generated
        '/en', '/de' // Include all locale versions here
      ]
    },
    static: true,
  },

  formkit: {
    configFile: './formkit.config.ts',
  },

  image: {
    // format: ['webp']
  },

  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/scss/main.scss',
    '~/assets/css/transitions.css',
  ],

  components: [
    '~/components',
    '~/components/core',
  ],

  pwa,
  i18n,
  postcss,


  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

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
      // stripe: {
      //   key: process.env.STRIPE_KEY,
      // },
      algolia: {
        applicationId: process.env.ALGOLIA_APPLICATION_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
      },
      google: {
        key: process.env.GOOGLE_KEY,
        placeId: process.env.GOOGLE_PLACE_ID
      },
      flight: {
        aviationStack: process.env.AVIATIONSTACK_KEY,
        aviationEdge: process.env.AVIATION_EDGE_KEY,
        key: process.env.APP_KEY,
        appId: process.env.APP_ID
      }
    },
  },

  devtools: {
    enabled: true,
  },

  ssr: true,

  hooks: {
    'pages:extend'(pages) {
      pages.push({
        name: 'root',
        path: '/',
        redirect: '/de' // Redirect to your default locale
      })
    }
  },

  routeRules: {
    '/pdf/**': {
      prerender: false,
      ssr: false
    },
    '/admin/**': {
      prerender: false,
      ssr: false
    },
    '/claim/**': {
      prerender: false,
      ssr: false
    }
  },

  content: {
    documentDriven: {
      page: false,
      navigation: false,
      surround: false
    }
  },

  compatibilityDate: '2024-07-10',
})