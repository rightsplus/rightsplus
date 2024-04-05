<template>
  <component
    :is="is || 'div'"
    class="rounded-lg py-3 px-5 @container border border-transparent"
    :class="{
      'bg-gray-700 text-white': selected,
      'bg-neutral-100 text-gray-800': !selected,
      'hover:bg-neutral-50 hover:border-neutral-100':
        !selected && !disabled && is === 'button',
    }"
    @click="emit('click')"
  >
    <div class="flex gap-2 sm:gap-5 items-center ">
      <div
        class="w-14 h-14 hidden justify-center items-center bg-white rounded-full -ml-2 shrink-0 @md:flex"
      >
        <FontAwesomeIcon
          v-if="!flight.status"
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
      <div :class="{'opacity-50': pending}">{{ cities.join(' → ') }}</div>
        <span
          class="text-sm leading-none"
          v-if="!flight.status && flight.departure && flight.arrival"
          ><span class="font-bold">{{ cities[0] }}</span>
          {{ $t("to") }}
          <span class="font-bold">{{ cities[1] }}</span></span
        >

        <span
          v-if="!flight.status"
          class="text-lg font-bold leading-none h-6"
          >{{ $t("otherFlight.label") }}</span
        >
        <span
          v-else-if="flight.departure && flight.arrival"
          class="text-lg font-bold flex items-center gap-3"
          >{{ time(flight.departure.scheduledTime)
          }}<FontAwesomeIcon icon="plane" class="text-sm text-gray-400" />{{
            time(flight.arrival.scheduledTime)
          }}<span v-if="overNight(flight)" class="-ml-2 text-gray-500 text-xs"
            >+{{ overNight(flight) }}</span
          ></span
        >
        <span v-if="!flight.status" class="text-sm leading-none">{{
          $t("otherFlight.sublabel")
        }}</span>
        <span v-else class="flex items-center gap-2 text-sm leading-none">
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
            flight.status === 'scheduled' &&
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
  </component>
</template>

<script setup lang="ts">
import type { Flight } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  flight: Flight;
  selected?: boolean;
  is?: string;
  disabled?: boolean;
  weather?: boolean;
}>();

// const { airports } = useAirports();
// const weather = ref();
// onMounted(async () => {
//   weather.value = {...await isExtraordinaryCircumstance(props.flight)};
// });
const emit = defineEmits(["click"]);
const iata = computed(() => {
  return `${props.flight.airline.iata} ${props.flight.flight.number}`;
});
const logoError = ref(false);
const logo = computed(() => {
  let { airline } = props.flight || {};
  return getAirlineLogo(airline?.iata, 80);
});

const {cities, pending} = useCities(
  [props.flight.departure?.iata, props.flight.arrival?.iata],
  {
    iata: true
  }
);


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
