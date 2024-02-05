export const usePosition = () => {
	const element = ref(null as HTMLElement | null);
	const position = ref({ top: 0, left: 0, width: 0 });
	const elementObserver = new MutationObserver(() => {
		if (!element.value) return;
		const { bottom, left, width } = element.value.getBoundingClientRect();
		position.value = { top: bottom + window.scrollY, left: left + window.scrollX, width };
	});
	onMounted(() => {
		elementObserver.observe(element.value!, { attributes: true });
	});
	return [element, position];
}