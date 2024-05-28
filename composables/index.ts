import { useLocalStorage } from "@vueuse/core";
import type { MaskInputOptions } from "maska";

export const useScroll = () => {
	const scroll = ref(0);
	const onScroll = () => {
		scroll.value = window.scrollY;
	}
	onMounted(() => {
		window.addEventListener('scroll', onScroll);
	});
	onUnmounted(() => {
		window.removeEventListener('scroll', onScroll);
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
	const elementObserver = new MutationObserver(setPosition);

	onMounted(() => {
		elementObserver.observe(element.value!, { attributes: true, subtree: true });
		window.addEventListener('resize', setPosition)
	});
	onUnmounted(() => {
		elementObserver.disconnect()
		window.removeEventListener('resize', setPosition)
	});
	return [element, position] as const;
}
export const useMask = () => {
	const allCaps: MaskInputOptions = reactive({
		tokens: {
			"@": {
				pattern: /[a-zA-Z0-9]/,
				transform: (chr: string) => chr.toUpperCase(),
				repeated: true,
			},
		},
		mask: () => "@",
	});
	return { allCaps }
}

export function formatDate(date?: string | Date) {
	const { locale } = useI18n();
	const today = new Date();
	const d = new Date(date || today);
	const diffInDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

	// Localize date and time format based on user's locale
	const options: Intl.DateTimeFormatOptions = {
		timeStyle: 'short',
	};

	if (diffInDays < 1) {
		return d.toLocaleTimeString(locale.value, options);
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