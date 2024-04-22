<template>
  <div
    class="aspect-square flex justify-center items-center bg-white rounded-full shrink-0 overflow-hidden self-center border border-gray-100"
    :class="{
      'w-5': size === 'xs',
      'w-6': size === 'sm',
      'w-8': size === 'md',
      'w-12': size === 'lg',
    }"
  >
      <img
        v-if="ready && !error"
        :alt="airline.name"
        :src="logo"
        @error="onError"
        loading="lazy"
        class="absolute leading-none text-[0px]"
        :class="{
          'opacity-0': error,
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
          'text-xs': size === 'xs' || size === 'sm',
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
          'text-base': size === 'xs' || size === 'sm',
          'text-lg': size === 'md',
          'text-xl': size === 'lg',
        }"
      />
  </div>
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
const error = ref(false);
const ready = ref(false);
const onError = () => (error.value = true);

const logo = computed(() => {
  const size = {
    xs: 32,
    sm: 40,
    md: 56,
    lg: 80,
  }[props.size];
  return getAirlineLogo(props.airline?.iata, size);
});
watch(
  logo,
  () => {
    if (!logo.value) return;
    fetch(logo.value)
      .then(() =>
        setTimeout(() => {
          ready.value = true;
        })
      )
      .catch(onError);
  },
  { immediate: true }
);
watch(
  () => props.airline.iata,
  () => (error.value = false),
  { immediate: true }
);
</script>
