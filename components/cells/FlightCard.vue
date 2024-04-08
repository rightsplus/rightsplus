<template>
  <component
    :is="is || 'div'"
    class="rounded-lg py-3 px-5 @container border border-transparent flex flex-col gap-3"
    :class="{
      'bg-gray-700 text-white': selected,
      'bg-neutral-100 text-gray-800': !selected,
      'hover:bg-neutral-50 hover:border-neutral-100':
        !selected && !disabled && is === 'button',
    }"
    @click="emit('click')"
  >
    <div class="flex gap-2 sm:gap-5 items-center w-full">
      <AirlineLogo class="-ml-2 hidden @md:flex" :flight="flight" size="lg" />
      <div class="flex flex-col items-start text-start">
        <span
          class="text-sm leading-none"
          v-if="airports && flight.departure && flight.arrival"
          ><span class="font-bold">{{ city.departure }}</span>
          {{ $t("to") }}
          <span class="font-bold">{{ city.arrival }}</span></span
        >

        <span
          v-if="flight.departure && flight.arrival"
          class="text-lg font-bold flex items-center gap-3"
          >{{
            time(flight.departure.scheduledTime)
          }}<FontAwesomeIcon icon="plane" class="text-sm text-gray-400" />{{
            time(flight.arrival.scheduledTime)
          }}<span v-if="overNight(flight)" class="-ml-2 text-gray-500 text-xs"
            >+{{ overNight(flight) }}</span
          ></span
        >
        <span class="flex items-center gap-2 text-sm leading-none">
          <AirlineLogo
            :flight="flight"
            size="sm"
            class="ml-auto @md:hidden"
          /><span
            >{{ flight.airline?.name
            }}<span v-if="flight?.codeshared?.airline.name" class="opacity-50">
              operated by
              {{ flight?.codeshared?.airline.name }}</span
            ></span
          ></span
        >
      </div>

      <div class="flex flex-col gap-1 items-center ml-auto shrink-0">
        <span
          class="ml-auto text-gray-400 text-base font-medium leading-none whitespace-nowrap"
          >{{ iata }}</span
        >
        <span
          v-if="flight.status === 'cancelled'"
          class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
          :class="selected ? 'text-red-400' : 'text-red-500'"
          >{{ $t("cancelled") }}</span
        >
        <span
          v-else-if="flight.arrival?.delay > 0"
          class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
          :class="selected ? 'text-orange-400' : 'text-orange-500'"
          >{{
            $t("delayed.by", { value: getDuration(flight.arrival?.delay) })
          }}</span
        >
        <span
          v-else-if="flight.arrival?.delay < 0"
          class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
          :class="selected ? 'text-green-400' : 'text-green-500'"
          >{{
            $t("early.by", { value: getDuration(flight.arrival?.delay * -1) })
          }}</span
        >
        <span
          v-else-if="
            flight.status === 'landed' &&
            new Date(flight.departure.scheduledTime) > new Date()
          "
          class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
          :class="selected ? 'text-green-400' : 'text-green-600'"
          >{{ $t("onTime") }}</span
        >
      </div>
      <FontAwesomeIcon
        v-if="is === 'button'"
        icon="angle-right"
        class="text-gray-400 text-base shrink-0"
      />
    </div>
    <hr class="w-full mt-2" v-if="compensation" />
    <div v-if="compensation"></div>
  </component>
</template>

<script setup lang="ts">
import type { Flight } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirlineLogo from "./AirlineLogo.vue";

const props = defineProps<{
  flight: Flight;
  selected?: boolean;
  is?: string;
  disabled?: boolean;
  airports?: boolean;
  compensation?: boolean;
}>();

const emit = defineEmits(["click"]);
const iata = computed(() => {
  return `${props.flight.airline.iata} ${props.flight.flight.number}`;
});

const city = useCities({
  departure: props.flight.departure?.iata,
  arrival: props.flight.arrival?.iata,
});

const overNight = (flight: Flight) => {
  const getTime = (date: string) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const timeDifferenceDays =
    (getTime(flight.arrival.scheduledTime) -
      getTime(flight.departure?.scheduledTime)) /
    (1000 * 60 * 60 * 24);

  return timeDifferenceDays !== 0 ? Math.floor(timeDifferenceDays) : 0;
};
const time = (time: string) => {
  return new Date(time).toLocaleTimeString(useI18n().locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
