<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-3xl font-bold">Hattest du Anschlussflüge?</h1>

    <div class="grid grid-cols-2 gap-3">
      <ButtonLarge
        @click.prevent="submitHandler(false)"
        :selected="!modelValue.airport.layover?.length"
        name="no"
        label="Nein"
        icon="plane"
        :subLabel="`Ich bin direkt${
          modelValue.airport?.arrival?.city
            ? ' nach ' + modelValue.airport?.arrival?.city
            : ''
        } geflogen`"
      />
      <ButtonLarge
        @click.prevent="submitHandler(true)"
        :selected="modelValue.airport.layover?.length"
        name="yes"
        label="Ja, ich musste umsteigen"
        icon="plus"
        subLabel="Zwischenstopps hinzufügen"
      />
    </div>
    <div v-if="modelValue.airport?.layover?.length" class="relative">
      <div v-for="(layover, i) in modelValue.airport.layover">
        <AirportInput
          :label="`${i + 1}. Zwischenstopp hinzufügen`"
          placeholder="z.B. Frankfurt oder FRA"
          name="layover"
          prefix-icon="plane-arrival"
          v-model="modelValue.airport.layover[i]"
          :suffix-icon="i > 0 ? 'times' : undefined"
          @suffix-icon-click="modelValue.airport.layover.splice(i, 1)"
        />
      </div>
      <button
        v-if="modelValue.airport.layover?.filter((e) => e?.iata).length"
        class="text-sm font-medium text-blue-600 hover:underline underline-offset-2 text-left flex gap-2 items-center mt-5"
        @click="modelValue.airport.layover.push({})"
      >
        <span><FontAwesomeIcon icon="plus" /></span>
        <span class="leading-none">Weitere Zwischenstopps hinzufügen</span>
      </button>
    </div>
    <NavigationButtons @previous="$emit('back')" @next="$emit('submit')" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";

import ButtonBack from "@/components/molecules/ButtonBack.vue";
import Button from "@/components/molecules/Button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirportInput from "./Forms/AirportInput.vue";
import ButtonLarge from "./ButtonLarge.vue";
import NavigationButtons from "./NavigationButtons.vue";

export default defineComponent({
  components: {
    FormKit,
    Button,
    ButtonBack,
    FontAwesomeIcon,
    AirportInput,
    ButtonLarge,
    NavigationButtons
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  methods: {
    submitHandler(hasConnectingFlights: boolean) {
      if (hasConnectingFlights) {
        this.modelValue.airport.layover = [{}];
      } else {
        this.modelValue.airport.layover = false;
      }
      // this.$emit("submit");
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
