<template>
  <section class="flex flex-col flex-grow w-full first:mt-0 last:mb-0">
    <div class="flex flex-col space-y-12 w-full">
      <div class="flex flex-col">
        <div class="flex flex-col">
          <p class="font-semibold">Aktuelle Forderungen</p>
        </div>
        <OrganismsCalculatorClaimsList :claims="claims" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ClaimsForm } from "@/types";
const user = useSupabaseUser();
const client = useSupabaseClient();
definePageMeta({
  title: "Profil",
  description: "",
  middleware: ["auth"],
  layout: "claims",
});
onMounted(() => {
  useAppState().headerColor = "dark";
});
onBeforeUnmount(() => {
  useAppState().headerColor = null;
});
const { query: queryAirports } = useAirports();
const claims = ref(
  null as
    | null
    | {
        id: string;
        data: ClaimsForm;
      }[]
);
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
