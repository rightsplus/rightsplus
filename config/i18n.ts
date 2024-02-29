import type { LocaleObject, ModuleOptions } from "@nuxtjs/i18n"
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
  defaultLocale: 'de',
  strategy: 'prefix_except_default',
  vueI18n: 'config/i18n.options.ts'
} as ModuleOptions

export default options