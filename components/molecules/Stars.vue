<template>
	<div class="flex gap-1 text-gold-400"><FontAwesomeIcon v-for="star in n" :icon="['fas', 'star']" /></div>
</template>

<script lang="ts">
export default defineComponent({
	props: {
		n: {
			type: Number,
			default: 5,
		},
	}
})
</script>