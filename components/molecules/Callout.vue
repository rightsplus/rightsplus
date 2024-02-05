<template>
  <div
    class="flex gap-3 p-3 border rounded-lg text-sm"
    :class="{
      'border-neutral-200 bg-neutral-100 text-neutral-600': !type,
      'border-red-200 bg-red-100 text-red-600': type === 'error',
      'border-blue-200 bg-blue-100 text-blue-600': type === 'info',
      'border-green-200 bg-green-100 text-green-600': type === 'success',
      'border-yellow-200 bg-yellow-100 text-yellow-700': type === 'warning'
    }"
  >
    <FontAwesomeIcon v-if="icon" :icon="icon" class="my-1" />
    <div class="flex flex-col gap-1">
      <span v-if="$slots.title" class="text-base font-bold"
        ><slot name="title"
      /></span>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type?: "error" | "warning" | "info" | "success";
  icon?: string;
}>();
</script>
