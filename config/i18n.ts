import type { LocaleObject, ModuleOptions } from "@nuxtjs/i18n"

const options: ModuleOptions = {
  langDir: 'locales',
  defaultLocale: 'de',
  strategy: 'prefix_except_default',
  vueI18n: 'config/i18n.options.ts'
} as ModuleOptions

export default options