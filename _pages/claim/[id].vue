<template>
  <div class="pt-24">{{  $route.name }}</div>
  <section class="flex flex-col flex-grow w-full first:mt-0 last:mb-0" v-if="claim">
    <div class="flex flex-col space-y-12 w-full" v-if="claimId">
      <!-- <FormKit
        v-model="bookingNumber"
        label="Buchungsnummer"
        placeholder="Buchungsnummer"
      /> -->
    </div>
    <div
      class="flex flex-col space-y-12 w-full"
      v-if="claimId && bookingNumber"
    >
      <div class="flex flex-col">
        <!-- <CellsFlightCard
          :flight="claim.flights.data"
          disabled
        /> -->
      </div>
    </div>
    <div class="bg-white p-12 my-5 rounded-lg flex flex-col gap-5">
      <div class="flex gap-12 justify-between">
        <h2 class="flex flex-col">
          <span class="text-gray-500">Auftragsnummer</span
          ><span class="font-semibold text-xl">{{
            formatClaimId(claimId)
          }}</span>
        </h2>
        <div class="flex flex-col items-end">
          <span class="text-gray-500">Status</span
          ><span class="font-semibold text-sm bg-green-200 rounded text-green-700 px-2 py-1">in Bearbeitung</span>
        </div>
      </div>
      <hr />
      <div class="grid grid-cols-3 gap-5">
        <div class="flex flex-col gap-5">
          <div class="text-xl leading-tight">{{ $t("Reiseroute") }}</div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">{{ $t("Flug") }}</div>
            <div class="flex gap-[1ch]">
              <div>{{ claim.flights.data.departure.iata }}</div>
              nach
              <div>{{ claim.flights.data.arrival.iata }}</div>
            </div>
          </div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("Passagier") }}
            </div>
            <div v-for="passenger in claim.client.passengers">
              {{ [passenger.firstName, passenger.lastName].join(" ") }}
            </div>
          </div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("bookingNumber") }}
            </div>
            <div>
              {{ claim.booking_number }}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-5">
          <div class="text-lg leading-tight">{{ $t("Grund der Störung") }}</div>
          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("Art der Störung") }}
            </div>
            <div>
              {{ $t(claim.disruption.type) }}
            </div>
          </div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("Details") }}
            </div>
            <div>
              {{ $t(claim.disruption.details) }}
            </div>
          </div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("Grund der Störung") }}
            </div>
            <div>
              {{ $t(claim.disruption.reason) }}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-5">
          <div class="text-lg leading-tight">
            {{ $t("Persönliche Angaben") }}
          </div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("email") }}
            </div>
            <div>
              {{ claim.client.passengers[0].email }}
            </div>
          </div>
          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("iban") }}
            </div>
            <div class="flex gap-1 mt-1">
              <div class="bg-neutral-600 w-10 h-3.5 rounded-sm" />
              <div class="bg-neutral-600 w-10 h-3.5 rounded-sm" />
              <div class="bg-neutral-600 w-10 h-3.5 rounded-sm" />
              <div class="bg-neutral-600 w-10 h-3.5 rounded-sm" />
              <div class="bg-neutral-600 w-5 h-3.5 rounded-sm" />
            </div>
          </div>
          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("address") }}
            </div>
            <div class="flex flex-col">
              <span>{{ claim.client.passengers[0].address.street }}</span>
              <span
                >{{ claim.client.passengers[0].address.postalCode }}
                {{ claim.client.passengers[0].address.city }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <pre>{{ claim }}</pre> -->
  </section>
</template>
<script lang="ts" setup>
import { watchDebounced } from "@vueuse/core";

const user = useSupabaseUser();
const client = useSupabaseClient();
const route = useRoute();
const claim = ref();

const claimId = parseInt(route.params.id as string, 10);
definePageMeta({
  title: "Anspruch",
  description: "",
  layout: "claims",
});
const bookingNumber = ref(route.query.b as string);
const fetchClaim = (claimId: number, bookingNumber: string) => {
  return client
    .from("claims")
    .select(
      `
        *,
        users ( * ),
        flights ( * )
      `
    )
    .eq("id", claimId)
    .eq("booking_number", bookingNumber)
    .single();
};
watchDebounced(
  bookingNumber,
  (value) => {
    if (value) {
      navigateTo(`/claim/${formatClaimId(claimId, false)}?b=${value}`);
      fetchClaim(claimId, value).then((e) => (claim.value = e.data));
    }
  },
  { immediate: true, debounce: 500 }
);
</script>
