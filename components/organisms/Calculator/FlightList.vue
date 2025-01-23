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
  hideCodeshared?: boolean;
  sortReverse?: boolean;
}>();
const { fetchFlights, flights, getFilteredFlights } = useFlights();
const { airlines } = useAirlines();
const show = ref(false);
const container = ref(null);
const groups = ref(new Map<string, Map<string, Flight>>());
const getId = (flight: Flight) => {
  if (!flight?.departure) return;
  return `${flight.departure.scheduledTime}-${flight.flight.iata}`;
};

const group = (index: number, list: Flight[], max?: number): boolean => {
  const [flight, nextFlight] = [list[index], list[index + 1]];
  const currentFlightKey = getCodesharedFlightId(flight);
  if (!currentFlightKey) return true;
  if (!groups.value.get(currentFlightKey)) {
    groups.value.set(currentFlightKey, new Map());
  }
  const flightMap = groups.value.get(currentFlightKey);

  if (!flightMap?.get(flight.flight.iata)) {
    flightMap?.set(flight.flight.iata, flight);
  }

  const indexInMap = [...(groups.value.get(currentFlightKey)?.values() || [])]
    .sort(sortByScheduled)
    .findIndex((e) => e.flight.iata === flight.flight.iata);

  return max
    ? indexInMap < max
    : nextFlight && currentFlightKey === getCodesharedFlightId(nextFlight);
};

useIntersectionObserver(
  container,
  ([{ isIntersecting }]) => {
    if (isIntersecting) show.value = true;
  },
  { immediate: true, threshold: 0.5 }
);

const allFlights = computed(() => {
  return (
    props.flights ||
    getFilteredFlights({
      departure: props.departure,
      arrival: props.arrival,
      date: props.date || undefined,
      number: props.number || undefined,
    })
  ).filter((e) => {
    const excludedNames = ["cargo", "fedex", "dhl", "ups"];
    if (
      excludedNames.some((name) =>
        e.airline.name.toLocaleLowerCase().includes(name)
      )
    ) {
      return false;
    }
    if (props.hideCodeshared && e.codeshared) return false;
    return e.flight.iata && e.flight.number;
  });
});

const selectedAirline = ref();
const airlineFilter = (flight: Flight) => {
  if (!selectedAirline.value) {
    return true;
  }

  return (
    flight.airline.iata === selectedAirline.value ||
    flight.codeshared?.airline.iata === selectedAirline.value
  );
};
const filteredDayTimeButtons = computed(() => {
  // Create a Set of valid time periods for O(1) lookup
  const validPeriods = new Set<string>();

  for (const flight of allFlights.value) {
    const departureTime = getDepartureTime(flight.departure?.scheduledTime);

    if (departureTime < 1300) validPeriods.add("morning");
    else if (departureTime <= 1800) validPeriods.add("afternoon");
    else validPeriods.add("evening");

    // Early exit if all periods are found
    if (validPeriods.size === 3) break;
  }

  return timesOfDay.filter((button) => validPeriods.has(button.value));
});

const openGroups = ref(new Set());

// Cache parsed times to avoid repeated parsing
const timeCache = new Map<string, number>();

const getDepartureTime = (scheduledTime?: string): number => {
  if (!scheduledTime) return 0;

  if (!timeCache.has(scheduledTime)) {
    timeCache.set(scheduledTime, parseInt(get24HTime(scheduledTime)));
  }

  return timeCache.get(scheduledTime)!;
};

const dayTimeFilter = (flight: Flight, time = dayTime.value) => {
  if (!time) return true;

  const departureTime = getDepartureTime(flight.departure?.scheduledTime);

  switch (time) {
    case "morning":
      return departureTime < 1300;
    case "afternoon":
      return departureTime >= 1300 && departureTime <= 1800;
    case "evening":
      return departureTime > 1800;
    default:
      return true;
  }
};

const timeFilter = (flight: Flight, t = time.value) => {
  if (!t) return true;
  const departureTime = getDepartureTime(flight.departure?.scheduledTime);
  return t === Math.floor(departureTime / 100);
};

