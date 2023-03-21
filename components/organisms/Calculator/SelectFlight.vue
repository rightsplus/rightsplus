<template>
  <div class="flex flex-col gap-5" v-if="$state">
    <h1 class="text-3xl font-bold">Flug auswählen</h1>
    <div
      v-if="modelValue.routes"
      v-for="([key, route], i) in Object.entries(modelValue.routes)"
      :key="key"
      class="w-full flex flex-col gap-3"
    >
      <span class="flex items-center gap-3 font-bold"
        >{{ route.departure.airport.iata
        }}<FontAwesomeIcon icon="plane" class="text-gray-400 text-sm" />
        {{ route.arrival.airport.iata }}</span
      >
      <ButtonFlight
        v-for="flight in $state.flights.filter(
          (flight) =>
            flight.departure.iata === route.departure.airport.iata &&
            flight.arrival.iata === route.arrival.airport.iata &&
            flight.flight_date === route.date
        )"
        :key="flight.toString()"
        :flight="flight"
        @click="handleSelect(flight, key)"
        :selected="modelValue?.routes[key]?.flight"
      />
    </div>
    <div class="flex flex-col gap-3"></div>
    <NavigationButtons
      @previous="$emit('back')"
      @next="$emit('submit')"
      :nextDisabled="!Object.values(modelValue?.routes).every((e) => e.flight)"
    />
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

export default defineComponent({
  components: {
    FormKit,
    Button,
    ButtonBack,
    ButtonFlight,
    NavigationButtons,
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
      if (
        this.modelValue.routes[key]?.flight?.flight.iata === flight.flight.iata
      )
        this.modelValue.routes[key].flight = undefined;
      else this.modelValue.routes[key].flight = flight;
      console.log(this.modelValue.routes[key]);
      // if (!this.modelValue.routes[i]?.flight) {
      //   this.modelValue.routes[i] = {
      //     ...this.modelValue.routes[i],
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
            distance: getAirportDistance(
              this.$state.airports[flight.arrival.iata],
              this.$state.airports[flight.departure.iata]
            ),
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
