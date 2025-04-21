<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  key: "claims",
});

import type { CaseStatus, Database, RowClaimExtended } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirlineLogo from "~/components/cells/AirlineLogo.vue";
import { replaceUrl } from "~/composables/useLocaleContent";

const adminStore = useAdminState();
// watch(state.value, ({ value }) =>
//   updateData(activeClaimId.value, { status: value as CaseStatus })
// );

const container = ref();
const width = ref(400);
const offset = ref(0);
onMounted(() => {
  const { left } = container.value?.getBoundingClientRect() || {};
  offset.value = left;
});

const client = useSupabaseClient<Database>();
const { locale } = useI18n();
const { query: queryAirlines, airlines } = useAirlines();

function base10ToBase36(num: number): string {
  return num.toString(36);
}

const { data: claims, status } = useAsyncData(async () => {
  const { data, error } = await client
    .from("claim")
    .select(getExtendedClaimQuery())
    // .or(`status.is.null,status.neq.done`)
    .order("createdAt", { ascending: false })
    .overrideTypes<RowClaimExtended[]>();

  if (data) {
    queryAirlines(
      airlinesByFlights(data.map((e) => e.booking.flight.data)).map(
        (e) => e.airline.iata
      )
    );

    adminStore.claims = data;
  }
  return data;
});
watch(
  status,
  () => {
    // console.log(status.value, claims.value);
  },
  { immediate: true }
);
const claimQuery = getExtendedClaimQuery();
const updateData = (props: {
  id?: RowClaimExtended["id"];
  data?: Partial<RowClaimExtended>;
}) => {
  const { id, data } = props;
  if (!id || !data) return;
  client
    .from("claim")
    .update(data)
    .eq("id", id)
    .select(claimQuery)
    .single<RowClaimExtended>()
    .then(({ data: claim }) => {
      Object.assign(claims.value?.find((e) => e.id === claim?.id) || {}, claim);
    });
};
const route = useRoute();
const { id } = route.query;

const activeClaimId = ref<RowClaimExtended["id"] | undefined>(
  id ? parseInt(id as string) : undefined
);
const activeClaim = ref<RowClaimExtended>();
watch(activeClaimId, () => {
  const newUrl = new URL(window.location.href);
  if (activeClaimId.value) {
    newUrl.searchParams.set("id", activeClaimId.value.toString());
    replaceUrl(newUrl.toString());
  } else {
    newUrl.searchParams.delete("id");
    replaceUrl(newUrl.toString());
  }
});
watchEffect(() => {
  const nextClaim = claims.value?.find((e) => e.id === activeClaimId.value);
  activeClaim.value = nextClaim;
  console.log(nextClaim);
});
const localeRoute = useLocaleRoute();
// watch(activeClaimId, () => {
//   console.log(localeRoute("admin-claim"));
//   replaceUrl(localeRoute("admin-claim", { id: activeClaimId.value }));
// });
const date = (d: string) => new Date(d).toLocaleDateString(locale.value);
const time = (d: string) =>
  new Date(d).toLocaleString(locale.value, {
    dateStyle: "short",
    timeStyle: "short",
  });
const logo = getAirlineLogo || (() => "");
const { send: sendMail } = useSendMail();
const sendEmailToAirline = () => {
  if (!activeClaim.value) return;
  sendMail({
    to: activeClaim.value?.booking?.flight.airline.email,
    subject: `Claim ${activeClaim.value?.id}`,
    text: `Dear ${activeClaim.value?.booking?.flight.airline.name},\n\nWe have a claim for you.\n\nBest regards,\n\nYour team`,
  });
};
const operatingAirline = (claim: RowClaimExtended) => {
  const { codeshared, airline } = claim.booking?.flight.data || {};
  const { iata } = codeshared?.airline || airline;
  return airlines.value[iata] || {};
};
</script>
<template>
  <div>
    <NuxtLayout name="dashboard">
      <div class="flex w-full min-h-0" ref="container">
        <Transition name="fade">
          <span
            v-if="status === 'pending'"
            class="fixed bottom-0 right-0 bg-white p-2 shadow m-5 rounded leading-none"
            ><FontAwesomeIcon icon="circle-quarter" class="animate-revolve" />
          </span>
        </Transition>

        <div
          class="flex flex-col w-[--width] min-w-64"
          :style="`--width: ${width}px`"
        >
          <div class="flex-1 flex flex-col overflow-y-auto p-2">
            <!-- @click.self="activeClaimId = undefined" -->
            <DashboardListItem
              v-for="claim in claims"
              :title="formatClaimId(claim.id, true)"
              :content="
                [claim.client.firstName, claim.client.lastName].join(' ')
              "
              :date="claim.createdAt"
              :active="claim.id === activeClaimId"
              :unread="claim.unread"
              :id="claim.id"
              @click="activeClaimId = claim.id"
            >
              <div class="flex items-center gap-2 justify-between">
                <div class="flex items-center gap-2 text-neutral-400">
                  <AirlineLogo size="sm" :airline="operatingAirline(claim)" />
                  <span>{{ operatingAirline(claim).name }}</span>
                </div>
                <ClaimStatus :status="claim.status" />
              </div>
            </DashboardListItem>
          </div>
        </div>
        <DashboardSeparator vertical @drag="width = $event - offset" />
        <div class="flex-1 flex flex-col overflow-y-auto p-0 w-full">
          <div class="flex-col items-stretch relative w-full flex-1">
            <div class="w-full h-full">
              <ClaimManagement
                :claim="activeClaim"
                @update="updateData"
                :key="activeClaim?.id"
              />
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
