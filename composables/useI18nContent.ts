
import i18nConfig from '@/config/i18n'
import type { ParsedContent } from '@nuxt/content'
import type { CustomRoutePages } from '@nuxtjs/i18n'
type Content = ParsedContent & {
	layout?: string
	category?: string
	title?: string
	lead?: string
}
const getRouteNameFromPath = (path: string, pages: CustomRoutePages) => {
	// Remove leading slash and split to get locale and route parts
	const cleanPath = path.replace(/^\//, '')
	const pathParts = cleanPath.split('/')

	// Handle both /de/impressum and impressum formats
	const routePath = pathParts.length > 1 ? `/${pathParts[1]}` : `/${pathParts[0]}`

	// Find matching route name by checking all locales for each page
	const [match] = Object.entries(pages).find(([_, translations]) =>
		Object.values(translations).some(localePath => localePath === routePath)
	) || []
	return match || ''
}
export default () => {
	const i18n = useI18n()
	const route = useRoute()
	const contentState = useContentState()

	const name = computed(() => {
		return getRouteNameFromPath(route.path, i18nConfig.pages || {})
	})

	const currentContent = computed<Content>(() => name.value && contentState.pages.value[name.value] || {} as Content)

	const query = async () => {
		try {
			let content
			try {
				content = await queryContent(`/${i18n.locale.value}/${name.value}`).findOne()
			} catch (error) {
				content = await queryContent(`/${i18nConfig.defaultLocale}/${name.value}`).findOne()
			}
			if (!name.value || !content) return {}
			contentState.pages.value[name.value] = content
			return content
		} catch (error) {
			console.error("error", error)
			return {}
		}
	}

	const queryContentData = async () => {
		return (await useAsyncData(route.fullPath, query)).data.value || {}
	}
	return {
		contentState,
		currentContent,
		query,
		queryContentData,
		routeName: name,
	}
}