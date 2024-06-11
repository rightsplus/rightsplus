<template>
  <div ref="container" class="grid gap-3">
    <AirportInput
      :label="$t('departureAirport')"
      name="departure"
      id="departure"
      prefix-icon="plane-departure"
      :modelValue="modelValue.airport.trip.departure"
      @update:modelValue="modelValue.airport.trip.departure = $event"
      floatingLabel
    />
    <div class="grid gap-3">
      <div
        v-for="(layover, i) in modelValue.airport.trip.layover"
        v-if="modelValue.airport.trip?.layover"
      >
        <AirportInput
          :label="`${formatOrdinals(i + 1, locale)} ${$t('stopover')}`"
          v-if="modelValue.airport.trip.layover[i]"
          :id="`layover-${i}`"
          name="layover"
          prefix-icon="arrow-right-arrow-left"
          :modelValue="modelValue.airport.trip.layover[i]"
          @update:modelValue="update($event, i)"
          :suffix-icon="isRemovable(i) ? 'xmark' : undefined"
          @suffix-icon-click="removeLayover(i)"
        />
      </div>
    </div>
    <AirportInput
      :label="$t('arrivalAirport')"
      name="arrival"
      id="arrival"
      prefix-icon="plane-arrival"
      :modelValue="modelValue.airport.trip.arrival"
      @update:modelValue="modelValue.airport.trip.arrival = $event"
      floatingLabel
    />
  </div>
</template>

<script setup lang="ts">
import AirportInput from "@/components/organisms/Calculator/Forms/AirportInput.vue";
import type { Airport, ClaimsForm } from "@/types";
const { locale } = useI18n();
const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const t = ref()
const container = ref<HTMLElement>();

const { assignLeg } = useFlightLeg(props.modelValue);

watch(
  props.modelValue.airport.trip,
  assignLeg,
  { deep: true, immediate: true }
);

onMounted(() => {
  focusFirst({ select: true, empty: true, scope: container.value });
});

const update = (e: Airport, i: number) => {
  if (props.modelValue.airport.trip.layover) {
    props.modelValue.airport.trip.layover[i] = e;
  }
}
const isRemovable = (i: number) => {
  const { layover } = props.modelValue.airport.trip;
  return (layover?.length || 0) > 1 || !!layover?.[i].iata;
};
const removeLayover = (i: number) => {
  if (props.modelValue.airport.trip.layover?.length === 1) {
    props.modelValue.airport.trip.layover = [{} as Airport];
    return;
  }
  props.modelValue.airport.trip.layover?.splice(i, 1);
};
</script>
