<template>
	<section class="bg-stone-50 p-6 sm:p-12" v-if="content">
		<blockquote class="max-w-2xl mx-auto my-12 font-display italic text-3xl sm:text-4xl md:text-5xl text-center text-gold-500" v-html="content"></blockquote>
	</section>
</template>

<script lang="ts">
export default defineComponent({
	props: {
		data: {
			type: Object,
		}
	},
	computed: {
		content() {
			if (!this.data.quote) return
			return useMarkdown(this.data.quote)
		}
	},
})
</script>
<style lang="scss">
blockquote {
	em, i {
		font-style: inherit;
		color: var(--color-success-500)
	}

}
</style>