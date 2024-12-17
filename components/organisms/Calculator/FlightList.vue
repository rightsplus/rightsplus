
<script lang="ts" setup>
import type { Database, Flight } from "@/types";
import FlightCard, {
  type FlightCardProps,
} from "@/components/cells/FlightCard.vue";
import ListGroupTransition from "@/components/cells/ListGroupTransition.vue";
import FlightFrequency from "~/components/molecules/FlightFrequency.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useIntersectionObserver } from "@vueuse/core";
import AirlineLogo from "~/components/cells/AirlineLogo.vue";
import DropdownButton from "~/components/molecules/DropdownButton.vue";
const props = defineProps<{
  flights?: Flight[];
  departure?: string;
  arrival?: string;
  date?: string | null;
  number?: string | null;
  modelValue?: Flight | null;
  limit?: number;
  flightCard?: Partial<FlightCardProps>;
  showFilter?: boolean;
}>();
const { fetchFlights, flights, getFilteredFlights } = useFlights();
const { airlines } = useAirlines();
const show = ref(false);
const container = ref(null);
const group = (index: number) =>
  filteredFlights.value[index + 1]?.departure?.scheduledTime ===
    filteredFlights.value[index].departure?.scheduledTime &&
  operatingAirline(filteredFlights.value[index + 1]) ===
    operatingAirline(filteredFlights.value[index]);
useIntersectionObserver(
  container,
  ([{ isIntersecting }]) => {
    if (isIntersecting) show.value = true;
  },
  { immediate: true, threshold: 0.5 }
);

const allFlights = computed(() => {
  // console.log(props.flights, getFilteredFlights({
  //     departure: props.departure,
  //     arrival: props.arrival,
  //     date: props.date,
  //     number: props.number,
  //   }))
  return (
    props.flights ||
    getFilteredFlights({
      departure: props.departure,
      arrival: props.arrival,
      date: props.date || undefined,
      number: props.number || undefined,
    })
  ).filter((e) => e.flight.iata && e.flight.number);
});
const filteredFlights = computed(() =>
  allFlights.value
    .filter(() => show.value)
    .filter((e) => dayTimeFilter(e))
    .filter((e) => timeFilter(e))
    .filter((e) => airlineFilter(e))
    .slice(0, props.limit || Infinity)
    .sort(sortByScheduled)
);
const filteredAirlines = computed(() => {
  const airlines = airlinesByFlights(allFlights.value).sort((a, b) =>
    a.airline.name.localeCompare(b.airline.name)
  );
  return airlines;
});
const loading = ref(true);
const operatingAirline = (flight: Flight) =>
  flight?.codeshared?.airline.iata || flight?.airline.iata;
  
const supabase = useSupabaseClient<Database>()
onMounted(() => {
  // console.log('delete')
  // supabase
  //   .from('flight')
  //   .delete()
  //   .lt('id', "200000")
  //   .then(e => console.log(e))
});
const fetch = () => {
  loading.value = true;
  if (!props.date) {
    loading.value = false;
    return;
  }
  fetchFlights({
    departure: props.departure,
    arrival: props.arrival,
    date: props.date,
  })
  .then(console.log)
  .catch(console.log)
  .finally(() => (loading.value = false));
};
onMounted(() => {
  fetch();
});

const emit = defineEmits<{
  "update:modelValue": [flight: Flight];
  select: [flight: Flight];
}>();
const handleSelect = (flight: Flight) => {
  emit("update:modelValue", flight);
  emit("select", flight);
};
const dayTime = ref(null as null | string);
const time = ref<number>();
const selectTime = (value: number) => {
  if (time.value === value) {
    time.value = undefined;
    return;
  }
  time.value = value;
};
const selectTimeOfDay = (value: string) => {
  if (dayTime.value === value) {
    dayTime.value = null;
    return;
  }
  dayTime.value = value;
};

const timesOfDay = [
  {
    value: "morning",
    subLabel: "00:00 - 13:00",
  },
  {
    value: "afternoon",
    subLabel: "13:00 - 18:00",
  },
  {
    value: "evening",
    subLabel: "18:00 - 24:00",
  },
];
const dayTimeFilter = (flight: Flight, time = dayTime.value) => {
  if (!time) return true;
  const { scheduledTime } = flight.departure || {};
  const departureTime = parseInt(get24HTime(scheduledTime));
  if (time === "morning") {
    return departureTime < 1300;
  }
  if (time === "afternoon") {
    return departureTime >= 1300 && departureTime <= 1800;
  }
  if (time === "evening") {
    return departureTime > 1800;
  }
};
const timeFilter = (flight: Flight, t = time.value) => {
  if (!t) return true;
  return (
    t === parseInt(get24HTime(flight.departure?.scheduledTime).slice(0, -2))
  );
};
const selectedAirline = ref();
const airlineFilter = (flight: Flight) => {
  return (
    (!selectedAirline.value ||
      flight.airline.iata === selectedAirline.value ||
      flight.codeshared?.airline.iata === selectedAirline.value) &&
    !flight.airline.name.toLocaleLowerCase().includes("cargo")
  );
};
const filteredDayTimeButtons = computed(() =>
  timesOfDay.filter((button: { value: string; subLabel: string }) => {
    return allFlights.value?.some((flight) =>
      dayTimeFilter(flight, button.value)
    );
  })
);

