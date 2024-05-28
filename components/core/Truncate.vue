<template>
  <div class="flex flex-col w-full">
    <span class="absolute">{{
      truncateMiddle(
        children,
        Math.max(10, parseInt(((width + (adjustment || -80)) / 8).toFixed()))
      )
    }}</span>
    <div class="pointer-events-none" :style="{ width: `${width}px` }" />
    <span
      class="opacity-0 -mx-10 pointer-events-none whitespace-nowrap"
      ref="truncate"
      >{{ children }}</span
    >
  </div>
</template>
<script setup lang="ts">
import truncateMiddle from "@stdlib/string-truncate-middle";
import { useElementSize } from "@vueuse/core";
defineProps<{
  adjustment?: number;
}>();
const truncate = ref<HTMLElement>();
const { width } = useElementSize(truncate);
const slots = useSlots();
const children = slots.default?.()[0].children?.toString() || "";
</script>
