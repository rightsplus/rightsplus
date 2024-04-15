<template>
  <div class="flex w-full">
    <Transition name="fade">
      <span
        v-if="pending"
        class="fixed bottom-0 right-0 bg-white p-2 shadow m-5 rounded leading-none"
        ><FontAwesomeIcon icon="circle-quarter" class="animate-revolve" />
      </span>
    </Transition>
    <div
      class="flex flex-col h-full w-[--width] min-w-64"
      :style="`--width: ${width}px`"
    >
      <div
        class="h-16 flex-shrink-0 flex items-center border-b border-gray-100 px-4 gap-x-4 min-w-0"
      >
        <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">
          <div class="flex items-stretch gap-1.5 min-w-0">
            <h1
              class="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white min-w-0"
            >
              <span class="truncate">{{ $t("claim", 2) }}</span>
            </h1>
            <Badge
              :content="claims?.filter((e) => e.unread).length.toString()"
              primary
            />
          </div>
          more
        </div>
      </div>
      <div class="flex-1 flex flex-col overflow-y-auto p-0 h-full">
        <DashboardListItem
          v-for="claim in claims"
          :title="formatClaimId(claim.id, true)"
          :content="[claim.client.firstName, claim.client.lastName].join(' ')"
          :date="claim.createdAt"
          :active="claim.id === activeClaimId"
          :unread="claim.unread"
          :badge="claim.status && $t(`status.${claim.status}`)"
          @click="
            activeClaimId = activeClaimId !== claim.id ? claim.id : undefined
          "
        >
        <template #prefix>
            <p class="flex items-center gap-2 mr-3">
              <AirlineLogo
                :airline="claim.booking.flight.airline"
              />
            </p>
          </template>
          <!-- <template #suffix>
            <ClaimStatus :status="claim.status" />
            </template> -->
        </DashboardListItem>
      </div>
    </div>
    <DashboardSeparator vertical @drag="width = $event.x - 249" />
    <div class="flex-1 flex flex-col overflow-y-auto p-0 w-full">
      <div class="flex-col items-stretch relative w-full flex-1">
        <div class="flex-1 p-5 w-full">
          <div v-if="activeClaim" class="w-full">
            <div class="flex justify-between w-full">
              <h1 class="text-2xl font-bold">
                {{ formatClaimId(activeClaim.id) }}
              </h1>
              <span class="flex gap-2 items-center"
                ><span class="text-xl font-bold">{{
                  activeClaim.booking.flight.airportDeparture
                }}</span
                ><FontAwesomeIcon
                  icon="plane"
                  class="text-gray-400 dark:text-gray-500"
                /><span class="text-xl font-bold">{{
                  activeClaim.booking.flight.airportArrival
                }}</span></span
              >
            </div>
            <hr class="my-5" />
            <div class="flex gap-3 flex-wrap">
              <Button
                secondary
                alert
                @click="updateData(activeClaimId, { status: 'done' })"
              >
                Fall ablehnen
              </Button>
              <Button
                success
                primary
                @click="updateData(activeClaimId, { status: 'done' })"
              >
                Fall annehmen
              </Button>

              <Button
                class="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xl"
                :prefix-icon="activeClaim?.unread ? 'envelope' : 'envelope-dot'"
                @click="
                  updateData(activeClaimId, { unread: !activeClaim?.unread })
                "
              />
            </div>
            <!-- <span
          class="bg-orange-100 text-orange-600 rounded-full px-3 py-2 font-medium"
          >status</span
        > -->
          </div>
          <FontAwesomeIcon
            v-else
            icon="folder-closed"
            class="text-7xl text-gray-400 dark:text-gray-500"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  key: "claims",
});

import type { Database, RowClaim, RowClaimExtended } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAdminState } from "~/composables/store";
import AirlineLogo from "~/components/cells/AirlineLogo.vue";
const width = ref(400);

const client = useSupabaseClient<Database>();
const { locale } = useI18n();
const state = useAdminState();

const {
  data: claims,
  refresh,
  pending,
} = useAsyncData("claims", async () => {
  const { data: claims, error } = await client
    .from("claim")
    .select(
      `*,
        booking ( flight ( *, airline ( * ) ) )
        `
    )
    // .or(`status.is.null,status.neq.done`)
    .order("createdAt", { ascending: false })
    .returns<RowClaimExtended[]>();

  console.log(claims);

  // const { data: bookings } = await client.from("bookings").select();
  // bookings?.forEach((booking) => {
  //   client
  //     .from("claims")
  //     .update({ bookingId: booking.id })
  //     .eq("bookingNumber", booking.bookingNumber)
  //     .then(console.log);
  // });
  // const res = await client
  //   .from("bookings")
  //   .insert(
  //     claims?.map((claim) => ({
  //       bookingNumber: claim.bookingNumber,
  //       flightId: claim.flightId,
  //       disruption: claim.disruption,

  //     }))
  //   )
  //   .select();
  // if (claims) state.claims = claims;
  return claims;
});

const updateData = (
  id?: RowClaimExtended["id"],
  data: Partial<RowClaimExtended>
) => {
  if (!id) return;
  client
    .from("claim")
    .update(data)
    .eq("id", id)
    .then(() => refresh());
};

const activeClaimId = ref<RowClaimExtended["id"]>();
watch(activeClaimId, (id) => updateData(id, { unread: false }));
const activeClaim = computed(() =>
  claims.value?.find((e) => e.id === activeClaimId.value)
);
const date = (d: string) => new Date(d).toLocaleDateString(locale.value);
const time = (d: string) =>
  new Date(d).toLocaleString(locale.value, {
    dateStyle: "short",
    timeStyle: "short",
  });
const logo = getAirlineLogo || (() => "");
const { send } = useSendMail();
const sendEmailToAirline = () => {
  if (!activeClaim.value) return;
  send({
    to: activeClaim.value?.booking.flight.airline.email,
    subject: `Claim ${activeClaim.value?.id}`,
    text: `Dear ${activeClaim.value?.booking.flight.airline.name},\n\nWe have a claim for you.\n\nBest regards,\n\nYour team`,
  });
};
</script>
