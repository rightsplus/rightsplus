<template>
  <div
    class="flex flex-col gap-2 bg-neutral-100 rounded-xl w-full p-4 px-5"
    v-bind="$attrs"
  >
    <span class="leading-none text-xs" v-if="route.date">{{
      date(route.date)
    }}</span>
    <div
      class="grid grid-cols-[1fr_auto_1fr] items-center w-full text-sm font-medium text-gray-500"
    >
      <div class="flex flex-col">
        <span class="leading-none text-sm font-bold" v-if="route.flight">{{
          time(route.flight.departure.scheduled)
        }}</span>
        <span class="font-bold text-lg text-gray-700">{{
          route.departure.airport.iata
        }}</span>
        <span class="text-base leading-none" v-if="$state.airports">{{
          $state.airports[route.departure.airport.iata]?.city ||
          $state.airports[route.departure.airport.iata]?.name
        }}</span>
      </div>
      <span class="text-center text-primary-500"
        ><FontAwesomeIcon icon="plane"
      /></span>

      <div class="flex flex-col text-end">
        <span class="leading-none text-sm font-bold" v-if="route.flight">{{
          time(route.flight.departure.scheduled)
        }}</span>
        <span class="font-bold text-lg text-gray-700">{{
          route.arrival.airport.iata
        }}</span>
        <span class="text-base leading-none" v-if="$state.airports">{{
          $state.airports[route.arrival.airport.iata]?.city ||
          $state.airports[route.arrival.airport.iata]?.name
        }}</span>
      </div>
    </div>
    <hr class="w-full border-t-2 border-neutral-200 my-2" v-if="route.flight" />
    <div class="flex items-center gap-2" v-if="route.flight">
      <div
        class="w-5 h-5 flex justify-center items-center bg-white rounded-full"
      >
        <img
          :alt="route.flight.airline.name"
          :src="getAirlineLogo(route.flight.airline?.iata)"
          class="w-4"
        />
      </div>
      <span class="text-sm font-medium">{{ route.flight.airline.name }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  getAirportDistance,
  getWeather,
  isUnsafeToTakeoffOrLand,
} from "@/utils";
import type { Airport, Flight } from "@/types";
import { euMember } from "is-european";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import FlightResultAirport from "@/components/organisms/Calculator/FlightResultAirport.vue";

export default defineComponent({
  components: {
    FlightResultAirport,
  },
  props: {
    route: {
      type: Object as () => Route,
      required: true,
    },
  },
  mounted() {
    const lat = 52.520008;
    const lon = 13.404954;
    const start = "2021-01-01";
    const end = "2021-01-01";
  },
  data() {
    return {
      warning: [] as string[],
      weather: [] as Record<string, number | string>[],
    };
  },
  watch: {
    airports: {
      handler(value) {
        if (!value) return
        this.warning = [];
        this.weather = [];
        const times = useClaim().value?.selectedFlight?.departure;
        const departure = new Date(
          times?.actual_runway || times?.estimated || times?.scheduled || 0
        );
        Object.values(value).forEach((airport: Airport) => {
          getWeather(airport, departure.toISOString().slice(0, 10)).then(
            (weather) => {
              const hour = departure.getHours();
              for (let i = hour; i < hour + 1; i++) {
                const isUnsafe = isUnsafeToTakeoffOrLand(weather, i + 1);
                if (isUnsafe) this.warning.push(isUnsafe);
                this.weather.push({
                  time: new Date(weather.time[i]).toLocaleTimeString(
                    this.$i18n.locale,
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  ),
                  temperature: weather.temperature_2m[i],
                  gusts: weather.windgusts_10m[i],
                  wind: weather.windspeed_100m[i],
                  rain: weather.precipitation[i],
                  snow: weather.snowfall[i],
                  clouds: weather.cloudcover[i],
                });
              }
            }
          );
        });
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    airports() {
      return this.$state.airports;
    },
    distance() {
      return getAirportDistance(
        this.$state.airports[this.flight.departure.iata],
        this.$state.airports[this.flight.arrival.iata]
      );
    },
    isEuMember() {
      const airport = useClaim().value?.airport;
      return (
        euMember(airport?.departure?.country || "") ||
        euMember(airport?.arrival?.country || "")
      );
    },
  },
  methods: {
    time(date: string) {
      return new Date(date).toLocaleTimeString(this.$i18n.locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    date(date: string) {
      return new Date(date).toLocaleDateString(this.$i18n.locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    delay(delay: number) {
      if (delay === 0) return "pünktlich";
      if (delay < 0) return `${this.duration(delay)} früher`;
      return `${this.duration(delay)} verspätet`;
    },
  },
});
</script>
