<template>
  <div>
    <!-- <h3 class="text-base font-medium mb-8 tracking-tight">
      Gib hier deine Flugdaten ein und sichere dir bis zu
      <strong>450€</strong> Entschädigung.
    </h3> -->
    <!-- {{ modelValue }} -->
    <!-- <FormKit type="date" name="type" v-model="modelValue.type" /> -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
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
      />
    </div>
    <FormKit
      type="submit"
      @click.prevent="start"
      label="Jetzt Entschädigung berechnen!"
      outer-class="!mb-0"
    />
    <CheckList
      class="mt-6"
      :items="['professionalExpertise', 'completeProcess', 'noRisk']"
    />
  </div>
</template>

<script setup lang="ts">
import { FormKit } from "@formkit/vue";
import AirportInput from "./AirportInput.vue";
import type { ClaimsForm } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps<{ modelValue: ClaimsForm }>();
const emit = defineEmits(["submit"]);
const start = () => {
  useRouter().push("/claims/new");
  useSteps().index.value = 0;
  emit("submit");
};
</script>
<style scoped>
.double {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.triple {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
