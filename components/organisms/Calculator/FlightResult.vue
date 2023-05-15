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
        :allAirports="useAirports()"
      />
      <span class="text-center text-primary-500"
        ><FontAwesomeIcon icon="plane"
      /></span>
      <FlightResultAirport
        label="Ankunft"
        :flight="flight.arrival"
        :allAirports="useAirports()"
        class="items-end text-right"
      />
    </div>
    <Weather :weather="weather[0]" />
    <ol>
      <li
        class="flex gap-3 items-center text-base font-medium"
        v-if="flight?.distance"
      >
        <span><FontAwesomeIcon icon="route" /></span>
        <span>{{ $n(flight.distance, "km") }}</span>
      </li>
      <li
        v-if="!euMember"
        class="flex gap-3 items-center text-base font-medium"
      >
        Weder Abflug- noch Ankuftsflughafen liegen in der EU.
      </li>
      <li v-if="euMember" class="flex gap-3 items-start">
        <FontAwesomeIcon icon="european-union" class="text-2xl" />
        <p class="text-xs leading-tight">
          Bei Ansprüchen, die unter das EU-Fluggastrecht (EG 261) fallen, müssen
          die Fluggesellschaften nur bei Verspätungen von mehr als 3 Stunden
          eine Entschädigung zahlen.
        </p>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import {
  getAirportDistance,
  getWeather,
  isUnsafeToTakeoffOrLand,
} from "@/utils";
import { Airport, Flight } from "@/types";
import { isEuMember } from "is-eu-member";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import FlightResultAirport from "@/components/organisms/Calculator/FlightResultAirport.vue";
import Weather from "@/components/molecules/Weather.vue";

defineProps<{
  flight: Flight;
}>();

const lat = 52.520008;
const lon = 13.404954;
const start = "2021-01-01";
const end = "2021-01-01";

const warning = ref([] as string[]);
const weather = ref([] as Record<string, number | string>[]);
watch(
  () => useAirports(),
  (value) => {
    if (!value) return;
    warning.value = [];
    weather.value = [];
    const times = useAppState().claims?.flight?.departure;
    const departure = new Date(
      times?.actual_runway || times?.estimated || times?.scheduled || 0
    );
    Object.values(value).forEach((airport: Airport) => {
      getWeather(airport, departure.toISOString().slice(0, 10)).then(
        (weatherResponse) => {
          if (!weatherResponse) return;
          const hour = departure.getHours();
          for (let i = hour; i < hour + 1; i++) {
            const isUnsafe = isUnsafeToTakeoffOrLand(weatherResponse, i + 1);
            if (isUnsafe) warning.value.push(isUnsafe);
            weather.value.push({
              time: new Date(weatherResponse.time[i]).toLocaleTimeString(
                useI18n().locale.value,
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
              temperature: weatherResponse.temperature_2m[i],
              gusts: weatherResponse.windgusts_10m[i],
              wind: weatherResponse.windspeed_100m[i],
              rain: weatherResponse.precipitation[i],
              snow: weatherResponse.snowfall[i],
              clouds: weatherResponse.cloudcover[i],
            });
          }
        }
      );
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

// distance() {
//   return getAirportDistance(
//     useAirports()?.[this.flight?.departure.iata],
//     useAirports()?.[this.flight?.arrival.iata]
//   );
// },
const euMember = computed(() => {
  const airport = useAppState().claims?.airport;
  return (
    isEuMember(airport?.departure?.country || "") ||
    isEuMember(airport?.arrival?.country || "")
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
