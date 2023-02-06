<template>
  <div class="flex flex-col gap-5">
    <ButtonBack @click.prevent="$emit('back')" />
    <h1 class="text-3xl font-bold">Hattest du Anschlussflüge?</h1>

    <div class="grid grid-cols-1 gap-3">
      <button
        @click.prevent="submitHandler(true)"
        class="text-left flex gap-5 items-center bg-neutral-100 hover:bg-neutral-200 text-gray-600 rounded-lg p-3 px-5"
      >
        <FontAwesomeIcon icon="plus" class="text-xl" />
        <div class="flex flex-col items-start gap-1">
          <span class="text-lg font-bold leading-none">Anschlussflüge</span>
          <span class="text-sm leading-none">Weitere Flüge hinzufügen</span>
        </div>
      </button>
      <button
        @click.prevent="submitHandler(false)"
        class="text-left flex gap-5 items-center bg-primary-500 hover:bg-primary-600 text-white rounded-lg p-3 px-5"
      >
        <FontAwesomeIcon icon="plane" class="text-base" />
        <div class="flex flex-col items-start gap-1">
          <span class="text-lg font-bold leading-none">Direktflug</span>
          <span class="text-sm leading-none"
            >Du bist direkt nach {{ modelValue.arrival }} geflogen.</span
          >
        </div>
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

export default defineComponent({
  components: {
    FormKit,
    Button,
    ButtonBack,
    FontAwesomeIcon,
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
      } else {
        this.modelValue.connectingFlights = false;
      }
      this.$emit("submit");
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
