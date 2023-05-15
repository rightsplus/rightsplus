<template>
  <div class="flex flex-col gap-8" v-if="useAppState()">
    <div class="flex flex-col gap-3">
      <h2 class="text-2xl sm:text-3xl font-bold">
        Wähle den Flug um den es geht
      </h2>
    </div>
      <h3 class="flex justify-between items-center text-lg sm:text-xl  font-medium">
        <span class="text-gray-500">Wann bist du geflogen?</span>
        <span  class="">{{new Date(modelValue.flight_date).toLocaleDateString(useI18n().locale.value)}}</span>
      </h3>
    <InputDate v-model="modelValue.flight_date" />
    <div
      v-if="
        useAppState().routes && Object.values(useAppState().routes).length > 1
      "
      v-for="([key, route], i) in Object.entries(useAppState().routes)"
      :key="key"
      class="w-full flex flex-col gap-3"
    >
      <ButtonLarge
        :selected="modelValue.route === key"
        name="no"
        @click="modelValue.route = key"
        class="flex flex-col !gap-1 !items-start"
      >
        <span class="flex items-center gap-3 font-bold"
          >{{ route.departure.airport.iata
          }}<FontAwesomeIcon icon="plane" class="text-gray-400 text-sm" />
          {{ route.arrival?.airport.iata }}</span
        >
        <span class="text-sm"
          ><span class="font-bold">{{ route.departure.airport.city }}</span> to
          <span class="font-bold">{{ route.arrival?.airport.city }}</span></span
        >
      </ButtonLarge>
    </div>

    <h3 class="text-xl sm:text-2xl font-bold text-gray-500">
      Welcher war dein Flug?
    </h3>
    <div
      v-if="modelValue.route && useAppState().routes[modelValue.route]"
      class="w-full flex flex-col gap-3"
    >
      <ButtonFlight
        v-for="flight in useAppState().flights.filter(filterFlights)"
        :key="flight.flight.number"
        :flight="flight"
        :selected="modelValue.flight"
        @click="handleSelect"
      />
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
import InputDate from "~~/components/molecules/InputDate.vue";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const emit = defineEmits(["back", "submit"]);
onMounted(() => {
  init();
});

const filterFlights = (flight: Flight) => {
  if (!props.modelValue.route) return false;
  const { departure, arrival } = useAppState().routes[props.modelValue.route];
  return (
    flight.departure.iata === departure.airport.iata &&
    flight.arrival.iata === arrival.airport.iata &&
    flight.flight_date === props.modelValue.flight_date
  );
};

const handleSelect = (flight: Flight) => {
  console.log(flight);
  if (
    flight.flight.iata?.toUpperCase() === props.modelValue.flight?.flight.iata
  ) {
    props.modelValue.flight = null;
    return;
  }
  props.modelValue.flight = flight;
  console.log(props.modelValue.flight);
  // consol
  // if (useAppState().claims.flight?.flight.iata === flight.flight.iata) {
  //   useAppState().routes[key].flight = undefined;
  // } else {
  //   useAppState().routes[key].flight = flight;
  // }
  // console.log(useAppState().routes[key]);
  // if (!this.useAppState().routes[i]?.flight) {
  //   this.useAppState().routes[i] = {
  //     ...this.useAppState().routes[i],
  //     flight,
  //   }
  // }
};
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
  console.log(props.modelValue.route);
  if (Object.keys(useAppState().routes || {})?.length === 1) {
    props.modelValue.route = Object.keys(useAppState().routes)[0];
  }
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
