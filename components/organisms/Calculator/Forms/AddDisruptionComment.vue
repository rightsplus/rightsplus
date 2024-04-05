<template>
  <FormKit
    type="textarea"
    label="Deine Erläuterung hilft uns deinen Fall zu bearbeiten"
    name="reason"
    v-model="modelValue.disruption.other"
    select-icon="angle-down"
    inner-class="max-w-full"
  />
</template>

<script setup lang="ts">
import type { ClaimsForm } from "@/types";
defineProps<{
  modelValue: ClaimsForm;
}>();
</script>
