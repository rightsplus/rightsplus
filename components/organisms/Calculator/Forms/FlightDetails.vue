<template>
  <div class="grid gap-3" ref="container">
    <FormKit
      name="flightNumber"
      :label="$t('flightNumber')"
      type="text"
      required
      placeholder="z.B. LH1234"
      prefix-icon="hashtag"
      :modelValue.camel="modelValue.number"
      @update:modelValue="modelValue.number = $event"
      v-maska:[allCaps]
    />
    <AirportInput
      :label="$t('departureAirport')"
      name="departure"
      id="departure"
      prefix-icon="plane-departure"
      :modelValue="modelValue.departure"
      @update:modelValue="modelValue.departure = $event"
      floatingLabel
      class="mb-5"
  />
    <InputDate
      :modelValue="modelValue.date"
      @update:modelValue="modelValue.date = $event"
      label="Datum"
    />
  </div>
</template>

<script setup lang="ts">
import AirportInput from "@/components/organisms/Calculator/Forms/AirportInput.vue";
import type { ClaimsForm } from "@/types";
import { vMaska } from "maska";
import InputDate from "~/components/molecules/InputDate.vue";
const { allCaps } = useMask()

defineProps<{
  modelValue: ClaimsForm['connection' | 'replacement'];
}>();
const container = ref<HTMLElement>();

onMounted(() => {
  focusFirst({ select: true, empty: true, scope: container.value });
});
</script>
