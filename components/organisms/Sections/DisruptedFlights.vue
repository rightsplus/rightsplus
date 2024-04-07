<template>
  <section
    class="grid gap-12 lg:grid-cols-2 max-w-7xl mx-auto p-5 py-12 sm:p-12 md:py-36 h-full relative z-1"
  >
    <div
      class="flex flex-col items-start gap-5 sm:gap-12 lg:sticky lg:top-12 self-start"
    >
      <FontAwesomeIcon
        icon="plane-slash"
        class="text-primary-500 text-3xl sm:text-5xl"
      />
      <div class="flex flex-col items-start gap-5">
        <span
          class="uppercase tracking-wider text-green-500 font-bold flex gap-2 items-center"
          ><span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
            ></span> </span
          >live</span
        >
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
        <Button secondary to="delayed-and-cancelled-flights" v-if="!page"
          >Weitere Flüge</Button
        >
        <Button primary to="claim-new">Jetzt Anspruch prüfen!</Button>
      </div>
    </div>
    <div class="flex flex-col gap-5">
      <FlightList :flights="flights" @select="handleSelect" />
    </div>
  </section>
</template>
<script lang="ts" setup>
import type { ClaimsForm, Database, Flight } from "~/types";
import FlightList from "@/components/organisms/Calculator/FlightList.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const client = useSupabaseClient<Database>();
const claim = useClaim();
const router = useRouter();
const { locale } = useI18n();
const flights = ref<Flight[]>([]);
const props = defineProps<{ page?: boolean }>();
onMounted(async () => {
  const { data } = await client
    .from("flights")
    .select("data")
    .not("data", "is", null)
    .or("delay_arrival.gt.180,status.eq.cancelled")
    .limit(20);

  flights.value = data?.map(({ data }) => data).slice(0, props.page ? 20 : 10);
  console.log(flights);
});
import claimMachine from "@/machines/claim";
const { send, state, invoke } = useMachine<ClaimsForm>(claimMachine, claim);
const { query, airports } = useAirports();
const localePath = useLocalePath();
const handleSelect = async (flight: Flight) => {
  invoke("reset");
  console.log("is in handleSelect", state.value);
  // await query([flight.departure.iata, flight.arrival.iata]);
  if (!state.value.matches("itinerary")) return;
  claim.airport.trip.departure = airports.value[flight.departure.iata];
  claim.airport.trip.arrival = airports.value[flight.arrival.iata];
  console.log("is in itinerary");
  send("next");
  if (!state.value.matches("stopover")) return;
  console.log("is in stopover");
  send("next");
  if (!state.value.matches("flightDate")) {
    console.log(state.value.value);
    return;
  }
  claim.date = getISODate(
    flight.departure.scheduledTime || flight.departure.scheduled
  );
  console.log("is in flightDate");
  send("next");
  if (!state.value.matches("flight")) return;
  claim.flight = flight;
  console.log("is in flight");
  send("next");
  router.push(localePath("claim-new"));
};
</script>
