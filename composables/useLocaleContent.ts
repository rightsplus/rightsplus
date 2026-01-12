import i18nConfig from '@/config/i18n'
export type RouteName = keyof typeof i18nConfig.pages
export default () => {
	const { locale, fallbackLocale, defaultLocale } = useI18n()
	const route = useRoute()
	const router = useRouter();
	const switchLocalePath = useSwitchLocalePath();


	const localeName = (path: string) => {
		const { locales } = i18nConfig

		const [, ...localePath] = path.split('/')

		// Handle both /de/impressum and impressum formats
		const routePath = locales.some(e => e.code === localePath[0]) ? `/${localePath.slice(1).join("/")}` : `/${localePath.join('/')}`

		console.log(routePath)

		// Find matching route name by checking all locales for each page
		const [match] = Object.entries(i18nConfig.pages).find(([_, translations]) =>
			Object.values(translations).some(localePath => localePath === routePath)
		) || []
		return match as RouteName || ''
	}

	type LocalePathOptions = {
		code?: typeof locale.value,
		params?: Record<string, string>
	}
	const localePath = (name: RouteName | string = route.path, options: LocalePathOptions = {}) => {
		console.log(name, options)
		const route = i18nConfig.pages[name as RouteName]
		type AvailableLocale = keyof typeof route
		if (!route) return `/${name}`
		console.log(route)
		const { params = false } = options
		let code = options.code || locale.value
		let path = route[code as AvailableLocale]
		console.log(path)
		const fallbacks = [code, fallbackLocale.value, defaultLocale, Object.keys(route)[0]]
		for (let l in fallbacks) {
			if (route[l as AvailableLocale]) {
				code = l as AvailableLocale
				path = route[l as AvailableLocale]
				break;
			}
		}
		console.log(path)
		if (!path) return ''
		let localePrefix = ''
		switch (i18nConfig.strategy) {
			case 'prefix':
				localePrefix = `/${code}`
				break;
			case 'prefix_and_default':
			case 'prefix_except_default':
				localePrefix = code !== defaultLocale ? `/${code}` : ''
				break;
			case 'no_prefix':
			default:
				break;
		}
		console.log(path, params, localePrefix, i18nConfig.strategy, defaultLocale)
		const interpolatedPath = params ? path.replace(/\[([^\]]+)\]/g, (_, p) => params[p as keyof typeof params]) : path
		return `${localePrefix}${interpolatedPath}`
	}
	const localeRoute = (name: RouteName, options: LocalePathOptions = {}) => {
		return new URL(localePath(name, options), window.location.origin)
	}

	const switchLocale = (code: typeof locale.value, replaceState?: boolean) => {
		const currentPage = localeName(route.fullPath)
		// if (!currentPage) return switchLocalePath(code)
		if (replaceState) {
			locale.value = code;
			replaceUrl(localeRoute(currentPage, { code }).href)
			return
		}
		return localePath(currentPage, { code })
	}
	return { localePath, localeName, switchLocale }
}
export const replaceUrl = (url?: string, title = "") => {
	console.log(url)
	if (url) window.history.replaceState({}, title, url);
};