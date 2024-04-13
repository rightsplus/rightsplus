<template>
  <FormKit
    type="textarea"
    :label="modelValue.disruption.comment ? $t('disruption.comment') : $t('disruption.comment.label')"
    :placeholder="$t('disruption.comment.placeholder')"
    name="reason"
    v-model="modelValue.disruption.comment"
    inner-class="max-w-full"
  />
</template>

<script setup lang="ts">
import type { ClaimsForm } from "@/types";
defineProps<{
  modelValue: ClaimsForm;
}>();
</script>
