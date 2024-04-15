<template>
  <div class="flex flex-col gap-2" v-if="flight">
    <span class="uppercase tracking-wider">{{ label }}</span>
    <div class="flex flex-col">
      <span class="font-bold leading-none text-lg text-gray-700">{{
        flight.iata
      }}</span>
      <span class="text-base leading-none">{{
        city
      }}</span>
    </div>
    <div class="flex flex-col leading-none">
      <span class="font-bold text-gray-700"
        >{{ time(flight.actualTime) }} Ortszeit</span
      >
      <span
        v-if="cancelled"
        class='text-red-600'
        >annulliert</span
      >
      <span
        v-else
        :class="{
          'text-red-600': flight.delay > 0,
          'text-green-600': flight.delay <= 0,
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
import type { Airport, Flight, FlightPhase } from "@/types";
import Weather from "@/components/molecules/Weather.vue";
import type { WeatherResponse } from "~~/utils";

const props = defineProps<{
  label: string;
  flight?: FlightPhase;
  weather?: WeatherResponse<number, string>;
  cancelled?: boolean;
}>();
const city = ref()
const { locale } = useI18n();
onMounted(() => getCities([props.flight?.iata], locale.value).then(([c]) => city.value = c));
// getHumanReadableWeather(props.flight).then((data) => {
//   weather.value = data;
// });
const time = (date?: string | null) => {
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
  const delay = props.flight?.delay || 0;

  if (delay === 0) return "pünktlich";
  if (delay < 0) return `${getDuration(delay)} früher`;
  return `${getDuration(delay)} verspätet`;
});
</script>
