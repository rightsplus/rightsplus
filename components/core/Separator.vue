<template>
	<div role="separator" class="separator" :class="slots.default && 'text'"><slot /></div>
</template>
<script setup lang="ts">
const slots = useSlots()
</script>
<style scoped lang="postcss">
.text {
	@apply text-sm text-neutral-500 w-full flex gap-3 items-center;
}
.separator::before, .text::after {
	content: '';
	@apply border-t border-neutral-500 flex items-center w-full opacity-20
}
</style>