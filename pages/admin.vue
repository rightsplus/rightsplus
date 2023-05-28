<template>
  <div class="min-h-screen pt-36 pb-8 bg-neutral-200">
    <div class="max-w-screen mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-12">
          <h1 class="text-xl sm:text-2xl font-extrabold">Hallo {{data?.user.first_name}}!</h1>
        </div>
        <CustomTable :data="tableData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomTable from "@/components/cells/CustomTable.vue";
import { UsersTable } from "~~/types";
import { FlightsTable } from "~~/types";

const currentUser = useSupabaseUser();
import { Database, CasesTable } from "~~/types";

const client = useSupabaseClient<Database>();
const { data } = await useAsyncData("admin", async () => {
  const user = (
    await client
      .from("users")
      .select("role, first_name")
      .eq("email", currentUser.value?.email)
      .single()
  ).data;

  const cases =
    user?.role === "admin"
      ? ((
          await client.from("cases").select(`
        *,
        users ( * ),
        flights ( * )
      `)
        ).data as (CasesTable & { users: UsersTable } & {
          flights: FlightsTable;
        })[])
      : [];
  // console.log(user, cases);
  return {
    user,
    cases,
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
  return data.value?.cases?.map((item) => {
    return {
      status: item.flights.status,
      delay: item.flights.delay_arrival,
      caseId: item.id,
      flight: {
        logo: logo(item.flights.airline_iata),
        airline: item.flights.airline,
        number: item.flight_number,
      },
      date_departure: time(item.flights.scheduled_time_departure),
      date_arrival: time(item.flights.scheduled_time_arrival),
      airport_departure: item.flights.airport_departure,
      airport_arrival: item.flights.airport_arrival,
      // reason: item.data.reason,
      client_name: item.users.first_name + " " + item.users.last_name,
      client_email: item.users?.email,
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
});
// watchEffect(() => {
//   if (!isAdmin.value) navigateTo("/login");
// });
</script>

<style scoped></style>
