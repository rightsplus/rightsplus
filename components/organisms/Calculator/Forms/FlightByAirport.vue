<template>
  <div class="grid gap-3">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <AirportInput
        name="departure"
        :label="$t('departureAirport')"
        prefix-icon="plane-departure"
        v-model="modelValue.airport.trip.departure"
      />
      <AirportInput
        name="arrival"
        :label="$t('arrivalAirport')"
        prefix-icon="plane-arrival"
        v-model="modelValue.airport.trip.arrival"
        @keydown.enter="start"
      />
    </div>
    <Button @click.prevent="start" primary>{{ $t('checkCompensationNow')}}</Button>
    <!-- <CheckList
      class="mt-2"
      :items="['professionalExpertise', 'completeProcess', 'noRisk']"
    /> -->
  </div>
</template>

<script setup lang="ts">
import claimMachine from "~/machines/claimSubmission";
import AirportInput from "./AirportInput.vue";
import type { ClaimsForm } from "@/types";
import Button from "@/components/core/Button.vue";
defineProps<{ modelValue: ClaimsForm }>();
const { push } = useRouter();
const claimState = useClaim();
const { invoke, send } = useMachine<ClaimsForm>(claimMachine, claimState);
const localePath = useLocalePath()
const start = () => {
  invoke("reset");
  push(localePath("claim-new"));
};
</script>
