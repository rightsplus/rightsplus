<template>
  <div class="flex flex-col gap-5" v-if="$state">
    <h1 class="text-3xl font-bold">Flugdatum auswählen</h1>
    <!-- {{ modelValue.routes }} -->
    <div
      v-for="([key, route], i) in Object.entries(modelValue.routes)"
      :key="key"
    >
      <span class="flex items-center gap-3 font-bold"
        >{{ airports?.[i]
        }}<FontAwesomeIcon icon="plane" class="text-gray-400 text-sm" />
        {{ airports?.[i + 1] }}</span
      >
      <FormKit
        type="date"
        v-model="route.date"
        label="Abflugdatum"
        validation="required"
        validation-visibility="live"
      />
    </div>

    <NavigationButtons
      @previous="$emit('back')"
      @next="$emit('submit')"
      :nextDisabled="!modelValue.date.departure"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import Button from "@/components/molecules/Button.vue";
import ButtonBack from "@/components/molecules/ButtonBack.vue";
import ButtonFlight from "./ButtonFlight.vue";
import { ClaimsForm, Flight } from "@/types";
import NavigationButtons from "./NavigationButtons.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineComponent({
  components: {
    FormKit,
    Button,
    ButtonBack,
    ButtonFlight,
    NavigationButtons,
    FontAwesomeIcon,
  },
  props: {
    modelValue: {
      type: Object as () => ClaimsForm,
      required: true,
    },
  },
  computed: {
    airports() {
      if (!this.modelValue.airport?.departure?.iata) return [1];
      const airports = [this.modelValue.airport?.departure?.iata];
      if (this.modelValue.airport.layover) {
        console.log(this.modelValue.airport.layover);
        airports.push(
          ...this.modelValue.airport.layover.map((e) => e.iata).filter(Boolean)
        );
      }
      airports.push(this.modelValue.airport.arrival.iata);
      return airports;
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
