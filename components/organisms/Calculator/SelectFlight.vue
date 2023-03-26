<template>
  <div class="flex flex-col gap-5" v-if="$state">
    <h1 class="text-2xl sm:text-3xl font-bold">
      Um welchen Flug handelt es sich?
    </h1>
    <div
      v-if="$state.routes"
      v-for="([key, route], i) in Object.entries($state.routes)"
      :key="key"
      class="w-full flex flex-col gap-3"
    >
      <ButtonLarge
        :selected="modelValue.route === key"
        name="no"
        @click="modelValue.route = key"
      >
        <span class="flex items-center gap-3 font-bold"
          >{{ route.departure.airport.iata
          }}<FontAwesomeIcon icon="plane" class="text-gray-400 text-sm" />
          {{ route.arrival.airport.iata }}</span
        >
      </ButtonLarge>
    </div>

    <DatePicker v-model="modelValue.date" />

    <div
      v-if="modelValue.route && $state.routes[modelValue.route]"
      class="w-full flex flex-col gap-3"
    >
      <ButtonFlight
        v-for="flight in $state.flights.filter(
          (flight) =>
            flight.departure.iata ===
              $state.routes[modelValue.route].departure.airport.iata &&
            flight.arrival.iata ===
              $state.routes[modelValue.route].arrival.airport.iata &&
            (flight.flight_date === $state.routes[modelValue.route].date ||
              flight.flight_date === $state.routes[modelValue.route].date[0])
        )"
        :key="flight.toString()"
        :flight="flight"
      />
      <!-- @click="handleSelect(flight, key)" -->
    </div>
    <div class="flex flex-col gap-3"></div>
    <NavigationButtons
      @previous="$emit('back')"
      @next="$emit('submit')"
    />
      <!-- :nextDisabled="
        $state.routes && !Object.values($state.routes).every((e) => e.flight)
      " -->
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import Button from "@/components/molecules/Button.vue";
import ButtonBack from "@/components/molecules/ButtonBack.vue";
import ButtonFlight from "./ButtonFlight.vue";
import { ClaimsForm, Flight } from "@/types";
import NavigationButtons from "./NavigationButtons.vue";
import ButtonLarge from "./ButtonLarge.vue";
import DatePicker from "~~/components/molecules/DatePicker.vue";

export default defineComponent({
  components: {
    FormKit,
    Button,
    ButtonBack,
    ButtonFlight,
    NavigationButtons,
    ButtonLarge,
    DatePicker
},
  props: {
    modelValue: {
      type: Object as () => ClaimsForm,
      required: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    handleSelect(flight: Flight, key: string) {
      // consol
      if (this.$state.routes[key]?.flight?.flight.iata === flight.flight.iata)
        this.$state.routes[key].flight = undefined;
      else this.$state.routes[key].flight = flight;
      console.log(this.$state.routes[key]);
      // if (!this.$state.routes[i]?.flight) {
      //   this.$state.routes[i] = {
      //     ...this.$state.routes[i],
      //     flight,
      //   }
      // }
    },
    submitHandler() {
      this.$emit("submit");
    },
    init() {
      fetch("api/aviationstack-new.json")
        .then((data) => data.json())
        .then(({ data }) => {
          this.$state.flights = (data as Flight[]).map((flight) => ({
            ...flight,
            ...(this.$state.airports[flight.arrival.iata] &&
              this.$state.airports[flight.departure.iata] && {
                distance: getAirportDistance(
                  this.$state.airports[flight.arrival.iata],
                  this.$state.airports[flight.departure.iata]
                ),
              }),
          }));

          console.log(this.$state.flights);
        })
        .catch((error) => {
          console.log(error);
        });
      return;
      // const cors = "https://cors-anywhere.herokuapp.com/";
      // const aviationstack = useRuntimeConfig().public.flight.aviationstack;
      // const date = modelValue.flightDate.split("-");

      // const request = `https://cors-anywhere.herokuapp.com/https://api.flightstats.com/flex/flightstatus/historical/rest/v3/json/route/status/${modelValue.departure}/${modelValue.arrival}/arr/${date[0]}/${date[1]}/${date[2]}?appId=${appId}&appKey=${token}&utc=false&maxFlights=1`;
      // const request = `${cors}https://app.goflightlabs.com/historical/${modelValue.flightDate}?access_key=${flighlabs}&code=${modelValue.departure}&type=departure`

      const request = `${cors}http://api.aviationstack.com/v1/flights/?access_key=${aviationstack}`;
      fetch(request)
        .then((data) => {
          console.log(data);
          return data.json();
        })
        .then((data) => {
          console.log(data);
          // console.log(data.filter(({ arrival }) => arrival.iataCode?.toUpperCase() === modelValue.arrival.toUpperCase()));
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
</script>
<style scoped>
.double {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.triple {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
