<template>
  <div
    class="flex flex-col gap-5 bg-neutral-100 rounded-xl p-4 px-5"
    v-bind="$attrs"
  >
    <div
      class="grid grid-cols-[1fr_auto_1fr] items-center w-full text-sm font-medium text-gray-500"
    >
      <FlightResultAirport
        label="Abflug"
        :flight="flight?.departure"
        :cancelled="flight?.flight_status === 'cancelled'"
      />
      <span class="text-center text-primary-500"
        ><FontAwesomeIcon icon="plane"
      /></span>
      <FlightResultAirport
        label="Ankunft"
        :flight="flight?.arrival"
        :cancelled="flight?.flight_status === 'cancelled'"
        class="items-end text-right"
      />
    </div>
    <ol>
      <!-- <li
        class="flex gap-3 items-center text-base font-medium"
        v-if="flight?.distance"
      >
        <span><FontAwesomeIcon icon="route" /></span>
        <span>{{ $n(flight.distance, "km") }}</span>
      </li>
      <li
        v-if="!isEuMember"
        class="flex gap-3 items-center text-base font-medium"
      >
        Weder Abflug- noch Ankuftsflughafen liegen in der EU.
      </li> -->
      <!-- <li v-if="isEuMember" class="flex gap-3 items-start">
        <FontAwesomeIcon icon="european-union" class="text-2xl" />
        <p class="text-xs leading-tight">
          Bei Ansprüchen, die unter das EU-Fluggastrecht (EG 261) fallen, müssen
          die Fluggesellschaften nur bei Verspätungen von mehr als 3 Stunden
          eine Entschädigung zahlen.
        </p>
      </li> -->
    </ol>
  </div>
</template>

<script setup lang="ts">
import {
  getAirportDistance,
  getWeather,
  isUnsafeToTakeoffOrLand,
} from "@/utils";
import type { Airport, Flight } from "@/types";
import { euMember } from "is-european";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import FlightResultAirport from "@/components/organisms/Calculator/FlightResultAirport.vue";
import Weather from "@/components/molecules/Weather.vue";

const props = defineProps<{
  flight?: Flight;
}>();

const lat = 52.520008;
const lon = 13.404954;
const start = "2021-01-01";
const end = "2021-01-01";

const warning = ref([] as string[]);

const isEuMember = computed(() => {
  const airport = useClaim().value?.airport;
  return (
    euMember(airport?.departure?.country || "") ||
    euMember(airport?.arrival?.country || "")
  );
});
const time = (date: string) => {
  return new Date(date).toLocaleTimeString(useI18n().locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
const date = (date: string) => {
  return new Date(date).toLocaleDateString(useI18n().locale.value);
};
const duration = (minutes: number) => {
  const min = `${minutes % 60} min`;
  const h = `${Math.floor(minutes / 60)} h`;
  return minutes >= 60 ? `${h} ${min}` : min;
};
const delay = (delay: number) => {
  if (delay === 0) return "pünktlich";
  if (delay < 0) return `${duration(delay)} früher`;
  return `${duration(delay)} verspätet`;
};
</script>
