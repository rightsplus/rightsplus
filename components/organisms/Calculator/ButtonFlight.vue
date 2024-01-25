<template>
  <button
    class="flex gap-5 items-center rounded-lg py-3 px-5 @container border border-transparent"
    :class="{
      'bg-gray-700 text-white': selected,
      'bg-neutral-100 hover:bg-neutral-50 text-gray-800 hover:border-neutral-100':
        !selected,
    }"
    @click="emit('click', flight)"
  >
    <div
      class="w-14 h-14 hidden justify-center items-center bg-white rounded-full -ml-2 shrink-0 @md:flex"
    >
      <FontAwesomeIcon
        v-if="flight.flight_status === 'otherFlight'"
        icon="plane-slash"
        class="text-sm text-gray-400"
      />
      <img
        v-else
        v-show="!logoError"
        @error="logoError = true"
        @load="logoError = false"
        :alt="flight.airline?.name"
        :src="logo"
        class="w-10 text-xs"
      />
    </div>
    <div class="flex flex-col items-start text-start">
      <span
        class="text-sm leading-none"
        v-if="
          flight.flight_status !== 'otherFlight' &&
          flight.departure &&
          flight.arrival
        "
        ><span class="font-bold">{{
          departureCity
        }}</span>
        to
        <span class="font-bold">{{
          arrivalCity
        }}</span></span
      >

      <span
        v-if="flight.flight_status === 'otherFlight'"
        class="text-lg font-bold leading-none h-6"
        >{{ $t("otherFlight.label") }}</span
      >
      <span
        v-else-if="flight.departure && flight.arrival"
        class="text-lg font-bold flex items-center gap-3"
        >{{ time(flight.departure.scheduled)
        }}<FontAwesomeIcon icon="plane" class="text-sm text-gray-400" />{{
          time(flight.arrival.scheduled)
        }}<span v-if="overNight(flight)" class="-ml-2 text-gray-500 text-xs"
          >+{{ overNight(flight) }}</span
        ></span
      >
      <span
        v-if="flight.flight_status === 'otherFlight'"
        class="text-base leading-none"
        >{{ $t("otherFlight.sublabel") }}</span
      >
      <span v-else class="flex items-center gap-2 text-base leading-none">
        <span
          class="w-6 h-6 flex justify-center items-center bg-white rounded-full ml-auto shrink-0 @md:hidden"
          v-if="flight.airline"
        >
          <img
            v-show="!logoError"
            @error="logoError = true"
            @load="logoError = false"
            :alt="flight.airline?.name"
            :src="logo"
            class="w-5" /></span
        ><span
          >{{ flight.airline?.name
          }}<span
            v-if="ucfirst(flight.flight.codeshared?.airline_name)"
            class="opacity-50"
          >
            operated by
            {{ ucfirst(flight.flight.codeshared?.airline_name) }}</span
          ></span
        ></span
      >
    </div>

    <div
      class="flex flex-col gap-1 items-center ml-auto"
      v-if="flight.flight_status !== 'otherFlight'"
    >
      <span
        class="ml-auto text-gray-400 text-base font-medium leading-none whitespace-nowrap"
        >{{ iata }}</span
      >
      <span
        v-if="flight.flight_status === 'cancelled'"
        class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
        :class="selected ? 'text-red-400' : 'text-red-500'"
        >{{ $t("cancelled") }}</span
      >
      <span
        v-else-if="flight.arrival?.delay"
        class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
        :class="selected ? 'text-red-400' : 'text-red-500'"
        >{{
          $t("delayed.by", { value: getDuration(flight.arrival?.delay) })
        }}</span
      >
      <span
        v-else-if="
          flight.flight_status === 'scheduled' &&
          new Date(flight.departure.scheduled) > new Date()
        "
        class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
        :class="selected ? 'text-green-400' : 'text-green-600'"
        >{{ $t("onTime") }}</span
      >
    </div>
  </button>
</template>

<script setup lang="ts">
import { Flight } from "@/types";

const props = defineProps<{
  selected: Flight | null;
  flight: Flight;
}>();

const emit = defineEmits(["click"]);
const selected = computed(() => {
  return props.selected?.flight?.iata === props.flight.flight.iata;
});
const iata = computed(() => {
  return props.flight.flight.iata?.replace(/^(.{2})(.*)$/, "$1 $2");
});
const logoError = ref(false);
const logo = computed(() => {
  let iata =
    props.flight.flight.codeshared?.airline_iata?.toUpperCase() ||
    props.flight.airline?.iata;
  return getAirlineLogo(iata, 80);
});
const date = (date: string) => {
  return new Date(date).toLocaleDateString(useI18n().locale.value);
};
const departureCity = ref();
const arrivalCity = ref();
const { locale } = useI18n()

watch(() => props.flight, () => {
  getCities([props.flight.departure.iata, props.flight.arrival.iata], locale.value).then(([departure, arrival]) => {
    departureCity.value = departure;
    arrivalCity.value = arrival;
  });
}, {immediate: true, deep: true})
const overNight = (flight: Flight) => {
  const getTime = (date: string) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const timeDifferenceDays =
    (getTime(flight.arrival.scheduled) - getTime(flight.departure.scheduled)) /
    (1000 * 60 * 60 * 24);

  return timeDifferenceDays !== 0 ? Math.floor(timeDifferenceDays) : 0;
};
const time = (time: string) => {
  return new Date(time).toLocaleTimeString(useI18n().locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
const ucfirst = (value: string) => {
  // return value
  return value?.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
};
</script>
