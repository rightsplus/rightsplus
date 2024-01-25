<template>
  <div
    class="w-full flex justify-between items-center text-sm md:text-base leading-tight font-medium"
  >
    <h3 class="text-gray-500">{{ label }}</h3>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
