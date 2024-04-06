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
]
const options: ModuleOptions = {
  locales,
  langDir: 'locales',
  defaultLocale: 'en',
  strategy: 'prefix',
	customRoutes: 'config',
  vueI18n: 'config/i18n.options.ts',
	pages: {
		'terms-and-conditions': {
			en: '/terms-and-conditions',
			de: '/agb',
		},
		'legal-notice': {
			en: '/legal-notice',
			de: '/impressum',
		},
		'privacy': {
			en: '/privacy',
			de: '/datenschutz',
		},
		'about-rights-plus': {
			en: '/about-rights-plus',
			de: '/ueber-rights-plus',
		},
		'prices-and-services': {
			en: '/prices-and-services',
			de: '/preise-und-leistungen',
		},
		'your-passenger-rights': {
			en: '/your-passenger-rights',
			de: '/deine-fluggastrechte',
		},
		'delayed-and-cancelled-flights': {
			en: '/delayed-and-cancelled-flights',
			de: '/verspaetete-und-annullierte-fluege',
		},
		'claim': {
			en: '/claim',
			de: '/anspruch',
		},
		'claim-new': {
			en: '/claim/new',
			de: '/anspruch/neu',
		},
		'claim-id': {
			en: '/claim/[id]',
			de: '/anspruch/[id]',
		}
	}
} as ModuleOptions

export default options