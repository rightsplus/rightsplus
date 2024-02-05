<template>
  <div
    class="flex flex-wrap gap-y-2 gap-x-4 leading-none text-sm text-neutral-500"
  >
    <div
      class="flex items-center gap-2"
      v-for="item in items"
      :key="item"
    >
      <FontAwesomeIcon icon="circle-check" class="text-green-500" />
      <span>{{ $t(item) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
	items: string[];
}>();
</script>