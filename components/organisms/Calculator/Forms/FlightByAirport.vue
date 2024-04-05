<template>
  <div class="grid gap-5">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <AirportInput
        name="departure"
        label="Abflug"
        prefix-icon="plane-departure"
        v-model="modelValue.airport.trip.departure"
      />
      <AirportInput
        name="arrival"
        label="Ankunft"
        prefix-icon="plane-arrival"
        v-model="modelValue.airport.trip.arrival"
        @keydown.enter="start"
      />
    </div>
    <FormKit
      type="submit"
      @click.prevent="start"
      label="Jetzt Entschädigung berechnen!"
      outer-class="!mb-0"
    />
    <CheckList
      :items="['professionalExpertise', 'completeProcess', 'noRisk']"
    />
  </div>
</template>

<script setup lang="ts">
import claimMachine from "~/machines/claim";
import AirportInput from "./AirportInput.vue";
import type { ClaimsForm } from "@/types";
defineProps<{ modelValue: ClaimsForm }>();
const emit = defineEmits(["submit"]);
const { push } = useRouter();
const claimState = useClaim()
const { invoke } = useMachine<ClaimsForm>(claimMachine, claimState)
const start = () => {
  push("/claim/new");
  invoke('go', 'itinerary')
  emit("submit");
};
</script>
