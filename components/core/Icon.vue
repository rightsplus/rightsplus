<template>
	<i v-html="icon" />
</template>

<script lang="ts" setup>
defineProps<{
	icon: string
}>()
</script>

<style scoped>
i {
	fill: currentColor
}
</style>