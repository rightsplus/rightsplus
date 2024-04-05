<template>
<div ref="container" class="grid gap-3">
  <AirportInput
    label="Abflug"
    name="departure"
    id="departure"
    prefix-icon="plane-departure"
    :modelValue="modelValue.airport.trip.departure"
    @update:modelValue="modelValue.airport.trip.departure = $event"
    floatingLabel
  />
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
import type { ClaimsForm } from "@/types";

const props = defineProps<{
modelValue: ClaimsForm;
}>();
const container = ref<HTMLElement>();

const { routes, assignRoute } = useFlightRoute(props.modelValue)

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
watch(props.modelValue.airport.trip,
assignRoute,
{ deep: true, immediate: true }
);
onMounted(() =>{
focusFirst({ select: true, empty: true, scope: container.value })
})
</script>
