<template>
  <div class="flex flex-col gap-5">
    <ButtonBack @click.prevent="$emit('back')" />
    <h1 class="text-3xl font-bold">Du hast Anspruch auf Entschädigung!</h1>
    <Button
      @click="$emit('submit')"
      class="mt-5"
      :disabled="!value"
      >Weiter</Button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/molecules/Button.vue";
import ButtonBack from "@/components/molecules/ButtonBack.vue";
import { Flight } from "@/types";

export default defineComponent({
  components: {
    Button,
    ButtonBack,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: null,
      options: [
        { value: "onTime", label: "Pünktlich" },
        { value: "delayed", label: "Verspätet" },
        { value: "cancelled", label: "Gestrichen / Umgebucht" },
        { value: "boardingDenied", label: "Boarding untersagt" },
        { value: "reRouted", label: "Umgeleitet" },
        { value: "returned", label: "Umgekehrt" },
      ],
    };
  },
  methods: {
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
