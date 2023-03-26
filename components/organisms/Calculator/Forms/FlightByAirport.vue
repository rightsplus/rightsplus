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
        v-model="modelValue.airport.departure"
      />
      <AirportInput
        name="arrival"
        label="Ankunft"
        placeholder="z.B. Tel Aviv oder TLV"
        prefix-icon="plane-arrival"
        v-model="modelValue.airport.arrival"
      />
    </div>

    <FormKit
      type="submit"
      @click.prevent="start"
      label="Jetzt Entschädigung berechnen!"
      outer-class="!mb-0"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import ListAirport from "./ListAirport.vue";
import AirportInput from "./AirportInput.vue";

export default defineComponent({
  components: {
    FormKit,
    ListAirport,
    AirportInput,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      submitted: false,
      limit: 10,
      value: null,
      form: {
        departure: "",
        arrival: "",
      },
      focused: {
        departure: false,
        arrival: false,
      },
    };
  },
  methods: {
    start() {
      this.$router.push("/claims-calculator");
      this.$emit('submit')
      // this.$state.claims.step = 1;
    },
  },
});
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
