<template>
  <span
    class="aspect-square flex justify-center items-center bg-white rounded-full shrink-0 overflow-hidden self-center"
    :class="{
      'w-5': size === 'xs',
      'w-6': size === 'sm',
      'w-8': size === 'md',
      'w-12': size === 'lg',
    }"
  >
    <img
      v-if="airline?.name && !logoError"
      @error="logoError = true"
      @load="logoError = false"
      :alt="airline.name"
      :src="logo"
      :class="{
        'w-4': size === 'xs',
        'w-5': size === 'sm',
        'w-7': size === 'md',
        'w-10': size === 'lg',
      }"
    />
    <span
      v-else-if="airline?.iata"
      class="font-bold text-neutral-400"
      :class="{
        'text-xs': size === 'xs',
        'text-xs': size === 'sm',
        'text-sm': size === 'md',
        'text-base': size === 'lg',
      }"
      >{{ airline.iata }}</span
    >
    <FontAwesomeIcon
      v-else
      icon="plane-tail"
      class="text-neutral-300"
      :class="{
        'text-xs': size === 'xs',
        'text-xs': size === 'sm',
        'text-sm': size === 'md',
        'text-base': size === 'lg',
      }"
    />
  </span>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { Airline } from "~/types";
interface Props {
  airline: Pick<Airline, "iata" | "name">;
  size?: "lg" | "md" | "sm" | "xs";
}
const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const logoError = ref(false);
const logo = computed(() => {
  return getAirlineLogo(props.airline?.iata, 80);
});
</script>

<style scoped></style>
