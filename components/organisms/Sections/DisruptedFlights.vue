<template>
  <section
    class="grid gap-12 lg:grid-cols-2 max-w-7xl mx-auto p-5 py-12 sm:p-12 md:py-24 h-full relative z-1"
  >
    <div
      class="flex flex-col items-start gap-5 sm:gap-12 lg:sticky lg:top-12 self-start"
    >
      <FontAwesomeIcon
        icon="plane-slash"
        class="text-primary-500 text-3xl sm:text-5xl"
      />
      <div class="flex flex-col items-start gap-5">
        <h2 class="text-3xl sm:text-5xl font-bold">
          Aktuelle Verspätungen und Annullierungen
        </h2>
        <p class="text-xl sm:text-2xl text-gray-500 font-medium">
          Hattest du kürzlich eine Flugverspätung oder wurde dein Flug
          annulliert? Hier findest du eine Übersicht über aktuelle
          Flugverspätungen und Annullierungen.
        </p>
      </div>
      <div class="flex gap-3 flex-wrap">
        <Button tertiary to="delayed-and-cancelled-flights" v-if="!page"
          >Weitere Flüge</Button
        >
        <Button primary to="new-claim" @click="invoke('reset')">{{ $t("checkCompensationNow") }}</Button>
      </div>
    </div>
    <div class="flex flex-col gap-5">
      <div
        class="uppercase tracking-wider font-bold flex gap-2 items-center self-end"
      >
        <span>live</span>
        <div class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
          />
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
          />
        </div>
      </div>
      <FlightList
        :flights="flights"
        :limit="page ? 300 : 5"
        @select="handleSelect"
        :showFilter="page"
        :flightCard="{
          showDate: true,
          airports: true,
          compensation: false,
          actionButton: {
            label: $t('checkClaim'),
            suffixIcon: 'arrow-right',
            tertiary: true,
            class: 'h-9 text-sm ml-auto',
          },
        }"
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
import type {
  ClaimsForm,
  Database,
  RowFlight,
  Flight,
  ClaimState,
} from "~/types";
import FlightList from "@/components/organisms/Calculator/FlightList.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAirports } from "@/composables/flight";
const client = useSupabaseClient<Database>();
const claim = useClaim();
const router = useRouter();
const { locale } = useI18n();
const props = defineProps<{ page?: boolean }>();
const { data: flights } = await useAsyncData<Flight[]>(async () => {
  const { data, error } = await client
    .from("flight")
    .select("data")
    .not("data", "is", null)
    .or("delayArrival.gt.180,status.eq.cancelled")
    .returns<RowFlight[]>();
  return data?.map(({ data }) => data) || [];
});
import claimMachine from "~/machines/claimSubmission";
const { send, state, invoke, messages } = useMachine<ClaimState, ClaimsForm>(
  claimMachine,
  {
    context: claim,
  }
);
const { query, airports } = useAirports();
const localePath = useLocalePath();
const { assignLeg } = useFlightLeg(claim);
const handleSelect = async (flight: Flight) => {
  invoke("reset");
  // await query([flight.departure.iata, flight.arrival.iata]);
  claim.airport.trip.departure = airports.value[flight.departure.iata];
  claim.airport.trip.arrival = airports.value[flight.arrival.iata];
  assignLeg();
  claim.date = getISODate(flight.departure.scheduledTime);
  claim.flight = flight;
  send("next")
  router.push(localePath("new-claim"));
};
</script>
