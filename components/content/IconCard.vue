<template>
  <div class="flex items-center bg-neutral-100 rounded-3xl p-5 gap-2">
    <FontAwesomeIcon
      v-if="icon"
      :icon="icon"
      class="text-3xl text-primary-500 shrink-0"
    />
    <div class="flex flex-col gap-2 ml-2">
      <h4 class="text-base font-medium text-gray-500 leading-none my-0">
        {{ title }}
      </h4>
      <span class="text-2xl font-bold leading-none">{{ value }}</span>
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