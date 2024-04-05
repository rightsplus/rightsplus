<template>
  <div class="flex flex-col gap-5" v-if="loading">Flüge werden geladen ...</div>
  <div class="flex flex-col gap-5" v-else-if="!flights.length">
    Keine Flüge gefunden.
  </div>
  <div class="flex flex-col gap-5" v-else>
    <div class="flex gap-2 flex-wrap" v-if="flights.length > 12">
      <span
        class="bg-neutral-100 cursor-pointer hover:bg-neutral-200 rounded p-2 text-sm leading-none flex items-center gap-2"
        :class="{
          'bg-primary-500 text-white hover:!bg-primary-600':
            iata === selectedAirline,
        }"
        v-for="{ name, iata } in Object.values(
          flights.reduce(
            (acc, curr) => ({ ...acc, [curr.airline.iata]: curr.airline }),
            {} as Record<string, Flight['airline']>
          )
        )"
        @click="
          () => {
            if (selectedAirline === iata) {
              selectedAirline = undefined;
            } else {
              selectedAirline = iata;
            }
          }
        "
        ><span
          class="w-5 h-5 flex justify-center items-center bg-white rounded-full ml-auto shrink-0 @md:hidden"
        >
          <img :src="getAirlineLogo(iata)" class="w-4" /></span
        >{{ name }}</span
      >
    </div>
    <FlightFrequency
      :flights="flights"
      :time="time"
      @select="selectTime"
      v-if="filteredDayTimeButtons?.length > 7"
    />

    <div
      v-if="flights.length > 7 && filteredDayTimeButtons?.length > 1"
      class="relative flex gap-5 mb-5 overflow-x-auto -mx-5 px-5"
    >
      <ButtonLarge
        v-for="timeOfDay in filteredDayTimeButtons"
        :key="timeOfDay.value"
        :name="timeOfDay.value"
        :label="$t(timeOfDay.value)"
        :subLabel="timeOfDay.subLabel"
        @click="selectTimeOfDay(timeOfDay.value)"
        :selected="dayTime === timeOfDay.value"
        class="grow basis-0 shrink-0 min-w-[140px]"
      />
    </div>
    <ListGroupTransition
      name="list"
      class="relative flex flex-col gap-5"
      :style="`--total: ${filteredFlights.length};`"
    >
      <ButtonFlight
        v-for="(flight, index) in filteredFlights"
        :key="`${flight.flight?.iata}-${flight[flight.type].scheduledTime}`"
        :style="`top: ${(index + 1) * 100 - 100}px; --i: ${index + 1};`"
        :flight="flight"
        @click="handleSelect(flight)"
        class="w-full"
        :class="{
          'rounded-b-none -mb-5 [&_+_*]:rounded-t-none [&_+_*]:mt-0.5':
          filteredFlights[index + 1]?.departure.scheduledTime ===
              flight.departure.scheduledTime &&
            operatingAirline(filteredFlights[index + 1]) === operatingAirline(flight),
        }"
      />
      <!-- (flights[index + 1]?.codeshared?.airline.iata ===
              flight.airline.iata ||
              flights[index + 1]?.codeshared?.airline.iata ===
                flight.codeshared?.airline.iata) &&
            flights[index + 1]?.departure.scheduledTime ===
              flight.departure.scheduledTime, -->
    </ListGroupTransition>
  </div>
</template>
<script lang="ts" setup>
import type { Flight } from "@/types";
import ButtonFlight from "./ButtonFlight.vue";
import ListGroupTransition from "@/components/cells/ListGroupTransition.vue";
import FlightFrequency from "~/components/molecules/FlightFrequency.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
const props = defineProps<{
  // flights: Flight[];
  departure?: string;
  arrival?: string;
  date?: string;
  number?: string;
  modelValue: Flight | null;
}>();

const flights = computed(() =>
  getFilteredFlights({
    departure: props.departure,
    arrival: props.arrival,
    date: props.date,
    number: props.number
  })
    .filter((e) => e.flight.iata)
);
const filteredFlights = computed(() =>
  flights.value
    .filter((e) => dayTimeFilter(e))
    .filter((e) => timeFilter(e))
    .filter((e) => airlineFilter(e))
    .sort(sortByScheduled)
);
const loading = ref(true);
const operatingAirline = (flight: Flight) =>
  flight?.codeshared?.airline.iata || flight?.airline.iata;
const { fetch } = useFetchFlight();
onMounted(() => {
  console.log("flight list mounted");
  loading.value = true;
  fetch({
    departure: props.departure,
    arrival: props.arrival,
    date: props.date,
  }).finally(() => (loading.value = false));
});

const emit = defineEmits(["update:modelValue", "select"]);
const handleSelect = (flight: Flight) => {
  emit("update:modelValue", flight);
  emit("select");
};
const dayTime = ref(null as null | string);
const time = ref<number>();
const selectTime = (value: number) => {
  if (time.value === value) {
    time.value = undefined;
    return;
  }
  time.value = value;
};
const selectTimeOfDay = (value: string) => {
  if (dayTime.value === value) {
    dayTime.value = null;
    return;
  }
  dayTime.value = value;
};

const timesOfDay = [
  {
    value: "morning",
    subLabel: "00:00 - 13:00",
  },
  {
    value: "afternoon",
    subLabel: "13:00 - 18:00",
  },
  {
    value: "evening",
    subLabel: "18:00 - 24:00",
  },
];
const dayTimeFilter = (flight: Flight, time = dayTime.value) => {
  if (!time) return true;
  const { scheduledTime } = flight.departure;
  const departureTime = parseInt(get24HTime(scheduledTime));
  if (time === "morning") {
    return departureTime < 1300;
  }
  if (time === "afternoon") {
    return departureTime >= 1300 && departureTime <= 1800;
  }
  if (time === "evening") {
    return departureTime > 1800;
  }
};
const timeFilter = (flight: Flight, t = time.value) => {
  if (!t) return true;
  return (
    t === parseInt(get24HTime(flight.departure.scheduledTime).slice(0, -2))
  );
};
const selectedAirline = ref();
const airlineFilter = (flight: Flight) => {
  return (
    !selectedAirline.value || flight.airline.iata === selectedAirline.value
  );
};
const filteredDayTimeButtons = computed(() =>
  timesOfDay.filter((button: { value: string; subLabel: string }) => {
    return flights.value?.some((flight) => dayTimeFilter(flight, button.value));
  })
);

watch(filteredDayTimeButtons, () => {
  if (!dayTime.value) return;
  if (
    !filteredDayTimeButtons.value.some(({ value }) => value === dayTime.value)
  ) {
    dayTime.value = null;
  }
});
// watch(
//   () => props.flights && dayTime.value,
//   () => {
//     if (
//       !props.flights
//         .filter((e) => dayTimeFilter(e, dayTime.value))
//         .some(
//           (flight) =>
//             flight.flight.iata?.toUpperCase() ===
//               props.modelValue?.flight?.iata || !props.modelValue?.status
//         )
//     ) {
//       emit("update:modelValue", null);
//     }
//   },
//   { immediate: true, deep: true }
// );
</script>
