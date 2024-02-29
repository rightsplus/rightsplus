export const usePosition = () => {
	const element = ref<HTMLElement>();
	const position = ref({ top: '0px', left: '0px', width: "0px" });

	const elementObserver = new MutationObserver(() => {
		if (!element.value) return;
		const { bottom, left, width } = element.value.getBoundingClientRect();
		position.value = {
			top: `${bottom + window.scrollY}px`,
			left: `${left + window.scrollX}px`,
			width: `${width}px`
		};
	});

	onMounted(() => {
		elementObserver.observe(element.value!, { attributes: true, subtree: true });
	});
	onUnmounted(() => elementObserver.disconnect());
	return [element, position] as const;
}