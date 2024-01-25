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
      {{ arrivalCity }}
      gelandet.</span
    >
    <span v-else
      >Laut unseren Informationen ist dein Flug
      <span class="font-bold">ohne große Verspätung</span> in
      {{ arrivalCity }}
      gelandet.</span
    >
  </Callout>
</template>
<script setup lang="ts">
import Callout from "@/components/molecules/Callout.vue";
import { ClaimsForm } from "~/types";

const props = defineProps<{
  status: ReturnType<typeof useFlightStatus>;
  modelValue: ClaimsForm;
}>();

const arrivalCity = ref();
const { locale } = useI18n();
onMounted(() => {
  if (!props.modelValue.flight?.arrival.iata) return
  getCities([props.modelValue.flight?.arrival.iata], locale.value).then(([departure, arrival]) => {
    arrivalCity.value = arrival;
  });
})

</script>
