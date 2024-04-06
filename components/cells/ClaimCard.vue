<template>
  <div class="rounded-lg py-3 px-5 @container border border-transparent bg-neutral-100 text-gray-800 grid gap-5">
    <div class="flex justify-between">
      <div class="flex flex-col">
        <span class="font-bold text-xl">{{ flight.departure.iata }}</span>
        <span class="text-sm text-neutral-500">{{ city.departure }}</span>
      </div>
      <div class="flex flex-col items-end">
        <span class="font-bold text-xl">{{ flight.arrival.iata }}</span>
        <span class="text-sm text-neutral-500">{{ city.arrival }}</span>
      </div>
    </div>
    <hr />
    <i18n-n
      tag="span"
      :value="compensation"
      class="tabular-nums tracking-tighter"
      format="currency"
      
    />
    <i18n-n
      tag="span"
      :value="distance"
      class=""
      format="km"
    />
  </div>
</template>

<script setup lang="ts">
import type { Flight } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  flight: Flight;
  airports?: boolean;
}>();

const emit = defineEmits(["click"]);
const flightIata = computed(() => {
  return `${props.flight.airline.iata} ${props.flight.flight.number}`;
});
const logoError = ref(false);
const logo = computed(() => {
  let { airline } = props.flight || {};
  return getAirlineLogo(airline?.iata, 80);
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

const {compensation, distance} = useReimbursment()
</script>
