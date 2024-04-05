<template>
  <div class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
        <div class="flex flex-col gap-12">
          <h1 class="text-3xl sm:text-4xl font-extrabold">
            Der Status deiner Forderung
          </h1>
          <!-- {{ user.email }} -->
          <!-- <pre v-for="claim in claims" :key="claim.id">{{ claim.flights }}</pre> -->

          <AccordionItem
            v-for="claim in claims"
            :index="claim.uuid"
            :modelValue="active"
            @update:modelValue="active = $event"
            headless
            :tag="{ outer: 'div', inner: 'div' }"
            :classes="{ title: 'pb-0 mb-0', content: 'mx-1' }"
            collapsible
          >
            <template #title>
              <CellsFlightCard
                :key="claim.uuid"
                :flight="claim.flights.data || undefined"
                class="w-full"
                :class="{
                  'rounded-b-none': active?.includes(claim.uuid),
                }"
              />
            </template>
            <template #content>
              <ol class="p-5 bg-white rounded-b-xl">
                <li>Scheduled Arrival Time</li>
                <li>Actual Arrival Time</li>
                <li>Flight Distance</li>
              </ol>
            </template>
          </AccordionItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AccordionItem from "~/components/organisms/Accordion/AccordionItem.vue";
import FlightResult from "~~/components/organisms/Calculator/FlightResult.vue";
import type { ClaimsForm, Database } from "@/types";
definePageMeta({
  middleware: ["auth"],
});
const user = useSupabaseUser();
const active = ref<string[]>([]);

const client = useSupabaseClient<Database>();
const claims = ref<
  {
    id: string;
    data: ClaimsForm;
  }[]
>([]);
const { query: queryAirports } = useAirports();
useAsyncData("claims", async () => {
  if (!user.value?.email) return;
  const { data, error } = await client
    .from("claims")
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
  if (!data.value) return;
  claims.value = data.value;
  data.value?.forEach(({ flights }) => {
    if (flights.data)
    queryAirports([flights.data.departure?.iata, flights.arrival?.iata]);
  });
});
</script>

<style scoped></style>
