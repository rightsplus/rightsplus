<template>
  <pre v-if="!pendingFlights">
		<!-- {{flights}} -->
			<DashboardListFlight
				:flight="flight"
				v-for="flight in flights?.slice(0, 100)"
				:key="flight.iata"
			/>
		</pre>
</template>

<script setup lang="ts">
import type { RowClaimExtended } from "~/types";

const props = defineProps<{ claim: RowClaimExtended }>();

const { fetchFlights } = useSupabaseFunctions();

const { data: flights, pending: pendingFlights } = useAsyncData(
  "flights",
  async () => {
    console.log(props.claim.booking.flight.dateDeparture);
    const flights = await fetchFlights({
      type: "departure",
      departure: props.claim.booking.flight.airportDeparture,
      date: props.claim.booking.flight.dateDeparture,
      or: "delayArrival.gt.180,status.eq.cancelled",
    });

    return flights;
  }
);
</script>
