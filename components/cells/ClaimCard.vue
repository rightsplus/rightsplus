<template>
  <div
    class="rounded-lg py-3 px-5 @container border border-transparent bg-neutral-100 text-gray-800 grid gap-3"
  >
    <!-- Compensation -->
    <div
      class="flex flex-col justify-center text-center items-center gap-3 p-3"
    >
      <FontAwesomeIcon
        icon="money-bill-1-wave"
        class="text-green-500 shrink-0 text-xl"
      />
      <div class="flex flex-col gap-2">
        <span class="text-xs text-neutral-500 leading-none">{{
          $t(compensation ? "potentialCompensationFromAirline" : "noPotentialCompensationFromAirline")
        }}</span>
        <span class="font-bold sm:text-xl leading-none" v-if="compensation">{{
          $t("perPerson", {
            value: $n(compensation, "currency", { maximumFractionDigits: 0 }),
          })
        }}</span><span v-else class="font-medium">{{ message }}</span>
      </div>
    </div>

    <hr />
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <span class="font-bold text-xl">{{ flight.departure.iata }}</span>
        <span class="text-sm text-neutral-500">{{ city.departure }}</span>
      </div>
      <FontAwesomeIcon icon="plane" class="text-primary-500" />
      <div class="flex flex-col items-end">
        <span class="font-bold text-xl">{{ flight.arrival.iata }}</span>
        <span class="text-sm text-neutral-500">{{ city.arrival }}</span>
      </div>
    </div>
    <hr />

    <div class="grid @sm:grid-cols-2 gap-5">
      <div class="flex flex-col gap-5">
      <div class="flex flex-col gap-1">
        <span class="text-sm text-neutral-500">{{
          $t("scheduledArrivalTime")
        }}</span>
        <span class="font-bold flex items-center text-sm gap-3"
          ><span class="leading-0 flex items-center gap-2"
            ><FontAwesomeIcon icon="calendar" class="text-neutral-400" />{{
              date(flight.arrival.scheduledTime)
            }}</span
          ><span class="leading-0 flex items-center gap-2"
            ><FontAwesomeIcon icon="clock" class="text-neutral-400" />{{
              time(flight.arrival.scheduledTime)
            }}</span
          >
        </span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-sm text-neutral-500">{{
          $t("actualArrivalTime")
        }}</span>
        <div
          class="font-bold flex text-sm gap-3 flex-col"
          v-if="flight.arrival.actualTime || flight.arrival.estimatedTime"
        >
          <div class="flex items-center gap-3">
            <span class="leading-0 flex items-center gap-2"
              ><FontAwesomeIcon icon="calendar" class="text-neutral-400" />{{
                date(flight.arrival.actualTime || flight.arrival.estimatedTime)
              }}</span
            ><span class="leading-0 flex items-center gap-2"
              ><FontAwesomeIcon icon="clock" class="text-neutral-400" />{{
                time(flight.arrival.actualTime || flight.arrival.estimatedTime)
              }}</span
            >
          </div>
          <div class="flex items-center gap-3">
            <span class="leading-0 flex items-center gap-2 text-orange-500">{{
              $t("delayed.by", { value: getDuration(flight.arrival.delay) })
            }}</span>
          </div>
        </div>
        <div
          class="font-bold flex items-center text-sm gap-3 text-red-500"
          v-else
        >
          <span class="leading-0 flex items-center gap-2"
            ><FontAwesomeIcon icon="plane-slash" class="text-red-500" />{{
              $t("neverArrived")
            }}</span
          >
        </div>
      </div>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-sm text-neutral-500">{{ $t("flightDistance") }}</span>
        <span class="font-bold flex items-center text-sm gap-3"
          ><span class="leading-0 flex items-center gap-2"
            ><FontAwesomeIcon
              icon="arrow-right-long"
              class="text-neutral-400"
            />{{ $n(distance, "km") }}</span
          >
        </span>
      </div>
    </div>
    <hr />
    <div class="flex justify-between items-center gap-3">
      <div class="flex items-center gap-3">
        <AirlineLogo :flight="flight" />
        <div class="flex flex-col leading-none">
          <span class="text-xs text-neutral-500">{{ $t("airline") }}</span>
          <span class="font-bold text-sm leading-none">{{
            flight.airline.name
          }}</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex flex-col items-end leading-none text-end">
          <span class="text-xs text-neutral-500">{{ $t("flightNumber") }}</span>
          <span class="font-bold text-sm leading-none whitespace-nowrap"
            >{{ flight.airline.iata }} {{ flight.flight.number }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Flight } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirlineLogo from "./AirlineLogo.vue";

const props = defineProps<{
  flight: Flight;
  airports?: boolean;
}>();
const { locale } = useI18n();

const emit = defineEmits(["click"]);

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
const date = (time: string) => {
  return new Date(time).toLocaleDateString(locale.value);
};
const time = (time: string) => {
  return new Date(time).toLocaleTimeString(locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const { compensation, distance, message } = useCompensation();
</script>
