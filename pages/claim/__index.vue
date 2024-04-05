<template>
    <section class="flex flex-col flex-grow w-full first:mt-0 last:mb-0">
      <div class="flex flex-col space-y-12 w-full">
        <div class="flex flex-col">
          <h2 class="font-semibold text-xl">Aktuelle Forderungen</h2>
          <OrganismsCalculatorClaimsList :claims="claims" />
        </div>
      </div>
    </section>
</template>

<script setup lang="ts">
import type { ClaimsForm } from "@/types";
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter()
definePageMeta({
  title: "Deine Forderungen",
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
watch(user, (val) => {
  if (!val) router.push("/login");
});
const claims = ref(
  null as
    | null
    | {
        id: string;
        data: ClaimsForm;
      }[]
);
const { query: queryAirports } = useAirports();

useAsyncData("claims", async () => {
  if (!user.value?.email) return;
  console.log(client)
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
  console.log(data)
  if (!data.value) return;
  claims.value = data.value;
  data.value?.forEach(({ flights }) => {
    if (flights.data)
    queryAirports([flights.data.departure?.iata, flights.arrival?.iata]);
  });
}).catch(console.log)
</script>
