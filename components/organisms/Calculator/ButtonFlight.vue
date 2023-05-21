<template>
  <button
    class="flex gap-5 items-center rounded-lg py-3 px-5 @container"
    :class="{
      'bg-gray-700 text-white': isSelected,
      'bg-neutral-100 hover:bg-neutral-200 text-gray-800': !isSelected,
    }"
    @click="emit('click', flight)"
  >
    <div
      class="w-14 h-14 hidden justify-center items-center bg-white rounded-full -ml-2 shrink-0 @md:flex"
    >
      <img :alt="flight.airline.name" :src="logo" class="w-10" />
    </div>
    <div class="flex flex-col items-start text-start">
      <span class="text-sm leading-none"
        ><span class="font-bold">{{
          useAirports().value[flight.departure.iata_code].city
        }}</span>
        to
        <span class="font-bold">{{
          useAirports().value[flight.arrival.iata_code].city
        }}</span></span
      >
      <span class="text-lg font-bold flex items-center gap-3"
        >{{ time(flight.departure.scheduled_time)
        }}<FontAwesomeIcon icon="plane" class="text-sm text-gray-400" />{{
          time(flight.arrival.scheduled_time)
        }}</span
      >
      <span class="flex items-center gap-2 text-base">
        <span
          class="w-6 h-6 flex justify-center items-center bg-white rounded-full ml-auto shrink-0 @md:hidden"
        >
          <img :alt="flight.airline.name" :src="logo" class="w-5" /> </span
        >{{ flight.airline.name }}</span
      >
    </div>

    <div class="flex flex-col items-center ml-auto">
      <span
        class="ml-auto text-gray-400 text-base font-medium leading-none whitespace-nowrap"
        >{{ iata }}</span
      >
    </div>
  </button>
</template>

<script setup lang="ts">
import { Flight } from "@/types";

const props = defineProps<{
  selected: Flight | null;
  flight: Flight;
}>();

const emit = defineEmits(["click"]);
const isSelected = computed(() => {
  return (
    props.selected?.flight?.iata_number === props.flight.flight.iata_number
  );
});
const iata = computed(() => {
  return props.flight.flight.iata_number?.match(/[a-zA-Z]+|[0-9]+/g)?.join(" ");
});
const logo = computed(() => {
  return getAirlineLogo(props.flight.airline.iata_code);
});
const time = (time: string) => {
  return new Date(time).toLocaleTimeString(useI18n().locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
