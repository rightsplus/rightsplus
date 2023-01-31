<template>
	<div v-html="icon" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		icon: {
			type: String,
			required: true
		}
	}
})
</script>

<style scoped>
div {
	fill: currentColor
}
</style>