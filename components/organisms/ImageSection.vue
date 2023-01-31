<template>
	<section role="figure" :aria-labelledby="captionId">
		<div class="h-min md:min-h-[360px] max-h-[90vh] overflow-hidden">
			<ScrollParallax :speed="0.1">
				<Image
					:media="content"
					class="h-full -z-10 -translate-y-1/3 md:-translate-y-1/4 scale-105"
					width="full"
				/>
			</ScrollParallax>
		</div>
		<p :id="captionId" class="max-w-5xl mx-auto my-3 px-5 md:px-12 text-stone-400 leading-snug">{{content.caption}}</p>
	</section>
</template>

<script lang="ts">
import Image from '~/components/molecules/Image.vue'
import ScrollParallax from "vue3-parallax/src/components/ScrollParallax.vue";
import { uuid } from 'vue-uuid'
export default defineComponent({
	components: {
		Image,
		ScrollParallax
	},
	props: {
		data: {
			type: Object,
		}
	},
	data: () => ({captionId: uuid.v4()}),
	computed: {
		content() {
			return this.data.image?.data.attributes
		}
	},
})
</script>
<style lang="scss">

</style>