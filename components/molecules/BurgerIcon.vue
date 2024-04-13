<template>
	<button class="p-5" :class="{active}" :aria-label="$t('open.mainmenu')" :tabindex="-1"/>
</template>

<script lang="ts" setup>
defineProps<{ active: boolean }>()
</script>

<style lang="scss" scoped>
button {
	height: var(--size);
	width: var(--size);
	position: absolute;
	background-color: transparent;
	&:before, &:after {
		--size: 2rem;
		--border: 3px;
		position: absolute;
		content: "";
		background-color: currentColor;
		width: var(--size);
		height: var(--border);
		transform: rotate(var(--rotate, 0deg)) translate(-50%, var(--translate, 0));
		transform-origin: 0%;
		transition: 0.5s cubic-bezier(0.1, 1, 0.2, 1);
		transition-property: transform width;
		border-radius: 10px;
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
			--size: calc(2rem * var(--factor));
			--rotate: calc(-45deg);
		}
		&:after {
			--translate: 0;
			--size: calc(2rem * var(--factor));
			--rotate: calc(45deg);
		}
	}
}
</style>