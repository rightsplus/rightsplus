<template>
	<div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	setup () {
		

		return {}
	}
})
</script>

<style lang="scss" scoped>
div {
	height: var(--height, 5rem);
	width: var(--border-default);
	color: inherit;
	background-color: currentColor;
	position: relative;
	&:after {
		content: "";
		position: absolute;
		bottom: 0em;
		transform: rotate(45deg) translate(calc(-30% + 0.75px), -30%);
		transform-origin: 0 0;
		border-bottom: var(--border, var(--border-default, 1px)) solid currentColor;
		border-right: var(--border, var(--border-default, 1px)) solid currentColor;
		width: var(--size, 1rem);
		height: var(--size, 1rem);
	}
}
</style>