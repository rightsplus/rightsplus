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
        {{ isBarred(modelValue.flight_date)?.toLocaleDateString($i18n.locale) }}
        sind verjährt. Gemäß geltendem EU-Recht kannst du keine Entschädigung
        mehr einfordern.</span
      >
      <NuxtLink
        :to="'/faq/verjaehrung'"
        class="flex gap-2 items-center mt-2 mr-auto hover:underline"
        ><FontAwesomeIcon icon="arrow-right" class="text-xs" />Mehr
        erfahren</NuxtLink
      >
    </Callout>
    <div v-else-if="!filteredFlights.length" class="w-full flex flex-col gap-3">
      <span class="text-sm font-medium"
        >An diesem Datum konnten wir keinen Flug von
        {{
          getCityTranslation(
            useAirports(modelValue.airport.departure.iata),
            useI18n().locale.value
          )
        }}
        nach
        {{
          getCityTranslation(
            useAirports(modelValue.airport.arrival.iata),
            useI18n().locale.value
          )
        }}
        finden.</span
      >
    </div>
    <div class="flex gap-2 items-end">
      <div v-for="(feq, hour) in frequency" class="w-full flex flex-col gap-2">
        <div
          class="rounded cursor-pointer bg-gray-200 hover:bg-gray-300 shrink-0"
          :class="{
            'opacity-50': !feq,

            'bg-primary-400 hover:!bg-primary-500':
              (dayTime === 'morning' && hour < 12) ||
              (dayTime === 'afternoon' && hour >= 12 && hour < 20) ||
              (dayTime === 'evening' && hour >= 20),
          }"
          :style="`height: ${feq * 10 + 5}px`"
          @click="
            selectTimeOfDay(
              hour < 12
                ? 'morning'
                : hour >= 12 && hour < 20
                ? 'afternoon'
                : 'evening'
            )
          "
        />
        <span class="text-xs text-center w-full font-medium">{{ hour }}</span>
      </div>
    </div>
    <div v-if="filteredFlights.length > 7" class="relative flex gap-5 mb-5">
      <ButtonLarge
        v-for="timeOfDay in filteredDayTimeButtons"
        :key="timeOfDay.value"
        :name="timeOfDay.value"
        :label="$t(timeOfDay.value)"
        :subLabel="timeOfDay.subLabel"
        @click="selectTimeOfDay(timeOfDay.value)"
        :selected="dayTime === timeOfDay.value"
        class="grow"
      />
    </div>

    <div
      v-if="!isBarred(modelValue.flight_date) && filteredFlights.length"
      class="w-full flex flex-col gap-3"
    >
      <h3 class="text-lg sm:text-xl font-medium text-gray-500">
        Welchen Flug hast du genommen?
      </h3>

      <ListGroupTransition
        name="list"
        class="relative flex flex-col gap-3"
        :style="`--total: ${filteredFlights.length};`"
      >
        <ButtonFlight
          v-for="(flight, index) in filteredFlights
            .filter((e) => dayTimeFilter(e))
            .sort(sortByScheduled)"
          :key="`${flight.flight.iata}-${flight.flight_date}`"
          :style="`top: ${(index + 1) * 100 - 100}px; --i: ${index + 1};`"
          :flight="flight"
          :selected="modelValue.flight"
          @click="handleSelect"
          class="w-full"
        />
      </ListGroupTransition>
    </div>
    <NavigationButtons
      @previous="$emit('back')"
      @next="$emit('submit')"
      :nextDisabled="
        !!isBarred(modelValue.flight_date) ||
        !modelValue.flight ||
        !filteredFlights.length
      "
    />
  </div>
</template>
<script setup lang="ts">
import ButtonFlight from "./ButtonFlight.vue";
import { ClaimsForm, Flight } from "@/types";
import NavigationButtons from "./NavigationButtons.vue";
import ButtonLarge from "./ButtonLarge.vue";
import InputDate from "@/components/molecules/InputDate.vue";
import Callout from "@/components/molecules/Callout.vue";
import ListGroupTransition from "@/components/cells/ListGroupTransition.vue";
import { filterFlightByEU, get24HTime } from "@/utils";

const { aviationstack } = useRuntimeConfig().public.flight;

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const emit = defineEmits(["back", "submit"]);

const timesOfDay = [
  {
    value: "morning",
    subLabel: "00:00 - 12:00",
  },
  {
    value: "afternoon",
    subLabel: "12:00 - 20:00",
  },
  {
    value: "evening",
    subLabel: "20:00 - 24:00",
  },
];

watch(
  () => props.modelValue.flight_date || props.modelValue.airport,
  fetchFlights,
  { immediate: true, deep: true }
);
const removeDuplicateFlights = (flights: Flight[]) => {
  const uniqueFlights = new Set();
  return flights.filter((flight) => {
    const operatedBy =
      flight.flight.codeshared?.airline_iata?.toUpperCase() ||
      flight.airline.iata?.toUpperCase();
    const id = `${operatedBy}-${get24HTime(
      flight.departure.scheduled
    )}-${get24HTime(flight.arrival.scheduled)}-${getISODate(
      flight.departure.scheduled
    )}`;
    if (uniqueFlights.has(id)) return false;
    uniqueFlights.add(id);
    return true;
  });
};
const sortByScheduled = (a: Flight, b: Flight) =>
  new Date(a.departure.scheduled).getTime() -
  new Date(b.departure.scheduled).getTime();
