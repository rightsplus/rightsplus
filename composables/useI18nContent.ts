import type { CollectionQueryBuilder, Collections } from '@nuxt/content';
import i18nConfig from '@/config/i18n'

export default function <T extends keyof Collections>(): {
	routeName: ComputedRef<keyof typeof i18nConfig.pages>;
	queryLocaleContent: (path: string) => CollectionQueryBuilder<Collections['pages']>
}
export default function <T extends keyof Collections>(
	collection?: T
): {
	routeName: ComputedRef<keyof typeof i18nConfig.pages>;
	queryLocaleContent: (path: string) => CollectionQueryBuilder<Collections[T]>
}
export default function (
	collection: keyof Collections = 'pages'
): {
	routeName: ComputedRef<keyof typeof i18nConfig.pages>;
	queryLocaleContent: (path: string) => CollectionQueryBuilder<Collections[keyof Collections]>
} {
	const route = useRoute()
	const name = computed(() => {
		return getRouteNameFromPath(route.path, i18nConfig.pages || {}) as keyof typeof i18nConfig.pages
	})

	const queryLocaleContent = (path: string) => {
		const locales = i18nConfig.locales
		if (!path) return queryCollection(collection).path(`/${collection}/`)
		const [, localePath] = path.split('/')
		if (!locales.some(e => e.code === localePath)) {
			path = `/${i18nConfig.defaultLocale}${path}`
		}
		return queryCollection(collection).path(`/${collection}${path}`)
	}

	return {
		routeName: name,
		queryLocaleContent
	}
}