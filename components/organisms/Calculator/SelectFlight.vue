<template>
  <div class="flex flex-col gap-8" v-if="useAppState()">
    <div class="flex flex-col gap-3">
      <h2 class="text-2xl sm:text-3xl font-bold">Flug auswählen</h2>
    </div>

    <h3
      class="flex justify-between items-center text-lg sm:text-xl font-medium"
    >
      <span class="text-gray-500">Wann bist du geflogen?</span>
      <span v-if="modelValue.flight_date" class="">{{
        new Date(modelValue.flight_date).toLocaleDateString(
          useI18n().locale.value
        )
      }}</span>
    </h3>
    <!-- verjährt oder in Zukunft rauskegeln -->
    <InputDate v-model="modelValue.flight_date" />

    <Callout
      type="info"
      icon="info-circle"
      v-if="isBarred(modelValue.flight_date)"
      ><template #title>Dein Flug ist verjährt</template
      ><span
        >Ansprüche für Flugverspätungen vor dem
        {{
          isBarred(modelValue.flight_date)?.toLocaleDateString($i18n.locale)
        }}
        sind verjährt. Gemäß geltendem EU-Recht kannst du keine Entschädigung mehr einfordern.</span
      >
      <NuxtLink
        :to="'/faq/verjaehrung'"
        class="flex gap-2 items-center mt-2 mr-auto hover:underline"
        ><FontAwesomeIcon icon="arrow-right" class="text-xs" />Mehr
        erfahren</NuxtLink
      >
    </Callout>
    <div
      v-else-if="!useAppState().flights.filter(filterFlights).length"
      class="w-full flex flex-col gap-3"
    >
      <span class="text-sm font-medium"
        >An diesem Datum konnten wir keinen Flug von
        {{ getCityTranslation(useAirports(modelValue.airport.departure.iata), useI18n().locale.value) }} nach
        {{ getCityTranslation(useAirports(modelValue.airport.arrival.iata), useI18n().locale.value) }} finden.</span
      >
    </div>

    <div
      v-if="
        !isBarred(modelValue.flight_date) &&
        useAppState().flights.filter(filterFlights).length
      "
      class="w-full flex flex-col gap-3"
    >
      <h3 class="text-lg sm:text-xl font-medium text-gray-500">
        Welcher war dein Flug?
      </h3>
      <ButtonFlight
        v-for="flight in useAppState()
          .flights.filter(filterFlights)
          .sort(
            (a, b) =>
              new Date(a.departure.scheduled_time).getTime() -
              new Date(b.departure.scheduled_time).getTime()
          )"
        :key="flight.flight.number"
        :flight="flight"
        :selected="modelValue.flight"
        @click="handleSelect"
      />
    </div>

    <NavigationButtons
      @previous="$emit('back')"
      @next="$emit('submit')"
      :nextDisabled="
        isBarred(modelValue.flight_date) ||
        !modelValue.flight ||
        !useAppState().flights.filter(filterFlights).length
      "
    />
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
import InputDate from "@/components/molecules/InputDate.vue";
import Callout from "@/components/molecules/Callout.vue";

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
    flight.departure.iata_code === departure.airport.iata &&
    flight.arrival.iata_code === arrival.airport.iata &&
    getISODate(flight.departure.scheduled_time) ===
      getISODate(props.modelValue.flight_date)
  );
};

const handleSelect = (flight: Flight) => {
  if (
    flight.flight.iata_number?.toUpperCase() ===
    props.modelValue.flight?.flight.iata_number
  ) {
    props.modelValue.flight = null;
    return;
  }
  props.modelValue.flight = flight;
};
const init = () => {
  // fetch("api/aviationstack-new.json")
  fetch("api/flights-aviation-edge.json")
    .then((data) => data.json())
    .then((data) => {
      // console.log(
      //   data.map((e) => [
      //     `${e.departure.iata_code} → ${e.arrival.iata_code}`,
      //     new Date(e.departure.scheduled_time).toISOString().slice(0, 10),
      //     e.status,
      //   ])
      // );
      useAppState().flights = (data as Flight[]).map((flight) => {
        return {
          ...flight,
          ...(useAirports()[flight.arrival.iata_code] &&
            useAirports()[flight.departure.iata_code] && {
              distance: getAirportDistance(
                useAirports()[flight.arrival.iata_code],
                useAirports()[flight.departure.iata_code]
              ),
            }),
        };
      });

      // console.log(useAppState().flights);
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
