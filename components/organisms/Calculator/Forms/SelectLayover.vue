<template>
  <div ref="container">
    <div class="flex items-center rounded-lg mb-0 max-w-full duration-75">
      <span
        class="w-10 ml-1 -mr-4 flex self-stretch grow-0 shrink-0 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto [&>svg]:fill-neutral-400 z-40 formkit-icon"
        ><FontAwesomeIcon icon="plane-departure" class="text-neutral-400"
      /></span>
      <div class="flex flex-col px-4 py-3">
        <span
          class="text-neutral-500 font-medium text-xs leading-tight block"
          >{{ $t("departureAirport") }}</span
        >
        <span
          class="bg-transparent font-medium rounded-lg w-full border-none text-base text-neutral-700 placeholder-neutral-400 line-clamp-1 leading-tight"
          >{{ convertName(modelValue.airport.trip.departure) }}</span
        >
      </div>
    </div>
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
    <div class="flex items-center rounded-lg max-w-full duration-75">
      <span
        class="w-10 ml-1 -mr-4 flex self-stretch grow-0 shrink-0 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto [&>svg]:fill-neutral-400 z-40 formkit-icon"
        ><FontAwesomeIcon icon="plane-arrival" class="text-neutral-400"
      /></span>
      <div class="flex flex-col px-4 py-3">
        <span
          class="text-neutral-500 font-medium text-xs leading-tight block"
          >{{ $t("arrivalAirport") }}</span
        >
        <span
          class="bg-transparent font-medium rounded-lg w-full border-none text-base text-neutral-700 placeholder-neutral-400 line-clamp-1 leading-tight"
          >{{ convertName(modelValue.airport.trip.arrival) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AirportInput from "@/components/organisms/Calculator/Forms/AirportInput.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import type { Airport, ClaimsForm } from "@/types";
const { locale } = useI18n();

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const container = ref<HTMLElement>();
const hasLayover = ref<boolean>(true);
// const hasLayover = ref<boolean>(false)
function update(e: any, i: number) {
  if (e && "iata" in e && props.modelValue.airport.trip.layover) {
    props.modelValue.airport.trip.layover[i] = e;
  }
}
const convertName = (value?: Airport) =>
  value?.name ? `${value?.name} (${value?.iata})` : "";

const { legs, assignLeg } = useFlightLeg(props.modelValue);

watch(
  props.modelValue.airport.trip,
  () => {
    const iatasRoute = Object.keys(legs.value);
    if (iatasRoute.length <= 1) {
      props.modelValue.leg = iatasRoute[0];
    }
  },
  { deep: true, immediate: true }
);
watch(
  [() => props.modelValue.airport.trip, () => props.modelValue.leg],
  () => {
    assignLeg();
  },
  { deep: true, immediate: true }
);

watch(hasLayover, (value) => {
  if (value) {
    addLayover();
  } else {
    props.modelValue.airport.trip.layover = [{} as Airport];
  }
});

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

const showAddLayoverButton = computed(() => {
  return (
    hasLayover.value &&
    (!props.modelValue.airport.trip.layover?.length ||
      props.modelValue.airport.trip.layover.every((e) => "iata" in e)) &&
    (!props.modelValue.airport.trip.layover ||
      (props.modelValue.airport.trip.layover &&
        props.modelValue.airport.trip.layover.length < 3))
  );
});
function addLayover() {
  if (!props.modelValue.airport.trip.layover) {
    props.modelValue.airport.trip.layover = [{} as Airport];
    return;
  }
  props.modelValue.airport.trip.layover.push({} as Airport);

  setTimeout(() => {
    const nextIndex = props.modelValue.airport.trip.layover?.length || 0;
    const newLayover = container.value?.querySelector<HTMLElement>(
      `#layover-${nextIndex - 1}`
    );
    newLayover?.focus();
  }, 0);
}
</script>