const filteredFlights = computed(() => {
  if (!show.value) return [];
  const n = 3;

  // Apply filters once
  // const filtered = allFlights.value
  const filtered = allFlights.value
    .filter((e) => dayTimeFilter(e) && timeFilter(e) && airlineFilter(e))
    .slice(0, props.limit || Infinity)
    .sort((a, b) => sortByScheduled(a, b, props.sortReverse ? "DESC" : "ASC"));

  // Pre-calculate keys and maps for better performance
  const flightMaps = new Map<
    string,
    {
      flights: Flight[];
      size: number;
      open: boolean;
      containsSelected: boolean;
      allFlightIatas: string[];
    }
  >();

  // Group flights in a single pass
  filtered.forEach((flight) => {
    const key = getCodesharedFlightId(flight);
    if (!key) return;

    if (!flightMaps.has(key)) {
      flightMaps.set(key, {
        flights: [],
        size: 0,
        open: false,
        containsSelected: false,
        allFlightIatas: [],
      });
    }
    const group = flightMaps.get(key)!;
    group.flights.push(flight);
    group.size++;

    if (
      !!props.modelValue &&
      key === getCodesharedFlightId(props.modelValue) &&
      getId(props.modelValue) === getId(flight) &&
      group.size > n - 1
    ) {
      group.containsSelected = true;
    }

    group.open =
      selectedAirline.value ||
      openGroups.value.has(key) ||
      group.containsSelected ||
      filtered.length < 7;
  });

  // Process groups in a single pass
  const result: Flight[] = [];
  let currentDate: string;

  filtered.forEach((flight) => {
    const key = getCodesharedFlightId(flight);
    const updatedFlight = flight;
    if (!key) return;

    const group = flightMaps.get(key)!;
    updatedFlight.allFlightIatas = group.flights.map(
      (e) => `${e.airline.iata} ${e.flight.number}`
    );
    const indexInMap = group.flights.indexOf(updatedFlight);
    // result.push(updatedFlight);
    // return;
    if (
      (group.open && indexInMap + 1 === group.size) ||
      group.size <= n - 1 || // 5 <= 6 - 1
      group.size === n || // 5 === 6
      group.open ||
      indexInMap < n - 1
    ) {
      const thisDate = getISODate(updatedFlight.departure.scheduledTime);
      if (thisDate !== currentDate) {
        const daySeparator = { ...updatedFlight };
        daySeparator.flight.iata = "00";
        daySeparator.type = "separator";
        result.push(daySeparator);
        currentDate = thisDate;
      }
      result.push(updatedFlight);
    }
    if (
      group.size === indexInMap + 1 &&
      group.size > n &&
      !group.containsSelected &&
      filtered.length > 7
    ) {
      // Get all airlines from hidden flights (after index n-1)
      const hiddenAirlines = group.flights
        .slice(n - 1)
        .filter((flight, i, arr) => {
          return (
            arr.findIndex((a) => a.airline.iata === flight.airline.iata) === i
          );
        })
        .map((f) => f.airline)
        .reverse(); // Remove duplicates

      const toggleButton = { ...updatedFlight };
      toggleButton.flight.iata = "XX";
      toggleButton.type = "toggle";
      toggleButton.airlines = hiddenAirlines;

      result.push(toggleButton);
    }
  });

  return result;
});
const filteredAirlines = computed(() => {
  const airlineMap = new Map<string, Flight>();

  for (const flight of allFlights.value) {
    const iata = flight.airline.iata;
    if (!airlineMap.has(iata)) {
      airlineMap.set(iata, flight);
    }
  }

  return Array.from(airlineMap.values()).sort((a, b) =>
    a.airline.name.localeCompare(b.airline.name)
  );
});
const loading = ref(true);

const supabase = useSupabaseClient<Database>();
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

watch(filteredDayTimeButtons, () => {
  if (!dayTime.value) return;
  if (
    !filteredDayTimeButtons.value.some(({ value }) => value === dayTime.value)
  ) {
    dayTime.value = null;
  }
});
const toggleFlightGroup = (flight: Flight) => {
  const key = getCodesharedFlightId(flight);
  if (openGroups.value.has(key)) {
    openGroups.value.delete(getCodesharedFlightId(flight));
  } else {
    openGroups.value.add(getCodesharedFlightId(flight));
  }
};
</script>
<template>
  <div ref="container">
    <div
      class="flex flex-col gap-5 bg-neutral-100 items-center justify-center font-medium rounded-xl p-12"
      v-if="!allFlights.length && loading"
    >
      <FontAwesomeIcon icon="circle-quarter" class="animate-revolve text-xl" />
      <span class="text-neutral-500">Flüge werden gesucht ...</span>
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
        v-if="allFlights.length > 7 && showFilter"
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
      <div
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
      </div>
      <ListGroupTransition
        class="flex flex-col gap-5"
        :style="`--total: ${filteredFlights.length};`"
      >
        <FlightCard
          v-for="(flight, index) in filteredFlights"
          :key="`${flight.flight?.iata}`"
          :flight="flight"
          @click="handleSelect(flight)"
          @toggle="toggleFlightGroup(flight)"
          :group-open="openGroups.has(getCodesharedFlightId(flight))"
          :style="{
            top: `${
              index * (flight.type === 'toggle' ? 49.5 : 81.5) +
              (group(index, filteredFlights) ? 4 : 20)
            }px`,
            '--i': index + 1,
          }"
          class="w-full"
          :selected="
            `${flight.departure.scheduledTime}-${flight.flight.iata}` ===
            `${modelValue?.departure.scheduledTime}-${modelValue?.flight.iata}`
          "
          :class="{
            'rounded-b-none -mb-4 [&.flight_+_*]:rounded-t-none': group(
              index,
              filteredFlights
            ),
          }"
          v-bind="flightCard"
        />
        <!-- <ButtonLarge
          :key="'no-flight'"
          :style="`top: ${(filteredFlights.length + 1) * 100 - 100}px; --i: ${
            filteredFlights.length + 1
          };`"
          class="text-center"
        >
          Mein Flug ist nicht aufgeführt
        </ButtonLarge> -->
      </ListGroupTransition>
    </div>
  </div>
</template>
