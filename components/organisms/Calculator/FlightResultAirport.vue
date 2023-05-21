<template>
  <div class="flex flex-col gap-2" v-if="flight">
    <span class="uppercase tracking-wider">{{ label }}</span>
    <div class="flex flex-col">
      <span class="font-bold leading-none text-lg text-gray-700">{{
        flight.iata_code
      }}</span>
      <span class="text-base leading-none">{{
        useAirports().value[flight.iata_code]?.city
      }}</span>
    </div>
    <div class="flex flex-col leading-none">
      <span class="font-bold text-gray-700"
        >{{ time(flight.actual_time) }} Ortszeit</span
      >
      <span
        :class="{
          'text-red-600': getDelay(flight) > 0,
          'text-green-600': getDelay(flight) <= 0,
        }"
        >{{ delay }}</span
      >
    </div>
    <Weather
      :temperature="weather?.temperature_2m"
      :wind="weather?.windspeed_100m"
      :code="weather?.weathercode"
    />
  </div>
</template>

<script setup lang="ts">
import { Airport, Flight, FlightPhase } from "@/types";
import Weather from "@/components/molecules/Weather.vue";
import { WeatherResponse } from "~~/utils";
const weather = ref(null as null | Partial<WeatherResponse<number, string>>);

const props = defineProps<{
  label: string;
  flight?: FlightPhase;
}>();
getHumanReadableWeather(props.flight).then((data) => {
  weather.value = data;
});
const time = (date?: string) => {
  if (!date) return;
  return new Date(date).toLocaleTimeString(useI18n().locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
const date = (date: string) => {
  return new Date(date).toLocaleDateString(useI18n().locale.value);
};
const delay = computed(() => {
  const delay = getDelay(props.flight);

  if (delay === 0) return "pünktlich";
  if (delay < 0) return `${getDuration(delay)} früher`;
  return `${getDuration(delay)} verspätet`;
});
</script>
