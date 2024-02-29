<template>
  <div ref="container">
    <!-- <div class="grid @md:grid-cols-2 gap-5 @container mb-5">
      <div
        v-for="(e, i) in [
          {
            value: false,
            label: 'Direktflug',
          },
          {
            value: true,
            label: 'Umsteigeflug',
          },
        ]"
        :key="i"
        class="w-full flex flex-col gap-3"
      >
        <ButtonLarge
          :selected="hasLayover === e.value"
          :name="`${e.value}`"
          @click="hasLayover = e.value"
          :label="e.label"
        />
      </div>
    </div> -->
    <AirportInput
      label="Abflug"
      name="departure"
      id="departure"
      prefix-icon="plane-departure"
      :modelValue="modelValue.airport.trip.departure"
      @update:modelValue="modelValue.airport.trip.departure = $event"
      floatingLabel
    />
    <div
      v-for="(layover, i) in modelValue.airport.trip.layover"
      v-if="modelValue.airport.trip?.layover"
    >
      <AirportInput
        v-if="modelValue.airport.trip.layover[i]"
        :id="`layover-${i}`"
        :label="`${i + 1}. Zwischenstopp`"
        name="layover"
        prefix-icon="plus"
        :modelValue="modelValue.airport.trip.layover[i]"
        @update:modelValue="update($event, i)"
        :suffix-icon="
          modelValue.airport.trip.layover.length > 0 ? 'xmark' : undefined
        "
        @suffix-icon-click="modelValue.airport.trip.layover?.splice(i, 1)"
      />
    </div>
    <button
      v-if="showAddLayoverButton"
      class="text-sm font-medium text-blue-600 underline underline-offset-2 text-left flex gap-2 items-center h-14 my-5 hover:bg-neutral-100 px-5 rounded-xl"
      @click="addLayover"
    >
      <span><FontAwesomeIcon icon="plus" /></span>
      <span class="leading-none">Zwischenstopp hinzufügen</span>
    </button>
    <AirportInput
      label="Ankunft"
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
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import type { Airport, ClaimsForm } from "@/types";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const container = ref<HTMLElement | null>(null);
const hasLayover = ref<boolean>(true);
// const hasLayover = ref<boolean>(false)
const routes = computed(() => generateRoutes?.(props.modelValue.airport.trip));
function update(e: any, i: number) {
  if (e && "iata" in e && props.modelValue.airport.trip.layover) {
    props.modelValue.airport.trip.layover[i] = e;
  }
}

const assignRoute = async () => {
  const route = props.modelValue.route?.split("-") || [];
  const [departure, arrival] = await Promise.all(
    route.map((e) => useAirports(e))
  );
  Object.assign(props.modelValue.airport, { departure, arrival });
};
watch(
  props.modelValue.airport.trip,
  () => {
    const iatasRoute = Object.keys(routes.value);
    if (iatasRoute.length <= 1) {
      props.modelValue.route = iatasRoute[0];
    }
  },
  { deep: true, immediate: true }
);
watch(
  [() => props.modelValue.airport.trip, () => props.modelValue.route],
  () => {
    assignRoute();
  },
  { deep: true, immediate: true }
);

watch(hasLayover, (value) => {
  if (value) {
    addLayover();
  } else {
    props.modelValue.airport.trip.layover = [];
  }
});
watch(
  () => props.modelValue.airport.trip.layover?.length,
  (value) => {
    if (!value) {
      // hasLayover.value = false;
    }
  }
);

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
