import type { ModuleOptions, Strategies } from "@nuxtjs/i18n"

export type LocaleObject = {
	code: string;
	name: string;
	file: string;
	iso: string;
}

export const locales = [
	{
		code: 'de',
		iso: 'de-DE',
		name: 'Deutsch',
		file: 'de.json',
	},
	{
		code: 'en',
		iso: 'en-GB',
		name: 'English',
		file: 'en.json',
	}
] as const satisfies LocaleObject[]
const options = {
	locales,
	langDir: 'locales',
	defaultLocale: 'de',
	strategy: "prefix" as Strategies,
	// strategy: "prefix_except_default" as Strategies,
	customRoutes: 'config',
	vueI18n: 'config/i18n.options.ts',
	pages: {
		"index": {
			"en": "/",
			"de": "/",
		},
		"terms-and-conditions": {
			"en": "/terms-and-conditions",
			"de": "/agb",
		},
		"legal-notice": {
			"en": "/legal-notice",
			"de": "/impressum",
		},
		"privacy": {
			"en": "/privacy",
			"de": "/datenschutz",
		},
		"about-rights-plus": {
			"en": "/about-rights-plus",
			"de": "/ueber-rights-plus",
		},
		"prices-and-services": {
			"en": "/prices-and-services",
			"de": "/preise-und-leistungen",
		},
		"your-passenger-rights": {
			"en": "/your-passenger-rights",
			"de": "/deine-fluggastrechte",
		},
		"delayed-and-cancelled-flights": {
			"en": "/delayed-and-cancelled-flights",
			"de": "/verspaetete-und-annullierte-fluege",
		},
		"claim-new": {
			"en": "/claim/new",
			"de": "/anspruch/neu",
		},
		"claim-id": {
			"en": "/claim/[id]",
			"de": "/anspruch/[id]",
		},
		"admin-claims": {
			"en": "/admin/claims",
			"de": "/admin/ansprueche",
		},
		"admin-bookings": {
			"en": "/admin/bookings",
			"de": "/admin/buchungen",
		},
		"admin-flights": {
			"en": "/admin/flights",
			"de": "/admin/fluege",
		},
		"admin-airlines": {
			"en": "/admin/airlines",
			"de": "/admin/airlines",
		}
	}
} satisfies ModuleOptions

export default options