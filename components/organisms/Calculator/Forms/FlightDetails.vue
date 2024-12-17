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
    />
    <InputDateCalendar v-model="model.date!" label="Datum" calendar name="replacement-flight-date" :inline="false"/>
  </div>
</template>

<script setup lang="ts">
import AirportInput from "@/components/organisms/Calculator/Forms/AirportInput.vue";
import type { ClaimsForm } from "@/types";
import { vMaska } from "maska";
const { allCaps } = useMask();
const model = defineModel<ClaimsForm["connection" | "replacement"]>({
  required: true,
});

const container = ref<HTMLElement>();

onMounted(() => {
  if (!model.value.date) {
    Object.assign(model.value, {
      date: new Date().toISOString(),
    });
  }
  focusFirst({ select: true, empty: true, scope: container.value });
});
</script>
