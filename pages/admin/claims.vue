<template>
  <div>
    <CustomTable :data="claims || []" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  key: "claims",
});

import type {
  AirlinesRow,
  ClaimsRow,
  ClaimsRowExtended,
  Database,
  FlightsRow,
} from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAdminState } from "~/composables/store";
import AirlineLogo from "~/components/cells/AirlineLogo.vue";
import CustomTable from "~/components/cells/CustomTable.vue";
const currentUser = useSupabaseUser();
const activeClaim = ref();
const client = useSupabaseClient<Database>();
const { locale } = useI18n();
const state = useAdminState();
const { data: claims } = useAsyncData("claims", async () => {
  const { data: claims, error } = await client
    .from("claims")
    .select(
      `*,
        flights ( *, airlines ( * ) )
        `
    )
    .returns<
      (ClaimsRow & {
        flights: FlightsRow & {
          airlines: AirlinesRow;
        };
      })[]
    >();

  return claims?.map(
    (e) =>
      ({
        ...e,
        flight: {
          ...e.flights,
          airline: e.flights.airlines,
        },
      } as ClaimsRowExtended)
  );
});

const date = (d: string) => new Date(d).toLocaleDateString(locale.value);
const time = (d: string) =>
  new Date(d).toLocaleString(locale.value, {
    dateStyle: "short",
    timeStyle: "short",
  });
const logo = getAirlineLogo || (() => "");
const { send } = useSendMail();
const sendEmailToAirline = () => {
  send({
    to: activeClaim.value.flights.airlines.email,
    subject: `Claim ${activeClaim.value?.id}`,
    text: `Dear ${activeClaim.value.flights.airlines.name},\n\nWe have a claim for you.\n\nBest regards,\n\nYour team`,
  });
};
</script>
