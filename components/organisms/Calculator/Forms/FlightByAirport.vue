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
        placeholder="z.B. Berlin oder BER"
        prefix-icon="plane-departure"
        v-model="modelValue.airport.trip.departure"
      />
      <AirportInput
        name="arrival"
        label="Ankunft"
        placeholder="z.B. Tel Aviv oder TLV"
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
  <div class="flex flex-wrap mt-6 gap-y-2 gap-x-4 leading-none text-sm text-neutral-500">
  <div class="flex items-center gap-2">
    <ClientOnly><FontAwesomeIcon icon="circle-check" class="text-green-500" /></ClientOnly>
    <span>Fachliche Expertise</span>
  </div>
  <div class="flex items-center gap-2">
    <ClientOnly><FontAwesomeIcon icon="circle-check" class="text-green-500" /></ClientOnly>
    <span>Gesamte Abwicklung</span>
  </div>
  <div class="flex items-center gap-2">
    <ClientOnly><FontAwesomeIcon icon="circle-check" class="text-green-500" /></ClientOnly>
    <span>Kein Risiko</span>
  </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { FormKit } from "@formkit/vue";
import AirportInput from "./AirportInput.vue";
import { ClaimsForm } from "~~/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps<{ modelValue: ClaimsForm }>()
const emit = defineEmits(["submit"]);
const start = () => {
  useRouter().push("/claims-calculator");
  props.modelValue.step = 0
  emit('submit')
}
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
