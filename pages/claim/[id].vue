<script lang="ts" setup>
import { watchDebounced } from "@vueuse/core";
import type { CaseStatus, Database, RowClaimExtended } from "@/types";

const user = useSupabaseUser();
const client = useSupabaseClient();
const route = useRoute();
const claim = ref();

const claimId = parseInt(route.params.id as string, 10);
definePageMeta({
  title: "Anspruch",
  description: "",
});

const bookingNumber = ref(route.query.b as string);
const fetchClaim = async (claimId: number, bookingNumber: string) => {
  const { data, error } = await client
    .from("booking")
    .select("*")
    .eq("number", bookingNumber)
    .single();
  // .eq("number", bookingNumber)
  // .single();
  // bookingId.then(async (e) => console.log(await e.text()));
  console.log("bookingId", data, error);
  if (!data) {
    throw new Error("Booking not found");
  }
  return client
    .from("claim")
    .select(
      `
        *,
        booking ( *, flight!booking_flightId_fkey ( * ) )
      `
    )
    .eq("id", claimId)
    .eq("bookingId", data.id)
    .single();
};
watchDebounced(
  bookingNumber,
  (value) => {
    if (value) {
      // navigateTo(`/claim/${formatClaimId(claimId, false)}?b=${value}`);
      fetchClaim(claimId, value).then((e) => {
        claim.value = e.data;
        console.log("claim", claim.value);
      });
    }
  },
  { immediate: true, debounce: 500 }
);
</script>
<template>
  <section
    class="flex flex-col flex-grow w-full first:mt-0 last:mb-0"
    v-if="claim"
  >
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
          <span class="text-gray-500">Status</span>
          <ClaimStatus :status="claim.status" class="-mx-0.5" />
        </div>
      </div>
      <hr />
      <div class="grid grid-cols-3 gap-5">
        <div class="flex flex-col gap-5">
          <div class="text-xl leading-tight">{{ $t("Reiseroute") }}</div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">{{ $t("Flug") }}</div>
            <div class="flex gap-[1ch]">
              <div>{{ claim.booking.flight.data.departure.iata }}</div>
              nach
              <div>{{ claim.booking.flight.data.arrival.iata }}</div>
            </div>
          </div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("Passagier") }}
            </div>
            {{ [claim.client.firstName, claim.client.lastName].join(" ") }}
          </div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("bookingNumber") }}
            </div>
            <div>
              {{ claim.booking.number }}
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
              {{ $t(claim.booking.disruption.type) }}
            </div>
          </div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("Details") }}
            </div>
            <div>
              {{ $t(claim.booking.disruption.details) }}
            </div>
          </div>

          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("Grund der Störung") }}
            </div>
            <div>
              {{ $t(`reasons.${claim.booking.disruption.reason}.label`) }}
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
              {{ claim.client.email }}
            </div>
          </div>
          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("iban") }}
            </div>
            <div class="flex gap-1 mt-1">
              <div class="bg-neutral-300 w-10 h-3.5 rounded-sm" />
              <div class="bg-neutral-300 w-10 h-3.5 rounded-sm" />
              <div class="bg-neutral-300 w-10 h-3.5 rounded-sm" />
              <div class="bg-neutral-300 w-10 h-3.5 rounded-sm" />
              <div class="bg-neutral-300 w-5 h-3.5 rounded-sm" />
            </div>
          </div>
          <div class="flex flex-col text-base">
            <div class="text-gray-500 leading-tight">
              {{ $t("address") }}
            </div>
            <div class="flex flex-col">
              <span>{{ claim.client.address.street }}</span>
              <span
                >{{ claim.client.address.postalCode }}
                {{ claim.client.address.city }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <pre>{{ claim }}</pre> -->
  </section>
</template>
