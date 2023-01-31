<template>
<section class="bg-stone-100 p-5 md:p-12 flex justify-center">
	<div class="max-w-2xl w-full mx-auto markdown my-5 md:my-12 bg-white rounded-2xl p-5 md:p-12 leading-snug" v-html="content" />
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
			return useMarkdown(this.data.card)
		}
	},
})
</script>
<style lang="scss">
</style>