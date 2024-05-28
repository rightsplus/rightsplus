<template>
  <div v-if="claim">
    <div class="flex justify-between w-full">
      <h1 class="text-2xl font-bold">
        {{ formatClaimId(claim.id) }}
      </h1>
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
      >
    </div>
    <hr class="my-5" />
    <div class="flex gap-3 flex-col w-full">
      <div class="flex gap-3 flex-wrap w-full">
        <ClaimStatus
          :status="claim.status"
          class="self-start text-sm h-7 flex items-center"
        />
        <!-- <Button
                secondary
                alert
                @click="updateData(claimId, { status: 'done' })"
              >
                Fall ablehnen
              </Button>
              <Button
                success
                primary
                @click="updateData(claimId, { status: 'done' })"
              >
                Fall annehmen
              </Button> -->
        <Button
          tertiary
          round
          @click="invoke('back')"
          prefix-icon="arrow-left"
          class="h-7 w-7 !p-0 text-sm"
        />
        <Button
          tertiary
          round
          @click="invoke('reset')"
          prefix-icon="arrow-rotate-left"
          class="h-7 w-7 !p-0 text-sm"
        />
        <Button
          tertiary
          round
          class="h-7 w-7 !p-0 text-base"
          :prefix-icon="claim.unread ? 'envelope' : 'envelope-dot'"
          @click="
            $emit('update', { id: claim?.id, data: { unread: !claim?.unread } })
          "
        />
      </div>
      <div class="flex grow basis-0 gap-3 w-full">
        <Button
          v-for="action in state.events"
          :key="action"
          :primary="!action.includes('reject')"
          :tertiary="action.includes('reject')"
          :success="action.includes('accept')"
          :alert="action.includes('reject')"
          @click="
            () => {
              send(action);
            }
          "
        >
          {{ $t(`action.${action}`) }}
        </Button>
      </div>
    <ClaimClient
      :client="claim.client"
      @update:modelValue="$emit('update', { id: claim?.id, data: { client: $event } })"
      v-if="claim?.client"
    />
    </div>
    <!-- <pre>{{ claim }}</pre> -->
  </div>
  <div v-else class="relative inset-0 h-full flex items-center justify-center">
    <FontAwesomeIcon icon="folder-closed" class="text-7xl text-gray-300" />
  </div>
</template>

<script setup lang="ts">
import type { CaseStatus, Database, RowClaimExtended } from "~/types";
import claimProcessing from "~/machines/claimProcessing";

const props = defineProps<{ claim?: RowClaimExtended }>();
const emit = defineEmits(["update"]);
onMounted(() => console.log(props.claim));
const { state, send, invoke } = useMachine<CaseStatus, RowClaimExtended>(
  claimProcessing,
  {
    context: props.claim,
    initial: props.claim?.status,
  }
);

watch(
  () => state.value.value,
  (status) => emit("update", { id: props.claim?.id, data: { status } })
);
watch(
  () => props.claim?.id,
  (id) => emit("update", { id, data: { unread: false } })
);
</script>

<style scoped></style>
