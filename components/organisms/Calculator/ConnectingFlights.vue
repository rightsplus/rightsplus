<template>
  <div class="flex flex-col gap-5">
    <ButtonBack @click.prevent="$emit('back')" />
    <h1 class="text-3xl font-bold">Hattest du Anschlussflüge?</h1>

    <div class="grid grid-cols-2 gap-3">
      <button
        @click.prevent="submitHandler(true)"
        class="text-left flex gap-5 items-center bg-neutral-100 hover:bg-neutral-200 border border-1 border-neutral-200 text-gray-600 rounded-lg p-3 px-5"
      >
        <FontAwesomeIcon icon="plus" class="text-xl" />
        <div class="flex flex-col items-start gap-1">
          <span class="text-lg font-bold leading-none"
            >Ja, ich musste umsteigen</span
          >
          <span class="text-sm leading-none">Zwischenstopps hinzufügen</span>
        </div>
      </button>
      <button
        @click.prevent="submitHandler(false)"
        class="text-left flex gap-5 items-center bg-primary-500 hover:bg-primary-600 text-white rounded-lg p-3 px-5"
      >
        <FontAwesomeIcon icon="plane" class="text-base" />
        <div class="flex flex-col items-start gap-1">
          <span class="text-lg font-bold leading-none">Nein</span>
          <span class="text-sm leading-none font-medium"
            >Ich bin direkt nach
            {{ modelValue.airport?.arrival?.city }} geflogen</span
          >
        </div>
      </button>
    </div>
    <div v-if="modelValue.airport?.layover !== false">
      <div v-for="(layover, i) in modelValue.airport.layover">
        <AirportInput
          :label="`${i + 1}. Zwischenstopp hinzufügen`"
          placeholder="z.B. Frankfurt oder FRA"
          name="layover"
          prefix-icon="plane"
          v-model="modelValue.airport.layover[i]"
          :suffix-icon="i > 0 ? 'times' : undefined"
          @suffix-icon-click="modelValue.airport.layover.splice(i, 1)"
        />
      </div>
      <button class="text-sm font-medium text-blue-600 hover:underline underline-offset-2 text-left flex gap-2 items-center mt-5" @click="modelValue.airport.layover.push({})">
        <FontAwesomeIcon icon="plus" />
          <span class="leading-none"
            >Weitere Zwischenstopps hinzufügen</span
          >
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";

import ButtonBack from "@/components/molecules/ButtonBack.vue";
import Button from "@/components/molecules/Button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirportInput from "./Forms/AirportInput.vue";

export default defineComponent({
  components: {
    FormKit,
    Button,
    ButtonBack,
    FontAwesomeIcon,
    AirportInput,
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
