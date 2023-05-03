<template>
  <div class="flex flex-col gap-5" v-if="useAppState()">
    <h1 class="text-2xl sm:text-3xl font-bold">
      Um welchen Flug handelt es sich?
    </h1>
    <div
      v-if="useAppState().routes"
      v-for="([key, route], i) in Object.entries(useAppState().routes)"
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
          {{ route.arrival?.airport.iata }}</span
        >
      </ButtonLarge>
    </div>

    <DatePicker v-model="modelValue.date" />

    <div
      v-if="modelValue.route && useAppState().routes[modelValue.route]"
      class="w-full flex flex-col gap-3"
    >
      <ButtonFlight
        v-for="flight in useAppState().flights.filter(filterFlights)"
        :key="flight.toString()"
        :flight="flight"
      />
      <!-- @click="handleSelect(flight, key)" -->
    </div>
    <div class="flex flex-col gap-3"></div>
    <NavigationButtons @previous="$emit('back')" @next="$emit('submit')" />
    <!-- :nextDisabled="
        useAppState().routes && !Object.values(useAppState().routes).every((e) => e.flight)
      " -->
  </div>
</template>
<script setup lang="ts">
import ButtonFlight from "./ButtonFlight.vue";
import { ClaimsForm, Flight } from "@/types";
import NavigationButtons from "./NavigationButtons.vue";
import ButtonLarge from "./ButtonLarge.vue";
import DatePicker from "~~/components/molecules/DatePicker.vue";
const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const emit = defineEmits(["back", "submit"]);
onMounted(() => {
  init();
});

const filterFlights = (flight: Flight) =>
  props.modelValue.route &&
  flight.departure.iata ===
    useAppState().routes[props.modelValue.route].departure.airport.iata &&
  flight.arrival.iata ===
    useAppState().routes[props.modelValue.route].arrival.airport.iata &&
  (flight.flight_date === useAppState().routes[props.modelValue.route].date ||
    flight.flight_date === useAppState().routes[props.modelValue.route].date?.[0]);

const init = () => {
  fetch("api/aviationstack-new.json")
    .then((data) => data.json())
    .then(({ data }) => {
      useAppState().flights = (data as Flight[]).map((flight) => {
        return {
          ...flight,
          ...(useAirports().value[flight.arrival.iata] &&
            useAirports().value[flight.departure.iata] && {
              distance: getAirportDistance(
                useAirports().value[flight.arrival.iata],
                useAirports().value[flight.departure.iata]
              ),
            }),
        };
      });

      console.log(useAppState().flights);
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
};
const handleSelect = (flight: Flight, key: string) => {
  // consol
  if (useAppState().routes[key]?.flight?.flight.iata === flight.flight.iata)
    useAppState().routes[key].flight = undefined;
  else useAppState().routes[key].flight = flight;
  console.log(useAppState().routes[key]);
  // if (!this.useAppState().routes[i]?.flight) {
  //   this.useAppState().routes[i] = {
  //     ...this.useAppState().routes[i],
  //     flight,
  //   }
  // }
};
const submitHandler = () => {
  emit("submit");
};
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
