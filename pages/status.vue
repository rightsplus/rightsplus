<template>
  <div class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
        <div class="flex flex-col gap-12">
          <h1 class="text-4xl sm:text-6xl font-extrabold">
            Der Status deiner Forderung
          </h1>
          <!-- {{ user.email }} -->
          <!-- <pre v-for="claim in claims" :key="claim.id">{{ claim.flights }}</pre> -->
          <ClientOnly
            ><FlightResult
              v-for="claim in claims"
              :key="claim.id"
              :flight="claim.flights.data || undefined"
          /></ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FlightResult from "~~/components/organisms/Calculator/FlightResult.vue";
import { ClaimsForm, Database } from "~~/types";

definePageMeta({
  middleware: ["auth"],
});
const user = useSupabaseUser();

definePageMeta({
  middleware: ["auth"],
});
const client = useSupabaseClient<Database>();
const claims = ref(
  null as
    | null
    | {
        id: string;
        data: ClaimsForm;
      }[]
);
useAsyncData("cases", async () => {
  if (!user.value?.email) return
  const { data, error } = await client
    .from("cases")
    .select(
      `
        *,
        users ( * ),
        flights ( * )
      `
    )
    .eq("email", user.value.email);
  if (error) throw error;
  return data;
}).then(({ data }) => {
  if (!data.value) return
  claims.value = data.value;
  data.value?.forEach(({ flights }) => {
    if (flights.data)
      useAirports([flights.data.departure?.iata, flights.arrival?.iata]);
  });
});
</script>

<style scoped></style>
