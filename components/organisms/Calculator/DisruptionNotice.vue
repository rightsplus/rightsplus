<template>
  <Callout type="info" icon="info-circle">
    <span v-if="status?.cancelled.value"
      >Laut unseren Informationen wurde dein Flug
      <span class="font-bold">annulliert</span>.</span
    >
    <span v-else-if="(status?.delayed.value || 0) > 0"
      >Laut unseren Informationen ist dein Flug mit
      <span
        class="font-bold"
        v-html="getDuration(getDelay(modelValue.flight?.arrival))"
      />
      Verspätung in
      {{ getCityTranslation(useAirports(modelValue.flight?.arrival.iata)) }}
      gelandet.</span
    >
    <span v-else
      >Laut unseren Informationen ist dein Flug
      <span class="font-bold">ohne große Verspätung</span> in
      {{ getCityTranslation(useAirports(modelValue.flight?.arrival.iata)) }}
      gelandet.</span
    >
  </Callout>
</template>
<script setup lang="ts">
import Callout from "@/components/molecules/Callout.vue";
import { ClaimsForm } from "~/types";

defineProps<{
  status: ReturnType<typeof useFlightStatus>;
  modelValue: ClaimsForm;
}>();
</script>
