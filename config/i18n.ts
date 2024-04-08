import type { ModuleOptions } from "@nuxtjs/i18n"

export type LocaleObject = {
	code: string;
	name: string;
	file: string;
	iso: string;
}

export const locales: LocaleObject[] = [
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
	},
	{
		code: 'fr',
		iso: 'fr-FR',
		name: 'Français',
		file: 'fr.json',
	},
	{
		code: 'nl',
		iso: 'nl-NL',
		name: 'Nederlands',
		file: 'nl.json',
	},
]
const options: ModuleOptions = {
	locales,
	langDir: 'locales',
	defaultLocale: 'en',
	strategy: 'prefix',
	customRoutes: 'config',
	vueI18n: 'config/i18n.options.ts',
	pages: {
		"terms-and-conditions": {
			"en": "/terms-and-conditions",
			"de": "/agb",
			"fr": "/conditions-generales",
			"nl": "/algemene-voorwaarden"
		},
		"legal-notice": {
			"en": "/legal-notice",
			"de": "/impressum",
			"fr": "/mentions-legales",
			"nl": "/juridische-kennisgeving"
		},
		"privacy": {
			"en": "/privacy",
			"de": "/datenschutz",
			"fr": "/politique-de-confidentialite",
			"nl": "/privacybeleid"
		},
		"about-rights-plus": {
			"en": "/about-rights-plus",
			"de": "/ueber-rights-plus",
			"fr": "/a-propos-de-rights-plus",
			"nl": "/over-rights-plus"
		},
		"prices-and-services": {
			"en": "/prices-and-services",
			"de": "/preise-und-leistungen",
			"fr": "/tarifs-et-services",
			"nl": "/prijzen-en-diensten"
		},
		"your-passenger-rights": {
			"en": "/your-passenger-rights",
			"de": "/deine-fluggastrechte",
			"fr": "/vos-droits-en-tant-que-passager",
			"nl": "/jouw-passagiersrechten"
		},
		"delayed-and-cancelled-flights": {
			"en": "/delayed-and-cancelled-flights",
			"de": "/verspaetete-und-annullierte-fluege",
			"fr": "/vols-retardes-et-annules",
			"nl": "/vertraagde-en-geannuleerde-vluchten"
		},
		"claim": {
			"en": "/claim",
			"de": "/anspruch",
			"fr": "/demande",
			"nl": "/claim"
		},
		"claim-new": {
			"en": "/claim/new",
			"de": "/anspruch/neu",
			"fr": "/demande/nouvelle",
			"nl": "/claim/nieuw"
		},
		"claim-id": {
			"en": "/claim/[id]",
			"de": "/anspruch/[id]",
			"fr": "/demande/[id]",
			"nl": "/claim/[id]"
		}
	}
} as ModuleOptions

export default options