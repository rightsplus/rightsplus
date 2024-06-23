<template>
  <div v-if="!pendingFlights" class="flex flex-col">
    {{ flights?.[0]?.departure.iata }}
    delayed > 10
    {{ (flights?.filter((e) => e.arrival.delay > 10)?.length / flights?.length) * 100}}
    // {{ flights?.length }}
    <div
      v-for="flight in flights?.filter((e) => e.arrival.delay > 10)?.slice(0, 100)"
      :key="flight?.iata"
      class="grid grid-cols-5 items-center gap-2 text-sm font-bold odd:bg-neutral-100 p-1 rounded"
    >
      <span class="flex items-center gap-2">
        <AirlineLogo :airline="flight.airline" />{{ flight.flight.iata }}</span
      >
      <span>{{ flight.arrival.iata }}</span>
      <span>{{ time(flight.departure.scheduledTime) }}</span>
      <span>{{ time(flight.arrival.actualTime) }}</span>
      <span>{{ flight.arrival.delay }}</span>
      <span>{{ flight.status }}</span>
      <!-- <pre>{{ flight }}</pre> -->
    </div>
  </div>
  <!-- <DashboardListFlight :flight="flight" :key="flight.iata" /> -->
</template>

<script setup lang="ts">
import AirlineLogo from "~/components/cells/AirlineLogo.vue";
import type { RowClaimExtended, RowFlight } from "~/types";

const props = defineProps<{ claim: RowClaimExtended }>();

const { fetchFlights } = useSupabaseFunctions();
const { locale } = useI18n();
const { data: flights, pending: pendingFlights } = useAsyncData(
  "flights",
  async () => {
    const flights = await fetchFlights<Flight[]>({
      type: "departure",
      departure: props.claim.booking.flight.airportDeparture,
      date: props.claim.booking.flight.dateDeparture,
      or: "delayArrival.gt.180,status.eq.cancelled",
    });

    return flights;
  }
);
const time = (time: string) => {
  return new Date(time).toLocaleTimeString(locale.value, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};
const date = (time: string) => {
  return new Date(time).toLocaleDateString(locale.value, {
    timeZone: "UTC",
  });
};
</script>
