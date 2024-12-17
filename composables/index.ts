import { useLocalStorage } from "@vueuse/core";
import IBAN from "iban";
import type { MaskInputOptions } from "maska";

// export const useI18n = () => {
// 	const locale = ref('de')
// 	const t = (e, ...props) => e
// 	const n = (e, ...props) => String(e)
// 	const locales = ref([{ iso: 'de-DE', name: 'Deutsch', code: 'de' }])
// 	const localeProperties = ref({
// 		code: 'de',
// 		iso: 'de-DE',
// 		name: 'Deutsch',
// 	})
// 	return { t, n, locale, locales, localeProperties }
// }
// export const useLocalePath = () => {
// 	return (string) => string
// }
// export const useSwitchLocalePath = () => {
// 	return (string) => string
// }
// import { defineComponent, computed, h } from 'vue'

// defineComponent<{ locale?: string }>({
// 	name: 'NuxtLinkLocale',
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- FIXME
// 	props: {
// 		locale: {
// 			type: String as PropType<string>,
// 			default: undefined,
// 			required: false
// 		}
// 	},
// 	setup(props, { slots }) {
// 		return () => 'translated link'
// 	}
// })

export const useScroll = () => {
	const scroll = ref(0);
	onMounted(() => {
		const onScroll = () => scroll.value = window.scrollY;
		window.addEventListener('scroll', onScroll);
		onUnmounted(() => window.removeEventListener('scroll', onScroll));
	});
	return scroll;
}
export const usePosition = () => {
	const element = ref<HTMLElement>();
	const position = ref({ top: '0px', left: '0px', width: "0px" });

	const setPosition = () => {
		if (!element.value) return;
		const { bottom, left, width } = element.value.getBoundingClientRect();
		position.value = {
			top: `${bottom + window.scrollY}px`,
			left: `${left + window.scrollX}px`,
			width: `${width}px`
		};
	}
	onMounted(() => {
		const elementObserver = new MutationObserver(setPosition);
		elementObserver?.observe(element.value!, { attributes: true, subtree: true });
		window.addEventListener('resize', setPosition)
		onUnmounted(() => {
			elementObserver?.disconnect()
			window.removeEventListener('resize', setPosition)
		});
	});

	return [element, position] as const;
}
export const useMask = () => {
	const iban: MaskInputOptions = reactive({
		tokens: {
			"@": { pattern: /[A-Z]/, transform: (chr: string) => chr.toUpperCase() },
		},
		mask: (value) => getIbanMask(value).mask,
	});
	const allCaps: MaskInputOptions = {
		tokens: {
			"@": {
				pattern: /[a-zA-Z0-9]/,
				transform: (chr: string) => chr.toUpperCase(),
				repeated: true,
			},
		},
		mask: () => "@",
	};
	return { allCaps, iban }
}

export const formatDateRelative = (date: string | Date = new Date()) => {
	const { locale } = useI18n();
	const now = new Date();
	const d = new Date(date)
	const isToday = getISODate(now) === getISODate(d)
	const isYesterday = getISODate(now) === getISODate(new Date(d.setDate(d.getDate() + 1)))
	const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

	// Localize date and time format based on user's locale
	const options: Intl.DateTimeFormatOptions = {
		timeStyle: 'short',
	};

	if (isToday) {
		return d.toLocaleTimeString(locale.value, options);
	} else if (isYesterday) {
		const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: "auto" });
		return rtf.formatToParts(-1, "day").map(({ value }) => value).join("");
	} else if (diffInDays <= 6) {
		const weekday = d.toLocaleDateString(locale.value, { weekday: 'long' });
		return weekday.charAt(0).toUpperCase() + weekday.slice(1);
	} else {
		return d.toLocaleDateString(locale.value, { day: '2-digit', month: '2-digit', year: '2-digit' });
	}
}

const getContext = () => {
	const canvas = document.createElement('canvas')
	return canvas.getContext('2d')!
}

export const useFitCharacterNumber = (options?: { maxWidth?: number, middleChars?: string }) => {
	const reference = ref<HTMLElement>()
	const { maxWidth, middleChars = '...' } = options || {}

	const charNumber = computed(() => {
		if (reference.value && reference.value.innerText && maxWidth) {
			const context = getContext()
			const computedStyles = window.getComputedStyle(reference.value)
			context.font = computedStyles.font
				? computedStyles.font
				: `${computedStyles.fontSize}" "${computedStyles.fontFamily}`
			const textWidth = context.measureText(reference.value.innerText).width
			let fitLength = reference.value.innerText.length
			let prefix = ''
			let suffix = ''
			let i = 0
			let j = fitLength - 1
			let current = middleChars || ''
			let prev = current
			while (i < j) {
				prefix = prefix + reference.value.innerText.charAt(i)
				current = prefix + middleChars + suffix
				if (context.measureText(current).width > maxWidth) {
					fitLength = prev.length
					break
				}
				prev = current
				suffix = reference.value.innerText.charAt(j) + suffix
				current = prefix + middleChars + suffix
				if (context.measureText(current).width > maxWidth) {
					fitLength = prev.length
					break
				}
				prev = current
				i++
				j--
			}
			return fitLength
		}
		return NaN
	})

	return [reference, charNumber]
}