<template>
  <span
    class="flex items-center shrink-0"
    :class="{
      'font-medium rounded-md text-xs px-1.5 py-0.5 ring-1 ring-inset ring-opacity-25':
        !!content,
      'aspect-square w-3 rounded-full': !content,
      'bg-primary-50 text-primary-500  ring-primary-500': primary && content,
      'ring-gray-300 text-gray-700 bg-gray-50': !primary && content,
      'bg-primary-500': primary && !content,
      'bg-gray-700': !primary && !content,
    }"
    >{{ content }}</span
  >
</template>

<script setup lang="ts">
defineProps<{
  content?: string | number;
  primary?: boolean;
}>();
</script>

<style scoped></style>
