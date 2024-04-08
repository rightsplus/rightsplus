<template>
  <span
    class="aspect-square flex justify-center items-center bg-white rounded-full shrink-0 overflow-hidden"
    :class="{
      'w-5': size === 'xs',
      'w-6': size === 'sm',
      'w-8': size === 'md',
      'w-12': size === 'lg',
    }"
  >
    <img
      v-if="!logoError"
      @error="logoError = true"
      @load="logoError = false"
      :alt="flight.airline.name"
      :src="logo"
      :class="{
        'w-4': size === 'xs',
        'w-5': size === 'sm',
        'w-7': size === 'md',
        'w-10': size === 'lg',
      }"
    />
    <span
      v-else
      class="font-bold text-neutral-400"
      :class="{
        'text-xs': size === 'xs',
        'text-xs': size === 'sm',
        'text-sm': size === 'md',
        'text-base': size === 'lg',
      }"
      >{{ flight.airline.iata }}</span
    >
  </span>
</template>

<script setup lang="ts">
import type { Flight } from "~/types";
interface Props {
  flight: Flight;
  size: "lg" | "md" | "sm" | "xs";
}
const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const logoError = ref(false);
const logo = computed(() => {
  let { airline } = props.flight || {};
  return getAirlineLogo(airline?.iata, 80);
});
</script>

<style scoped></style>
