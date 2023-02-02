<template>
	<div>
		<Button to="/" class="text-sm flex items-center gap-3 text-neutral-600 hover:text-black"><span class="bg-white/50 rounded-full w-6 h-6 inline-flex items-center justify-center left-0 text-sm" ><FontAwesomeIcon icon="arrow-down" fixed-width /></span>Nach unten scrollen</Button>
	</div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { defineComponent } from 'vue'

export default defineComponent({
	setup () {
		

		return {}
	}
})
</script>

<style scoped>

</style>