watch(filteredDayTimeButtons, () => {
  if (!dayTime.value) return;
  if (
    !filteredDayTimeButtons.value.some(({ value }) => value === dayTime.value)
  ) {
    dayTime.value = null;
  }
});
// watch(
//   () => props.allFlights && dayTime.value,
//   () => {
//     if (
//       !props.allFlights
//         .filter((e) => dayTimeFilter(e, dayTime.value))
//         .some(
//           (flight) =>
//             flight.flight.iata?.toUpperCase() ===
//               props.modelValue?.flight?.iata || !props.modelValue?.status
//         )
//     ) {
//       emit("update:modelValue", null);
//     }
//   },
//   { immediate: true, deep: true }
// );
</script>
<template>
  <div ref="container">
    <div
      class="flex flex-col gap-5 bg-neutral-100 items-center justify-center font-medium rounded-xl p-12"
      v-if="!allFlights.length && loading"
    >
      <FontAwesomeIcon icon="circle-quarter" class="animate-revolve text-xl" />
      <span class="text-neutral-500">Flüge werden geladen ...</span>
    </div>
    <div
      class="flex flex-col gap-5 bg-neutral-100 items-center justify-center font-medium rounded-xl p-12"
      v-else-if="!allFlights.length"
    >
      <FontAwesomeIcon icon="plane-slash" class="text-xl" />
      <span class="text-neutral-500">Keine Flüge gefunden</span>
      <span class="text-neutral-500 text-xs"
        >{{ departure }} &rsaquo; {{ arrival }}, {{ date }}</span
      >
      <Button
        tertiary
        @click="fetch"
        class="text-sm"
        prefixIcon="arrow-rotate-right"
        >erneut laden</Button
      >
    </div>
    <div class="flex flex-col gap-5" v-else>
      <div
        class="flex gap-2 flex-wrap"
        v-if="allFlights.length > 12 && showFilter"
      >
        <DropdownButton
          v-model="selectedAirline"
          name="airline"
          :label="$t('filterBy', { value: $t('airline') })"
          :options="[
            ...filteredAirlines.map((flight) => ({
              value: flight.airline.iata,
              label: airlines[flight.airline.iata]?.name || flight.airline.name,
              prepend: {
                component: AirlineLogo,
                props: {
                  airline: flight.airline,
                  size: 'xs',
                },
              },
            })),
          ]"
          placeholder="Filtern ..."
          class="w-full"
        />
        <!-- <span
          class="bg-neutral-100 cursor-pointer hover:bg-neutral-200 rounded p-2 text-sm leading-none flex items-center gap-2"
          :class="{
            'bg-primary-500 text-white hover:!bg-primary-600':
              flight.airline.iata === selectedAirline,
            'pointer-events-none opacity-50':
              !filteredFlights
                .map((e) => e.airline.iata)
                .includes(flight.airline.iata) &&
              selectedAirline !== flight.airline.iata,
          }"
          v-for="flight in Object.values(
          allFlights.reduce(
            (acc, curr) => ({ ...acc, [curr.airline.iata]: curr }),
            {} as Record<string, Flight>
          )
        )"
          @click="
            () => {
              if (selectedAirline === flight.airline.iata) {
                selectedAirline = undefined;
              } else {
                selectedAirline = flight.airline.iata;
              }
            }
          "
          ><AirlineLogo :airline="flight.airline" size="xs" />{{
            flight.airline.name
          }}</span
        > -->
      </div>
      <FlightFrequency
        :flights="allFlights"
        :time="time"
        @select="selectTime"
        v-if="filteredDayTimeButtons?.length > 7"
      />

      <!-- <div
        v-if="allFlights.length > 7 && filteredDayTimeButtons?.length > 1"
        class="relative flex gap-5 mb-5 overflow-x-auto -mx-5 px-5"
      >
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
      </div> -->
      <ListGroupTransition
        class="flex flex-col gap-5"
        :style="`--total: ${filteredFlights.length};`"
      >
        <FlightCard
          v-for="(flight, index) in filteredFlights"
          :key="`${flight.flight?.iata}`"
          :flight="flight"
          @click="handleSelect(flight)"
          :style="`top: ${(index + 1) * 100 - 100}px; --i: ${index + 1};`"
          class="w-full"
          :selected="`${flight.departure.scheduledTime}-${flight.flight.iata}` === `${modelValue?.departure.scheduledTime}-${modelValue?.flight.iata}`"
          :class="{
            'rounded-b-none -mb-4 [&_+_*]:rounded-t-none': group(index),
          }"
          v-bind="flightCard"
        />
      </ListGroupTransition>
    </div>
  </div>
</template>