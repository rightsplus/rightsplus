
import i18nConfig from '@/config/i18n'
import type { ParsedContent } from '@nuxt/content'
type Content = ParsedContent & {
	layout?: string
	category?: string
	title?: string
	lead?: string
}
export default () => {
	const route = useRoute()
	const contentState = useContentState()

	const name = computed(() => {
		return getRouteNameFromPath(route.path, i18nConfig.pages || {})
	})

	const currentContent = computed<Content>(() => name.value && contentState.pages.value[name.value] || {} as Content)

	const query = async (): Promise<ParsedContent | {}> => {
		try {
			let content
			// try {
			// 	content = await queryContent(`/${i18n.locale.value}/${name.value}`).findOne()
			// } catch (error) {
			// 	content = await queryContent(`/${i18nConfig.defaultLocale}/${name.value}`).findOne()
			// }
			if (!name.value || !content) return {}
			contentState.pages.value[name.value] = content
			return content
		} catch (error) {
			console.error("error", error)
			return {}
		}
	}

	const queryLocaleContent = (path: string) => {
		const locales = i18nConfig.locales
		if (!path) return queryContent('/')
		const [, localePath] = path.split('/')
		if (!locales.some(e => e.code === localePath)) {
			path = `/${i18nConfig.defaultLocale}${path}`
		}
		return queryContent(path)
	}

	return {
		contentState,
		currentContent,
		query,
		routeName: name,
		queryLocaleContent
	}
}