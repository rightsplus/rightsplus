<template>
  <div
    class="flex flex-col gap-3 mt-5"
    v-if="
      modelValue.disruption.type === 'cancelled' ||
        modelValue.disruption.type === 'delayed'
    "
  >
    <SectionSubHeader
      :label="
        modelValue.disruption.type === 'cancelled'
          ? `Wann wurdest du darüber informiert?`
          : `Wie groß war die Verspätung bei deiner Ankunft?`
      "
    />
    <div class="grid sm:grid-cols-3 gap-3">
      <ButtonLarge
        v-for="c in modelValue.disruption.type === 'cancelled'
          ? cancelledDetails
          : delayedDetails"
        :key="c.value"
        @click.prevent="modelValue.disruption.details = c.value"
        :selected="modelValue.disruption.details === c.value"
        :name="c.value"
        :label="c.label"
        :preLabel="c.preLabel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionSubHeader from "@/components/organisms/Calculator/SectionSubHeader.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import type { ClaimsForm } from "@/types";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();

const { delayedDetails, cancelledDetails } = useDisruption(
  props.modelValue.flight
);
</script>
