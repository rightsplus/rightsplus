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
          useAirports()[flight.departure.iata]?.city
        }}</span>
        to
        <span class="font-bold">{{
          useAirports()[flight.arrival.iata]?.city
        }}</span></span
      >
      <span class="text-lg font-bold flex items-center gap-3"
        >{{ time(flight.departure.scheduled)
        }}<FontAwesomeIcon icon="plane" class="text-sm text-gray-400" />{{
          time(flight.arrival.scheduled)
        }}<span v-if="overNight(flight)" class="-ml-2 text-gray-500 text-xs">+{{ overNight(flight) }}</span></span
      >
      <span class="flex items-center gap-2 text-base leading-none">
        <span
          class="w-6 h-6 flex justify-center items-center bg-white rounded-full ml-auto shrink-0 @md:hidden"
        >
          <img :alt="flight.airline.name" :src="logo" class="w-5" /></span
        ><span>{{ flight.airline.name }}<span v-if="ucfirst(flight.flight.codeshared?.airline_name)" class="opacity-50"
        > operated by {{ ucfirst(flight.flight.codeshared.airline_name) }}</span
      ></span
      ></span>
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
    props.selected?.flight?.iata === props.flight.flight.iata
  );
});
const iata = computed(() => {
  return props.flight.flight.iata?.replace(/^(.{2})(.*)$/, "$1 $2")
});
const logo = computed(() => {
  const iata = props.flight.flight.codeshared?.airline_iata?.toUpperCase() || props.flight.airline.iata
  return getAirlineLogo(iata);
});
const date = (date: string) => {
  return new Date(date).toLocaleDateString(useI18n().locale.value);
};
const overNight = (flight: Flight) => {
  return new Date(flight.arrival.scheduled).getDate() - new Date(flight.departure.scheduled).getDate()
}
const time = (time: string) => {
  return new Date(time).toLocaleTimeString(useI18n().locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
const ucfirst = (value: string) => {
  // return value
  return value?.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
}
const id = (flight: Flight) => {
    const operatedBy =
      flight.flight.codeshared?.airline_iata?.toUpperCase() ||
      flight.airline.iata.toUpperCase();
    return `${operatedBy}-${getISOTime(
      flight.departure.scheduled
    )}-${getISOTime(flight.arrival.scheduled)}`;
}
</script>
