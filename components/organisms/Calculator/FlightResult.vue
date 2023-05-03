<template>
  <div class="flex flex-col gap-5 bg-neutral-100 rounded-xl p-4 px-5" v-bind="$attrs">
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
        v-if="!isEuMember"
        class="flex gap-3 items-center text-base font-medium"
      >
        Weder Abflug- noch Ankuftsflughafen liegen in der EU.
      </li>
      <li v-if="isEuMember" class="flex gap-3 items-start">
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

<script lang="ts">
import { defineComponent } from "vue";
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

export default defineComponent({
  components: {
    FlightResultAirport,
    Weather
  },
  props: {
    flight: {
      type: Object as () => Flight,
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
        const times = this.$state.claims?.selectedFlight?.departure;
        const departure = new Date(
          times?.actual_runway || times?.estimated || times?.scheduled || 0
        );
        Object.values(value).forEach((airport: Airport) => {
          getWeather(airport, departure.toISOString().slice(0, 10)).then(
            (weather) => {
              if (!weather) return
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
      return useAirports();
    },
    distance() {
      return getAirportDistance(
        useAirports()?.[this.flight?.departure.iata],
        useAirports()?.[this.flight?.arrival.iata]
      );
    },
    isEuMember() {
      const airport = this.$state.claims?.airport;
      return (
        isEuMember(airport?.departure?.country || "") ||
        isEuMember(airport?.arrival?.country || "")
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
      return new Date(date).toLocaleDateString(this.$i18n.locale);
    },
    duration(minutes: number) {
      const min = `${minutes % 60} min`;
      const h = `${Math.floor(minutes / 60)} h`;
      return minutes >= 60 ? `${h} ${min}` : min;
    },
    delay(delay: number) {
      if (delay === 0) return "pünktlich";
      if (delay < 0) return `${this.duration(delay)} früher`;
      return `${this.duration(delay)} verspätet`;
    },
  },
});
</script>
