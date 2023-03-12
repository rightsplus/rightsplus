<template>
  <div class="flex items-center bg-neutral-100 rounded-3xl p-5 gap-2">
    <ClientOnly
      ><font-awesome-icon v-if="icon" :icon="icon" class="text-3xl text-primary-500"
    /></ClientOnly>
    <div class="flex flex-col gap-2 ml-2">
      <div class="text-base font-medium text-gray-500 leading-none">{{ title }}</div>
      <div class="text-2xl font-bold leading-none">{{ value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  value: string;
}>();
</script>

<style scoped></style>