const dayTime = ref(null as null | string);
const selectTimeOfDay = (value: string) => {
  if (dayTime.value === value) {
    dayTime.value = null;
    return;
  }
  dayTime.value = value;
};

const filterFlights = (flight: Flight) => {
  if (!props.modelValue.route) return false;
  const { departure, arrival } = useAppState().routes[props.modelValue.route];
  return (
    flight.departure.iata === departure.airport.iata &&
    flight.arrival.iata === arrival.airport.iata &&
    getISODate(flight.departure.scheduled) ===
      getISODate(props.modelValue.flight_date)
  );
};

const filteredFlights = computed(() =>
  useAppState().flights?.filter(filterFlights)
);

const flightsPerHour = computed(() =>
  filteredFlights.value.map((e, i) =>
    new Date(e.departure.scheduled).getHours()
  )
);
const frequency = computed(() =>
  [...Array(24)].map(
    (_, index) =>
      flightsPerHour.value.filter((flight) => flight === index).length
  )
);

const dayTimeFilter = (flight: Flight, time = dayTime.value) => {
  if (!time) return true;
  if (
    time === "morning" &&
    parseInt(get24HTime(flight.departure.scheduled)) < 1200
  ) {
    return true;
  }
  if (
    time === "afternoon" &&
    parseInt(get24HTime(flight.departure.scheduled)) >= 1200 &&
    parseInt(get24HTime(flight.departure.scheduled)) <= 2000
  ) {
    return true;
  }
  if (
    time === "evening" &&
    parseInt(get24HTime(flight.departure.scheduled)) > 2000
  ) {
    return true;
  }
};
const filteredDayTimeButtons = computed(() =>
  timesOfDay.filter((button: { value: string; subLabel: string }) => {
    return filteredFlights.value.some((flight) =>
      dayTimeFilter(flight, button.value)
    );
  })
);

watch(
  () => filteredDayTimeButtons.value,
  () => {
    if (!dayTime.value) return;
    if (
      !filteredDayTimeButtons.value.some(
        (button) => button.value === dayTime.value
      )
    ) {
      dayTime.value = null;
    }
  }
);

watch(
  () => filteredFlights.value && dayTime.value,
  () => {
    if (
      !filteredFlights.value
        .filter((e) => dayTimeFilter(e, dayTime.value))
        .some(
          (flight) =>
            flight.flight.iata?.toUpperCase() ===
            props.modelValue.flight?.flight.iata
        )
    ) {
      props.modelValue.flight = null;
    }
  },
  { immediate: true, deep: true }
);

const handleSelect = (flight: Flight) => {
  if (
    flight.flight.iata?.toUpperCase() === props.modelValue.flight?.flight.iata
  ) {
    props.modelValue.flight = null;
    return;
  }
  props.modelValue.flight = flight;
};
function fetchFlights() {
  if (
    !props.modelValue.flight_date ||
    !props.modelValue.airport?.departure.iata ||
    !props.modelValue.airport?.arrival.iata
  )
    return;
  // Create a URL instance with the desired URL string
  const proxy =
    process.env.NODE_ENV === "development"
      ? "https://cors-anywhere.herokuapp.com/"
      : "";
  const url = new URL(proxy + "http://api.aviationstack.com/v1/flights");

  url.searchParams.append("access_key", aviationstack);
  url.searchParams.append("dep_iata", props.modelValue.airport?.departure.iata);
  url.searchParams.append("arr_iata", props.modelValue.airport?.arrival.iata);
  // url.searchParams.append('flight_date', props.modelValue.flight_date);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Origin", "http://localhost:3000");
  headers.append("X-Requested-With", "XMLHttpRequest");

  const requestOptions = {
    method: "GET",
    headers: headers,
  };

  console.log("fetching...", url.href);
  fetch(url.href, requestOptions)
  // fetch("api/aviationstack-lax-jfk.json")
  // fetch("api/aviationstack-delayed.json")
    .then((data) => data.json())
    .then(({ data }: { data: Flight[] }) => {
      const uniqueFlights = data
        ? removeDuplicateFlights(data.sort(sortByScheduled))
        : [];
      // const europeanFlights = uniqueFlights.filter(filterFlightByEU);
      // console.log(europeanFlights);
      // console.log(
      //   europeanFlights.map((e) => [
      //     `${e.departure.iata} → ${e.arrival.iata}`,
      //     e.arrival.delay,
      //     new Date(e.departure.scheduled).toISOString().slice(0, 10),
      //     e.flight_status,
      //   ])
      // );

      useAppState().flights = uniqueFlights?.map((flight) => {
        const airports = {
          departure: useAirports(flight.departure.iata),
          arrival: useAirports(flight.arrival.iata),
        };
        return {
          ...flight,
          ...(airports.departure &&
            airports.arrival && {
              distance: getAirportDistance(
                airports.departure,
                airports.arrival
              ),
            }),
        };
      });
    })
    .catch((error) => {
      console.error(error);
    });

  if (Object.keys(useAppState().routes || {})?.length === 1) {
    props.modelValue.route = Object.keys(useAppState().routes)[0];
  }
}
const submitHandler = () => {
  emit("submit");
};
</script>
