<template>
  <DropdownButton
    label="Welchen Grund hat die Airline angegeben?"
    name="actualArrivalTime"
    v-model="modelValue.disruption.reason"
    :options="reasonOptions"
    prefix-icon="clock"
  />
</template>

<script setup lang="ts">
import DropdownButton from "@/components/molecules/DropdownButton.vue";
import type { ClaimsForm } from "@/types";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();

const { noBoardingReasons, cancelledDelayedReasons } = useDisruption();

const reasonOptions = computed(() =>
  props.modelValue.disruption.type === "noBoarding"
    ? noBoardingReasons
    : cancelledDelayedReasons
);

watch(
  () => props.modelValue.disruption.reason,
  (value) => {
    if (props.modelValue.disruption.type === "noBoarding") {
      props.modelValue.disruption.selfInflicted = noBoardingReasons.find(
        (e) => e.value === value
      )?.selfInflicted;
    } else {
      delete props.modelValue.disruption.selfInflicted;
    }
    if (!reasonOptions.value.find((e) => e.value === value)) {
      props.modelValue.disruption.reason = null;
    }
  },
  { immediate: true }
);
</script>
