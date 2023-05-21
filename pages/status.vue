<template>
  <div class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
        <div class="flex flex-col gap-12">
          <h1 class="text-4xl sm:text-6xl font-extrabold">Der Status deiner Forderung</h1>
          <!-- {{ user.email }} -->
          <ClientOnly><FlightResult v-for="claim in claims" :key="claim.id" :flight="claim.data.flight" /></ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FlightResult from "~~/components/organisms/Calculator/FlightResult.vue";
import { Airport } from "~~/types";

const { search } = useAlgoliaSearch("AIRPORTS");

function findAirports (query: string) {
    search({ query, hitsPerPage: 10 }).then(({ hits }) => {
      hits.forEach((hit: Airport, i: number) => {
        const a = { ...hit };
        delete a._highlightResult;
        delete a.objectID;
        useAirports().value[hit.iata] = a;
      });
    });
}
const user = useSupabaseUser();

definePageMeta({
  middleware: ["auth"],
});
watchEffect(() => {
  if (!user.value) navigateTo("/login");
});

const client = useSupabaseClient();
const claims = ref(null);
useAsyncData("cases", async () => {
  const { data, error } = await client
    .from("cases")
    .select("*")
    .eq("email", user.value.email);
  if (error) throw error;
  console.log(data);
  return data;
}).then(({data}) => {
  claims.value = data.value;
  data.value?.forEach(({data}) => {
    findAirports(data.flight.departure.iata_code);
    findAirports(data.flight.arrival.iata_code);
    useAirports().value;
  })
});

// useAsyncData("user", async () => {
//   console.log('user')
// }).then((data) => {
//   console.log(data)
// });

// const claims = (await client.from("cases").select(`
// 			*,
// 			users (
// 				first_name,
// 				last_name
// 			)
//   `)).data
//   console.log()
</script>

<style scoped></style>
