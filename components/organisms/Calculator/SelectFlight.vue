<template>
  <div class="flex flex-col gap-5" v-if="$state">
    <h1 class="text-3xl font-bold">Flug auswählen</h1>
    <div class="flex flex-col gap-3">
      <ButtonFlight
        v-for="flight in $state.flights"
        :key="flight.toString()"
        :flight="flight"
        @click="handleSelect(flight)"
        :selected="modelValue?.selectedFlight"
      />
    </div>
    <NavigationButtons @previous="$emit('back')" @next="$emit('submit')"
      :nextDisabled="!$state.flights.map(({ flight }) => flight.iata).includes(modelValue?.selectedFlight?.flight?.iata)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import Button from "@/components/molecules/Button.vue";
import ButtonBack from "@/components/molecules/ButtonBack.vue";
import ButtonFlight from "./ButtonFlight.vue";
import { Flight } from "@/types";
import NavigationButtons from "./NavigationButtons.vue";

export default defineComponent({
  components: {
    FormKit,
    Button,
    ButtonBack,
    ButtonFlight,
    NavigationButtons
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    handleSelect(flight: Flight) {
      this.modelValue.selectedFlight = flight;
    },
    submitHandler() {
      this.$emit("submit");
    },
    init() {
      fetch("api/aviationstack-new.json")
        .then((data) => data.json())
        .then(({ data }) => {
          this.$state.flights = (data as Flight[]).filter(
            ({ flight_date, departure, arrival }) =>
              // new Date(flight_date) === new Date(this.modelValue.departure) &&
              departure.iata?.toUpperCase() ===
                this.modelValue.airport.departure.iata.toUpperCase() &&
              arrival.iata?.toUpperCase() ===
                this.modelValue.airport.arrival.iata.toUpperCase()
          );
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
