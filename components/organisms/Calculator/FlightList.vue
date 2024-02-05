<template>
  <FlightFrequency
    :flights="flights"
    :dayTime="dayTime"
    @select="selectTimeOfDay"
    v-if="filteredDayTimeButtons?.length > 1"
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
    class="relative flex flex-col gap-3"
    :style="`--total: ${allFlights.length};`"
  >
    <ButtonFlight
      v-for="(flight, index) in allFlights
        .filter(e => dayTimeFilter(e))
        .sort(sortByScheduled)"
      :key="`${flight.flight?.iata}-${flight.flight_date}`"
      :style="`top: ${(index + 1) * 100 - 100}px; --i: ${index + 1};`"
      :flight="flight"
      :selected="selected(flight)"
      @click="handleSelect"
      class="w-full"
    />
  </ListGroupTransition>
</template>
<script lang="ts" setup>
import type { Flight } from "@/types";
import ButtonFlight from "./ButtonFlight.vue";
import ListGroupTransition from "@/components/cells/ListGroupTransition.vue";
import FlightFrequency from "~/components/molecules/FlightFrequency.vue";
import ButtonLarge from "./ButtonLarge.vue";
import type { MaskInputOptions } from "maska";
const props = defineProps<{
  flights: Flight[];
  modelValue: Flight | null;
}>();

const options: MaskInputOptions = reactive({
  tokens: {
    "@": {
      pattern: /[a-zA-Z0-9]/,
      transform: (chr: string) => chr.toUpperCase(),
      repeated: true
    }
  },
  mask: () => "@"
});

const otherFlight = ref<Flight>({
  flight_date: "2023-12-20",
  flight_status: "otherFlight", // Update with the appropriate status for "other" flights
  departure: {
    airport: "ABC",
    iata: "ABC",
    scheduled: "3023-12-20T10:00:00Z"
  },
  arrival: {
    airport: "XYZ",
    timezone: "UTC",
    iata: "XYZ",
    scheduled: "2023-12-20T12:00:00Z"
  },
  airline: {
    name: "Airline XYZ",
    iata: "XYZ"
  },
  flight: {
    iata: "XYZ123",
    number: "123"
  }
});

const allFlights = [...props.flights, otherFlight.value];
const selected = (flight: Flight) => {
  return (
    (flight.flight?.iata === props.modelValue?.flight?.iata) ||
    (flight.flight_status === "otherFlight" &&
      props.modelValue?.flight_status === "otherFlight")
  );
};
const emit = defineEmits(["update:modelValue"]);
const handleSelect = (flight: Flight) => {
  if (flight.flight.iata?.toUpperCase() === props.modelValue?.flight?.iata) {
    emit("update:modelValue", null);
    return;
  }
  emit("update:modelValue", flight);
};
const dayTime = ref(null as null | string);
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
    subLabel: "00:00 - 12:00"
  },
  {
    value: "afternoon",
    subLabel: "12:00 - 20:00"
  },
  {
    value: "evening",
    subLabel: "20:00 - 24:00"
  }
];
const dayTimeFilter = (flight: Flight, time = dayTime.value) => {
  if (!time) return true;
  if (
    time === "morning" &&
    parseInt(get24HTime(flight.departure.scheduled)) < 1200
  ) {
    return true;
  }
  if (
    time === "afternoon" &&
    parseInt(get24HTime(flight.departure.scheduled)) >= 1200 &&
    parseInt(get24HTime(flight.departure.scheduled)) <= 2000
  ) {
    return true;
  }
  if (
    time === "evening" &&
    parseInt(get24HTime(flight.departure.scheduled)) > 2000
  ) {
    return true;
  }
};
const filteredDayTimeButtons = computed(() =>
  timesOfDay.filter((button: { value: string; subLabel: string }) => {
    return props.flights.some(flight => dayTimeFilter(flight, button.value));
  })
);

watch(
  () => filteredDayTimeButtons.value,
  () => {
    if (!dayTime.value) return;
    if (
      !filteredDayTimeButtons.value.some(({ value }) => value === dayTime.value)
    ) {
      dayTime.value = null;
    }
  }
);
watch(
  () => props.flights && dayTime.value,
  () => {
    if (
      !props.flights
        .filter(e => dayTimeFilter(e, dayTime.value))
        .some(
          flight =>
            flight.flight.iata?.toUpperCase() ===
              props.modelValue?.flight?.iata ||
            props.modelValue?.flight_status === "otherFlight"
        )
    ) {
      emit("update:modelValue", null);
    }
  },
  { immediate: true, deep: true }
);
</script>
