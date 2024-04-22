<template>
	<input v-model="model" v-bind="$attrs" class="border-none hover:ring-[1px] focus-within:ring-[1px] hover:ring-neutral-200 focus-within:!ring-neutral-300 rounded-lg px-2 -mx-2 py-0.5 grow" />
</template>

<script setup lang="ts">
const model = defineModel()
</script>

<style scoped>

</style>