<template>
  <div class="grid grid-cols-2 gap-5 w-full">
    <div class="bg-neutral-100 rounded-lg p-3">
      <p class="text-lg font-bold">
        {{ time(flight.departure.scheduledTime) }}
      </p>
      <span class="text-sm text-neutral-500">{{ $t("departureAirport") }}</span>
      <MoleculesWeather
        v-if="weather.departure"
        :temperature="weather.departure.temperature_2m"
        :wind="weather.departure.windspeed_100m"
        :code="weather.departure.weathercode"
        :key="flight.flight.iata"
      />
    </div>
    <div class="bg-neutral-100 rounded-lg p-3">
      <p class="text-lg font-bold">
        {{ time(flight.arrival.scheduledTime) }}
      </p>
      <span class="text-sm text-neutral-500">{{ $t("arrivalAirport") }}</span>
      <MoleculesWeather
        v-if="weather.arrival"
        :temperature="weather.arrival.temperature_2m"
        :wind="weather.arrival.windspeed_100m"
        :code="weather.arrival.weathercode"
        :key="flight.flight.iata"
      />
    </div>
    <FlightResultAirport
      :flight="flight.departure"
      :weather="weather.departure"
      label="Abflug"
      :cancelled="flight.status === 'cancelled'"
    />
  </div>
</template>

<script setup lang="ts">
import type { Flight } from "~/types";
import FlightResultAirport from "./organisms/Calculator/FlightResultAirport.vue";

const props = defineProps<{
  flight: Flight;
}>();
const { locale } = useI18n();
const flight = computed(() => props.flight);
const { weather } = useWeather(flight);
watch(flight, () => {
  console.log(props.flight);
});

const date = (time: string) => {
  return new Date(time).toLocaleDateString(locale.value);
};
const time = (time: string) => {
  return new Date(time).toLocaleTimeString(locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped></style>
