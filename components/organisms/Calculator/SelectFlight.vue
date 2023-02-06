<template>
  <div class="flex flex-col gap-5">
    <ButtonBack @click.prevent="$emit('back')" />
    <h1 class="text-3xl font-bold">Flug auswählen</h1>
    <ButtonFlight
      v-for="flight in $state.flights"
      :key="flight.toString()"
      :flight="flight"
      @click="handleSelect(flight)"
      :selected="modelValue?.selectedFlight"
    />
    <FormKit
      type="button"
      @click="$emit('submit')"
      label="Weiter"
      class="mt-5"
      :disabled="!modelValue?.selectedFlight"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import Button from "@/components/molecules/Button.vue";
import ButtonBack from "@/components/molecules/ButtonBack.vue";
import ButtonFlight from "./ButtonFlight.vue";
import { Flight } from "@/types";

export default defineComponent({
  components: {
    FormKit,
    Button,
    ButtonBack,
    ButtonFlight,
  },
  props: {
    modelValue: {
      type: Object,
    },
  },
  methods: {
    handleSelect(flight: Flight) {
      this.modelValue.selectedFlight = flight;
    },
    submitHandler() {
      this.$emit("submit");
      return;
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
