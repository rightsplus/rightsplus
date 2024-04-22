<template>
  <button
    type="button"
    class="w-7 h-7 aspect-square rounded-full hover:bg-neutral-100"
    @click="$emit('click')"
    :class="{
      'text-neutral-300 pointer-events-none': disabled,
      'bg-primary-500 hover:bg-primary-500 text-white': currentPage && (currentPage === index),
    }"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  currentPage?: number;
  index?: number | string;
  disabled?: boolean;
}>();
</script>
