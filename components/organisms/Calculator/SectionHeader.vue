<template>
  <div
    class="w-full flex justify-between items-center text-base sm:text-lg md:text-xl leading-tight font-medium"
  >
    <h3 class="text-gray-500">{{ label }}</h3>
    <div v-if="showValue" class="flex items-center gap-2 text-right"><slot /></div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  label: string;
  showValue?: boolean;
}>();
</script>
