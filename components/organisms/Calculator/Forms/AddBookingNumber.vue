<template>
  <FormKit
    :label="$t('bookingNumber')"
    v-model="modelValue.client.bookingNumber"
    outer-class="col-span-2 mb-12"
    placeholder="z.B. XY789"
    maxlength="20"
    prefix-icon="ticket-airline"
    v-maska:[allCaps]
  />
</template>

<script setup lang="ts">
import type { ClaimsForm } from "@/types";
import { vMaska } from "maska";
defineProps<{
  modelValue: ClaimsForm;
}>();
const { allCaps } = useMask()
</script>
