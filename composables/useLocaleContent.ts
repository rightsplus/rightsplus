import i18nConfig from '@/config/i18n'
export type RouteName = keyof typeof i18nConfig.pages
export default () => {
	const { locale, fallbackLocale, defaultLocale } = useI18n()
	const route = useRoute()
	const router = useRouter();
	const switchLocalePath = useSwitchLocalePath();


	const localeName = (path: string) => {
		// Remove leading slash and split to get locale and route parts
		const cleanPath = path.replace(/^\//, '')
		const pathParts = cleanPath.split('/')

		// Handle both /de/impressum and impressum formats
		const routePath = pathParts.length > 1 ? `/${pathParts[1]}` : `/${pathParts[0]}`

		// Find matching route name by checking all locales for each page
		const [match] = Object.entries(i18nConfig.pages).find(([_, translations]) =>
			Object.values(translations).some(localePath => localePath === routePath)
		) || []
		return match as RouteName || ''
	}
	const localePath = (name: RouteName, code = locale.value) => {
		const route = i18nConfig.pages[name]
		type AvailableLocale = keyof typeof route
		if (!route) return `/${name}`
		let path = route[code as AvailableLocale]
		const fallbacks = [code, fallbackLocale.value, defaultLocale, Object.keys(route)[0]]
		for (let l in fallbacks) {
			if (route[l as AvailableLocale]) {
				code = l
				path = route[l as AvailableLocale]
				break;
			}
		}

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
		return `${localePrefix}${path}`
	}
	const localeRoute = (name: RouteName, code = locale.value) => {
		return new URL(localePath(name, code), window.location.origin)
	}

	const switchLocale = (code: string, replaceState?: boolean) => {
		const currentPage = localeName(route.fullPath)
		// if (!currentPage) return switchLocalePath(code)
		if (replaceState) {
			locale.value = code;
			replaceUrl(localeRoute(currentPage, code).href)
			return
		}
		return localePath(currentPage, code)
	}
	return { localePath, localeName, switchLocale }
}
const replaceUrl = (url?: string, title = "") => {
	if (url) window.history.replaceState({}, title, url);
};