<template>
  <section class="flex flex-col flex-grow w-full first:mt-0 last:mb-0">
    <div class="flex flex-col space-y-12 w-full" v-if="claimId">
      <FormKit
        v-model="bookingNumber"
        label="Buchungsnummer"
        placeholder="Buchungsnummer"
      />
    </div>
    <div
      class="flex flex-col space-y-12 w-full"
      v-if="claimId && bookingNumber && claim"
    >
      <div class="flex flex-col">
        <h2 class="font-semibold text-xl">
          Auftragsnummer: {{ formatClaimId(claimId) }}
        </h2>
        <pre>{{claim}}</pre>
        <CellsFlightCard :flight="{flight: claim.flights}" />
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core';

const user = useSupabaseUser();
const client = useSupabaseClient();
const route = useRoute();
const claim = ref()

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
}
watchDebounced(bookingNumber, (value) => {
  if (value) {
    navigateTo(`/claim/${formatClaimId(claimId, false)}?b=${value}`);
    fetchClaim(claimId, value).then(e => claim.value = e.data)
  }
}, { immediate: true, debounce: 500 });
</script>
