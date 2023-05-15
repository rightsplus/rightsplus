<template>
  <button
    class="flex gap-5 items-center rounded-lg py-3 px-5"
    :class="{
      'bg-gray-700 text-white': isSelected,
      'bg-neutral-100 hover:bg-neutral-200 text-gray-800': !isSelected,
    }"
    @click="emit('click', flight)"
  >
    <div
      class="w-14 h-14 flex justify-center items-center bg-white rounded-full -ml-2"
    >
      <img :alt="flight.airline.name" :src="logo" class="w-10" />
    </div>
    <div class="flex flex-col items-start">
      <span class="text-lg font-bold flex items-center gap-3"
        >{{ time(flight.departure.scheduled)
        }}<FontAwesomeIcon icon="plane" class="text-sm text-gray-400" />{{ time(flight.arrival.scheduled) }}</span
      >
      <span class="text-base">{{ flight.airline.name }}</span>
    </div>
    <span class="ml-auto text-gray-400 text-base font-medium">{{ iata }}</span>
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
  return props.selected?.flight?.iata === props.flight.flight.iata;
});
const iata = computed(() => {
  return props.flight.flight.iata.match(/[a-zA-Z]+|[0-9]+/g)?.join(" ");
});
const logo = computed(() => {
  return getAirlineLogo(props.flight.airline.iata);
});
const time = (time: string) => {
  return new Date(time).toLocaleTimeString(useI18n().locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
