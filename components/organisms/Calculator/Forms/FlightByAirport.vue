<template>
  <div>
    <h3 class="text-base font-medium mb-8 tracking-tight">
      Gib hier deine Flugdaten ein und sichere dir bis zu
      <strong>450€</strong> Entschädigung.
    </h3>
    <!-- {{ modelValue }} -->
    <!-- <FormKit type="date" name="type" v-model="modelValue.type" /> -->
    <div class="double gap-4">
      <AirportInput
        name="departure"
        label="Startflughafen"
        placeholder="z.B. Berlin oder BER"
        prefix-icon="plane-departure"
        v-model="modelValue.airport.departure"
      />
      <AirportInput
        name="arrival"
        label="Zielflughafen"
        placeholder="z.B. Tel Aviv oder TLV"
        prefix-icon="plane-arrival"
        v-model="modelValue.airport.arrival"
      />
    </div>

    <FormKit
      type="submit"
      @click.prevent="start"
      label="Jetzt Entschädigung berechnen!"
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
      this.$state.claims.step = 1;
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
