import i18n from './config/i18n'
import postcss from './config/postcss'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	app: {
		pageTransition: { name: 'page', mode: 'out-in' },
		title: "RightsPlus",
		meta: [
			{ name: 'description', content: '' }
		],
	},
	modules: [
		'@nuxtjs/i18n',
		'@formkit/nuxt',
	],
	buildModules: [
		'@nuxtjs/pwa',
	],
	nitro: {
		compressPublicAssets: true,
	},
	formkit: {
		configFile: '~/formkit.config.ts',
	},
	css: [
		'~/assets/css/main.scss',
		'~/assets/css/transitions.css',
		'@fortawesome/fontawesome-svg-core/styles.css'
	],
	i18n,
	postcss,
	runtimeConfig: {
		public: {
			mapbox: {
				token: process.env.MAPBOX_TOKEN,
			},
			email: {
				to: process.env.ADDRESS_TO
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
