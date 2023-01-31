<template>
	<section class="p-12 flex justify-center">
		<!-- {{data.label}} -->
		<Button :to="data.link" :title="data.label">{{data.label}}</Button>
	</section>
</template>

<script lang="ts">
import Button from '~/components/molecules/Button.vue'
export default defineComponent({
	components: {
		Button
	},
	props: {
		data: {
			type: Object,
		}
	},
})
</script>
<style lang="scss">

</style>