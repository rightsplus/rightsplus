import i18n from './config/i18n'
import postcss from './config/postcss'
import mail from './config/mail'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	app: {
		pageTransition: { name: 'page', mode: 'out-in' },
		title: "RightsPlus",
		meta: [
			{ name: 'description', content: '' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
			{ name: 'HandheldFriendly', content: 'true' }

		],
	},
	pwa: {
		manifest: {
			name: 'RightsPlus',
			description: "Fluggastrechte",
			theme_color: '#f97316',
			short_name: 'RightsPlus'
		}
	},
	modules: [
		'@nuxtjs/algolia',
		'@nuxtjs/i18n',
		'@formkit/nuxt',
		'@nuxtjs/supabase',
		'nuxt-mail',
	],
	buildModules: [
		'@nuxtjs/pwa',
	],
	build: {
		transpile: ["primevue"]
	},
	nitro: {
		compressPublicAssets: true,
	},
	formkit: {
		configFile: '~/formkit.config.ts',
	},
	css: [
		'~/assets/css/main.scss',
		'~/assets/css/transitions.css',
		'@fortawesome/fontawesome-svg-core/styles.css',
		"primevue/resources/themes/lara-light-blue/theme.css",
		"primevue/resources/primevue.css"
	],
	i18n,
	postcss,
	sourcemap: {
		server: process.env.NODE_ENV === 'development',
		client: process.env.NODE_ENV === 'development',
	},
	mail,
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
				aviationstack: process.env.AVIATIONSTACK_KEY,
				flighlabs: process.env.FLIGHTLABS_KEY,
				key: process.env.APP_KEY,
				appId: process.env.APP_ID
			}
		},
	}
})
