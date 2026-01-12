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
    '@nuxt/content'
  ],

  build: {
    transpile: [
      "primevue",
      "@fortawesome/vue-fontawesome",
      'vue-i18n'
    ]
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        }
      }
    }
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: [
        '/', // Add the root path so it's generated
        '/en', '/de' // Include all locale versions here
      ],
    },
    static: process.env.NODE_ENV === 'production',
    logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    devProxy: {
      host: 'localhost',
    },
    // Memory optimizations for production
    minify: process.env.NODE_ENV === 'production',
    experimental: {
      wasm: true
    },
    // Route rules for API endpoints
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Origin': '*',
        }
      }
    },
    // Reduce memory usage by using disk storage for cache
    storage: process.env.NODE_ENV === 'production' ? {
      cache: {
        driver: 'fs',
        base: './.nitro/cache'
      }
    } : undefined
  },

  formkit: {
    configFile: './formkit.config.ts',
  },

  image: {
    format: ['webp'],
    debug: process.env.NODE_ENV === 'development',
    // Limit image sizes to prevent large memory allocations
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // Use quality settings to reduce memory usage
    quality: 80,
    // Limit maximum image dimensions
    densities: [1, 2],
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

  supabase: {
    redirect: false,
  },


  tailwindcss: {
    exposeConfig: process.env.NODE_ENV === 'development',
    viewer: process.env.NODE_ENV === 'development',
  },

  sourcemap: {
    server: process.env.NODE_ENV === 'development',
    client: process.env.NODE_ENV === 'development',
  },

  vueEmail: {
    baseUrl: 'https://rightsplus.up.railway.app/',
    autoImport: true,
    tailwind: {
      plugins: []
    }
  },

  runtimeConfig: {
    public: {
      algolia: {
        applicationId: process.env.ALGOLIA_APPLICATION_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
      },
      google: {
        key: process.env.GOOGLE_KEY,
        placeId: process.env.GOOGLE_PLACE_ID
      },
      flight: {
        aviationStack: process.env.AVIATION_STACK_KEY,
        aviationEdge: process.env.AVIATION_EDGE_KEY,
      }
    },
  },

  devtools: {
    enabled: process.env.NODE_ENV === 'development',

    timeline: {
      enabled: process.env.NODE_ENV === 'development',
    },
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

  compatibilityDate: '2024-07-10',
})