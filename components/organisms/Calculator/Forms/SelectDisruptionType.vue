<template>
  <DropdownButton
    label="Flugstatus"
    name="disruptionType"
    v-model="modelValue.disruption.type"
    :options="disruptions"
    prefix-icon="exclamation-triangle"
  />
</template>

<script setup lang="ts">
import DropdownButton from "@/components/molecules/DropdownButton.vue";
import type { ClaimsForm } from "@/types";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const { disruptions } = useDisruption(props.modelValue.flight);
</script>
