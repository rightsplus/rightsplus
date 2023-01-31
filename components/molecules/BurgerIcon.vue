<template>
	<button class="p-5" :class="{active}" :aria-label="$t('open.mainmenu')" />
</template>

<script lang="ts">

export default defineComponent({
	props: {
		active: {
			type: Boolean,
			default: false,
		},
	}
})
</script>

<style lang="scss" scoped>
button {
	height: var(--size, 2rem);
	width: var(--size, 2rem);
	position: absolute;
	background-color: transparent;
	&:before, &:after {
		position: absolute;
		--size: 2rem;
		--border-default: 2px;
		content: "";
		background-color: currentColor;
		width: var(--size, 2rem);
		height: var(--border-default);
		transform: rotate(var(--rotate, 0deg)) translate(-50%, var(--translate, 0));
		transform-origin: 0%;
		transition: transform 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
	}
	--factor: 1;
	&:hover {
		--factor: 1.25;
	}
	&:before {
		--translate: calc(var(--size) / -5 * var(--factor));
	}
	&:after {
		--translate: calc(var(--size) / 5 * var(--factor));
	}
	&.active {
		&:before {
			--translate: 0;
			--rotate: calc(-45deg);
		}
		&:after {
			--translate: 0;
			--rotate: calc(45deg);
		}
	}
}
</style>