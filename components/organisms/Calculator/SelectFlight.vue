<template>
  <div class="flex flex-col gap-2 @container" v-if="useAppState()" ref="container">
    <div class="flex flex-col gap-3">
      <h2 class="text-2xl sm:text-3xl font-bold">Flug auswählen</h2>
    </div>
    <AccordionItem
      index="date"
      :modelValue="active"
      @update:modelValue="active = $event"
      headless
      :tag="{ outer: 'div', inner: 'div', title: 'h3' }"
      :collapsible="false"
    >
      <template #title>
        <h3
          class="w-full flex justify-between items-center text-base sm:text-lg md:text-xl leading-tight font-medium"
        >
          <span class="text-gray-500">Wann bist du geflogen?</span>
          <span v-if="modelValue.flight_date">{{
            new Date(modelValue.flight_date).toLocaleDateString(
              useI18n().locale.value, { weekday: width > 480 ? 'long' : undefined, year: 'numeric', month: 'long', day: 'numeric'}
            )
          }}</span>
        </h3>
      </template>
      <template #content>
        <InputDate v-model="modelValue.flight_date" class="mt-5"/>
      </template>
    </AccordionItem>
    <div v-if="modelValue.flight_date">
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

      <Callout
        type="error"
        icon="exclamation-triangle"
        v-else-if="!filteredFlights.length && error"
        >Flüge konnten nicht geladen werden
      </Callout>

    <Callout
        type="info"
        icon="info-circle"
        v-else-if="!filteredFlights.length"
        >
        An diesem Datum konnten wir keinen Flug von
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
          finden.
                  <!-- <FormKit type="button">Mit Flugnummer finden</FormKit> -->

      </Callout>
    <div
      v-else-if="!isBarred(modelValue.flight_date) && filteredFlights.length"
      class="w-full flex flex-col gap-3"
    >
    <AccordionItem
      index="flight"
      :modelValue="active"
      @update:modelValue="active = $event"
      headless
      :tag="{ outer: 'div', inner: 'div', title: 'h3' }"
      :classes="{ title: 'w-full flex justify-between items-center text-base sm:text-lg md:text-xl leading-tight font-medium mb-5' }"
      :collapsible="false"
    >
      <template #title>
        <span class="text-gray-500">Welchen Flug hast du genommen?</span>
        <span v-if="modelValue.flight" class="flex items-center gap-2"><div class="flex items-center justify-center w-7 h-7 border border-neutral-200 rounded-full"><img :src="logo" :alt="modelValue.flight.airline.name" class="w-5"/></div> {{ new Date(modelValue.flight.departure.scheduled).toLocaleTimeString(useI18n().locale.value, { hour: '2-digit', minute: '2-digit'}) }}</span>
      </template>
      <template #content>
      <Callout v-if="loading" class="justify-center">Loading ... </Callout>
      <div v-else class="flex flex-col gap-5">
        <FlightFrequency
          :flights="filteredFlights"
          :dayTime="dayTime"
          @select="selectTimeOfDay"
        />

        <div v-if="filteredFlights.length > 7" class="relative flex gap-5 mb-5 overflow-x-auto -mx-5 px-5">
          <ButtonLarge
            v-for="timeOfDay in filteredDayTimeButtons"
            :key="timeOfDay.value"
            :name="timeOfDay.value"
            :label="$t(timeOfDay.value)"
            :subLabel="timeOfDay.subLabel"
            @click="selectTimeOfDay(timeOfDay.value)"
            :selected="dayTime === timeOfDay.value"
            class="grow basis-0 shrink-0 min-w-[140px]"
          />
        </div>
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
        <Callout
          type="warning"
          icon="exclamation-triangle"
          v-if="modelValue.route && modelValue.flight && europeanUnion"
        >
        Sowohl der Abflugs- und Zielflughafen als auch die Fluggesellschaft haben ihren Sitz außerhalb der Europäischen Union.
      </Callout>
        </div>
        </template>
      </AccordionItem>
    </div>
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
import FlightFrequency from "~/components/molecules/FlightFrequency.vue";
import AccordionItem from "../Accordion/AccordionItem.vue";
import { useElementSize } from '@vueuse/core'

const container = ref(null as HTMLElement | null);
const { width } = useElementSize(container)


const { aviationstack } = useRuntimeConfig().public.flight;

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const europeanUnion = computed(() => Object.values(useFlightStatus(props.modelValue.flight).europeanUnion.value).every(e => !e))
defineEmits(["back", "submit"]);
const loading = ref(true);
const error = ref(false);
const active = ref(['date'] as string[]);
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
const queries = ref([] as string[]);
watch(
  () => props.modelValue.flight_date || props.modelValue.airport,
  () => {
    fetchFlights()
    if (props.modelValue.flight_date) active.value = ['flight'];
  },
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
  const { departure, arrival } = props.modelValue.airport;
  return (
    flight.departure.iata === departure.iata &&
    flight.arrival.iata === arrival.iata &&
    getISODate(flight.departure.scheduled) ===
      getISODate(props.modelValue.flight_date)
  );
};

const filteredFlights = computed(() =>
  useAppState().flights?.filter(filterFlights)
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

const logo = computed(() => {
  let iata = props.modelValue.flight?.flight.codeshared?.airline_iata?.toUpperCase() || props.modelValue.flight?.airline?.iata
  return getAirlineLogo(iata, 80);
});

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
  const query = `${props.modelValue.airport.departure.iata}-${props.modelValue.airport.arrival.iata}-${getISODate(
    props.modelValue.flight_date
  )}`;
  if (queries.value.includes(query)) return;
  queries.value.push(query);
  // Create a URL instance with the desired URL string
  const proxy =
    process.env.NODE_ENV === "development"
    ? "https://cors-anywhere.herokuapp.com/"
    // ? "https://corsproxy.io/?"
      : "";
  const url = new URL(proxy + "http://api.aviationstack.com/v1/flights");
  url.searchParams.append("access_key", aviationstack);
  url.searchParams.append("dep_iata", props.modelValue.airport?.departure.iata);
  url.searchParams.append("arr_iata", props.modelValue.airport?.arrival.iata);
  // url.searchParams.append('flight_date', props.modelValue.flight_date);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Access-Control-Allow-Origin", "*");
  // headers.append("Origin", "http://localhost:3000");
  // headers.append("X-Requested-With", "XMLHttpRequest");

  const requestOptions = {
    method: "GET",
    headers: headers,
  };

  console.log("fetching...", url.href);
  // fetch("api/aviationstack-lax-jfk.json")
  // fetch("api/aviationstack-delayed.json")
  fetch(url.href, requestOptions)
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

      console.log("success", data);
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
      error.value = error;
    })
    .finally(() => {
      console.log("done")
      loading.value = false;
    });
}
</script>
