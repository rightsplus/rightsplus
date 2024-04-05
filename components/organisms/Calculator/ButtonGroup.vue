<template>
  <div
    ref="stickyElement"
    class="grid gap-3 sticky bottom-0 rounded-b-3xl bg-white ease-out mt-12 -m-5 p-5"
    :class="{
      'grid-cols-2': secondary && primary && !stack,
      'shadow-2xl !rounded-b-none md:!rounded-3xl -mx-5 sm:-mx-20 md:-mx-20 lg:-mx-20 md:bottom-4 z-[99]':
        isStickyRelative,
      'duration-150': ready,
    }"
  >
    <Button
      v-if="secondary"
      class="px-2"
      secondary
      @click="$emit('secondary')"
      v-bind="secondary"
      >{{ secondary.label }}</Button
    >
    <Button class="px-2" primary @click="$emit('primary')" v-bind="primary">{{
      primary.label
    }}</Button>
  </div>
</template>
<script setup lang="ts">
import Button, { type ButtonProps } from "@/components/core/Button.vue";
defineProps<{
  secondary?: ButtonProps;
  primary: ButtonProps;
  stack?: boolean;
}>();
defineEmits(["primary", "secondary"]);

import { useElementSize } from "@vueuse/core";

const isStickyRelative = ref(true);
const ready = ref(false);
const stickyElement = ref(null as HTMLElement | null);

const handleScroll = () => {
  const rect = stickyElement.value?.getBoundingClientRect();
  // window.innerHeight - keyboard height
  if (!window.visualViewport) {
    return;
  }

  const threshold =
    window.innerWidth < 768
      ? window.innerHeight
      : window.innerHeight - 24;
  isStickyRelative.value = (rect?.bottom || 0) >= threshold;
};
const { height } = useElementSize(document?.body);
watch(height, handleScroll);



onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
  setTimeout(handleScroll);
  setTimeout(() => (ready.value = true));
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
});
</script>
