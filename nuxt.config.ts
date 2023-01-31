import i18n from './config/i18n'
import postcss from './config/postcss'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	app: {
		pageTransition: { name: 'page', mode: 'out-in' },
		title: "Heidi Vogler – Reittherapie, Traumabearbeitung, Waldbaden",
		meta: [
			{ name: 'description', content: 'Hier wirst du deinen Weg finden und kannst im Wald oder mit den Pferden einen Prozess der Heilung zu beginnen.' }
		],
	},
	modules: [
		'@nuxtjs/strapi',
		'@nuxtjs/i18n',
		'@formkit/nuxt'
	],
	nitro: {
		compressPublicAssets: true,
	},
	formkit: {
		configFile: '~/config/formkit.config.ts',
	},
	strapi: {
		url: process.env.API_BASE || 'http://localhost:1337',
	},
	css: [
		'~/assets/css/main.css',
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
			}
		}
	},
})
