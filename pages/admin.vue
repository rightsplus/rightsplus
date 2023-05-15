<template>
  <div class="min-h-screen pt-36 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-12">
          <h1 class="text-xl sm:text-2xl font-extrabold">Admin Board</h1>
        </div>
        <CustomTable :data="tableData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomTable from "@/components/cells/CustomTable.vue";
const currentUser = useSupabaseUser();
import { Database } from "~~/types";
const client = useSupabaseClient<Database>();
const { data } = await useAsyncData("user", async () => {
  return {
    user: (
      await client
        .from("users")
        .select("role")
        .eq("email", currentUser.value?.email)
        .single()
    ).data,
    cases: (
      await client.from("cases").select("*, users(first_name, last_name)")
    ).data,
  };
});

const isAdmin = computed(() => data.value?.user?.role === "admin");
const date = (d: string) =>
  new Date(d).toLocaleDateString(useI18n().locale.value);
const tableData = computed(() => {
  return {
    header: {
      case_id: "Case ID",
      flight: "Flight",
      departure_date: "Departure Date",
      reason: "Reason",
      client_name: "Client Name",
      client_email: "Client Email",
      client_iban: "Client IBAN",
      airport_departure: "Airport Departure",
      airport_arrival: "Airport Arrival",
      updated_at: "Updated At",
    },
    body: data.value?.cases?.map((item) => {
      return {
        case_id: item.id,
        flight: item.data.flight?.flight?.iata,
        departure_date: date(item.data.flight?.departure?.scheduled),
        reason: item.data.reason,
        client_name:
          item.data.client?.firstName + " " + item.data.client?.lastName,
        client_email: item.data.client?.email,
        client_iban: item.data.client?.iban,
        airport_departure: item.data.flight?.departure?.airport,
        airport_arrival: item.data.flight?.arrival?.airport,
        updated_at: date(item.updated_at || item.created_at),
      };
    }),
  };
});

definePageMeta({
  middleware: ["auth"],
});
// watchEffect(() => {
//   if (!isAdmin.value) navigateTo("/login");
// });
</script>

<style scoped></style>
