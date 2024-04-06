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