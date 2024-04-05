<template>
  <DropdownButton
    label="Welchen Grund hat die Airline angegeben?"
    name="actualArrivalTime"
    v-model="modelValue.disruption.reason"
    :options="
      modelValue.disruption.type === 'noBoarding'
        ? noBoardingReasons
        : cancelledDelayedReasons
    "
    prefix-icon="clock"
  />
</template>

<script setup lang="ts">
import SectionSubHeader from "@/components/organisms/Calculator/SectionSubHeader.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import DropdownButton from "@/components/molecules/DropdownButton.vue";
import type { ClaimsForm } from "@/types";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();

const { noBoardingReasons, cancelledDelayedReasons } = useDisruption(
  props.modelValue.flight
);

watch(
  () => props.modelValue.disruption.reason,
  () => {
    if (props.modelValue.disruption.type === "noBoarding") {
      console.log(
        noBoardingReasons.find(
          (e) => e.value === props.modelValue.disruption.reason
        )
      );
      props.modelValue.disruption.selfInflicted = noBoardingReasons.find(
        (e) => e.value === props.modelValue.disruption.reason
      )?.selfInflicted;
    } else {
      delete props.modelValue.disruption.selfInflicted;
    }
  },
  { immediate: true }
);
</script>
