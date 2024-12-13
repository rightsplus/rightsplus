<script setup lang="ts">
import TabMenu from "primevue/tabmenu";
import "primevue/resources/themes/lara-light-green/theme.css";
import FlightCard from "@/components/cells/FlightCard.vue";

import type { CaseStatus, RowClaimExtended, RowFlight } from "~/types";
import claimProcessing from "~/machines/claimProcessing";
import { date } from "@formkit/i18n";

const props = defineProps<{ claim?: RowClaimExtended }>();

const emit = defineEmits(["update"]);
const { emails } = useStatusEmail();
const machine = useMachine<CaseStatus, RowClaimExtended>(claimProcessing, {
  context: props.claim,
  initial: props.claim?.status,
  methods: emails,
});
const { state, send, invoke, history } = machine;
const actions = computed(() =>
  state.value.events.sort((e) => (e.includes("accept") ? 1 : -1))
);

watch(
  () => props.claim?.id,
  (id) => emit("update", { id, data: { unread: false } }),
  { immediate: true }
);

const active = ref(0);
const items = ref([
  { label: "Flug", icon: "plane", component: FlightCard },
  { label: "Flughafen", icon: "tower-control" },
  { label: "Störung", icon: "ban" },
  { label: "Passagier", icon: "user" },
  { label: "Airline", icon: "plane-tail" },
  { label: "Notizen", icon: "note-sticky" },
  // { label: "Wetter", icon: "sun" },
]);

watch(state, ({ value }) => {
  emit("update", { id: props.claim?.id, data: { status: value } });
});
watch(
  () => props.claim?.id,
  (id) => emit("update", { id, data: { unread: false } })
);

const f = computed(() => props.claim?.booking?.flight.data || {});
</script>

<template>
  <div v-if="claim">
    <div class="flex flex-col w-full min-w-96">
      <div class="flex justify-between w-full">
        <h1 class="text-2xl font-bold flex items-center gap-2">
          {{ formatClaimId(claim.id) }}
          <Button
            v-if="!claim.unread"
            tertiary
            round
            title="Als ungelesen markieren"
            class="h-7 w-7 !p-0 text-base"
            :prefix-icon="claim.unread ? 'envelope' : 'envelope-dot'"
            @click="
              $emit('update', {
                id: claim?.id,
                data: { unread: !claim?.unread },
              })
            "
          />
        </h1>
        <span class="text-base font-medium text-neutral-500"
          >{{ getLocalizedDate(claim.createdAt) }},
          {{ getLocalizedTime(claim.createdAt) }}</span
        >
      </div>

      <div class="flex justify-between w-full items-center">
        <span class="text-base font-medium text-neutral-500 truncate">{{
          [claim.client.firstName, claim.client.lastName].join(" ")
        }}</span>

        <div class="flex gap-2 flex-wrap justify-end">
          <Button
            v-if="history.length"
            tertiary
            round
            title="Zurück"
            @click="invoke('back')"
            prefix-icon="arrow-left"
            class="h-7 w-7 !p-0 text-sm"
          />
          <Button
            v-if="state.value !== state.initial"
            tertiary
            round
            title="Zurücksetzen"
            @click="invoke('reset')"
            prefix-icon="arrow-rotate-left"
            class="h-7 w-7 !p-0 text-sm"
          />
          <ClaimStatus
            :status="claim.status"
            @change="invoke('setHistory', $event)"
            class="self-start text-sm h-7 flex items-center"
          />
        </div>
      </div>

      <div class="flex grow basis-0 gap-3 w-full mt-3">
        <ClaimActions :claim="claim" :machine="machine" />
      </div>
      <div class="flex gap-3 mr-auto">
      <Button
        tertiary
        round
        class="text-sm h-9 mt-5"
        v-for="item in emails[claim.status]"
        :key="item.label"
        @click="item.handler(claim)"
        >{{ item.label }}</Button
      >
    </div>
    </div>
    <hr class="my-5" />
    <div class="flex gap-3 flex-col -mx-5">
      <TabMenu
        :model="items"
        v-model:activeIndex="active"
        :pt="{
          menu: 'flex gap-1 px-5',
          menuitem: 'shrink-0',
          inkbar: 'shrink-0 block !w-4',
          action: ({ props, context }) => ({
            class: [
              'p-2 font-medium text-sm rounded gap-1 hover:bg-orange-100 hover:text-orange-700 duration-0 m-0',
              context?.index === props.activeIndex
                ? 'bg-orange-100 text-orange-700'
                : 'border-secondary-500',
            ],
          }),
        }"
        ><template #itemicon="{ item }">
          <FontAwesomeIcon
            :icon="item.icon"
            class="shrink-0 text-xs"
            fixed-width
          /> </template
      ></TabMenu>
      <div class="p-5">
        <pre v-if="active === 0">
        <span class="flex gap-2 items-center"
        ><span class="text-xl font-bold">{{
          claim.booking.flight.airportDeparture
        }}</span
        ><FontAwesomeIcon
          icon="plane"
          class="text-gray-400 dark:text-gray-500"
        /><span class="text-xl font-bold">{{
          claim.booking.flight.airportArrival
        }}</span></span
      >{{ claim.booking.flight.data }}</pre>
        <div v-else-if="active === 1">
          <ClaimManageAirport :claim="claim" />
        </div>
        <pre v-else-if="active === 2">{{ claim.booking.disruption }}</pre>
        <pre v-else-if="active === 3">{{ claim.client }}</pre>
        <pre v-else-if="active === 4">{{ claim.booking.flight.airline }}</pre>
        <div v-else-if="active === 5">
          <FormKit
            type="textarea"
            v-model="claim.notes"
            label="Notizen"
            prefix-icon="pen"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="relative inset-0 h-full flex items-center justify-center">
    <FontAwesomeIcon icon="folder-closed" class="text-7xl text-gray-300" />
  </div>
</template>
