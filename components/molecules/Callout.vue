<template>
  <div
    class="flex gap-3 p-3 border rounded-lg text-sm"
    :class="{
      'border-red-200 bg-red-100 text-red-600': type === 'error',
      'border-blue-200 bg-blue-100 text-blue-600': type === 'info',
      'border-green-200 bg-green-100 text-green-600': type === 'success',
    }"
  >
    <ClientOnly><FontAwesomeIcon :icon="icon" class="my-1"/></ClientOnly>
		<div class="flex flex-col gap-1">
      <span v-if="$slots.title" class="text-base font-bold"><slot name="title"/></span>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'error' | 'info' | 'success'
  icon: string
}>()
</script>
