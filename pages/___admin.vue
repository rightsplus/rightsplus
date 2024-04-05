<template>
  <CustomTable :data="tableData" />
</template>

<script setup lang="ts">
import CustomTable from "@/components/cells/CustomTable.vue";
import type { UsersTable, FlightsTable, Database, ClaimsTable } from "@/types";

const currentUser = useSupabaseUser();

const client = useSupabaseClient<Database>();
const { data } = await useAsyncData("admin", async () => {
  if (!currentUser.value?.email) return;

  const { data: user } = await client
    .from("users")
    .select("role, first_name")
    .eq("email", currentUser.value?.email)
    .single();

  if (user?.role !== "admin") {
    return {
      user,
      claims: [],
    };
  }
  const { data: claims, error } = await client.from("claims").select(`
        *,
        users ( * ),
        flights ( * )
      `);
  return {
    user,
    claims,
  };
});

const date = (d: string) =>
  new Date(d).toLocaleDateString(useI18n().locale.value);
const time = (d: string) =>
  new Date(d).toLocaleString(useI18n().locale.value, {
    dateStyle: "short",
    timeStyle: "short",
  });
const logo = getAirlineLogo || (() => "");
const tableData = computed(() => {
  console.log(data.value);
  return data.value?.claims?.map((item) => {
    return {
      status: item.flights?.status,
      booking_number: item?.booking_number,
      delay: item.flights?.delay_arrival,
      caseId: item.id,
      flight: {
        logo: logo(item.flights?.airline_iata),
        airline: item.flights?.airline,
        number: item.flight_number,
      },
      date_departure: time(item.flights?.scheduled_time_departure),
      date_arrival: time(item.flights?.scheduled_time_arrival),
      airport_departure: item.flights?.airport_departure,
      airport_arrival: item.flights?.airport_arrival,
      // reason: item.data.reason,
      client_name: item.users?.first_name + " " + item.users?.last_name,
      client_email: item.client.passengers?.[0]?.email,
      // // client_iban: item.data.client?.iban,
      // airport_departure: item.data?.airport?.departure?.name,
      // airport_arrival: item.data?.airport?.arrival?.name,
      updated_at: item.updated_at,
      created_at: item.created_at,
      item: item,
    };
  });
});

definePageMeta({
  middleware: ["auth"],
  layout: "admin"
});
// watchEffect(() => {
//   if (!isAdmin.value) navigateTo("/login");
// });
</script>

<style scoped></style>
