<template>
  <div
    class="flex flex-col gap-3 mt-5"
    v-if="
      modelValue.disruption.type === 'delayed' &&
      ['<3'].includes(modelValue.disruption.details || '') &&
      modelValue.airport.trip.layover?.some(
        (e) => e.iata === modelValue.flight?.arrival.iata
      )
    "
  >
    <SectionSubHeader :label="`Hast du deinen Anschlussflug verpasst?`" />
    <div class="grid sm:grid-cols-2 gap-3">
      <ButtonLarge
        v-for="c in [
          { value: false, label: $t('no') },
          { value: true, label: $t('yes') },
        ]"
        :key="c.value.toString()"
        @click.prevent="modelValue.disruption.connectingFlight = c.value"
        :selected="modelValue.disruption.connectingFlight === c.value"
        :name="c.value.toString()"
        :label="c.label"
      />
    </div>
    <SectionHeader :label="`Wähle deinen Anschlussflug?`" />
    <FlightList
      v-if="modelValue.disruption.connectingFlight"
      :flights="
        getFilteredFlights({
          departure: modelValue.airport.arrival?.iata,
          arrival: modelValue.airport.trip?.arrival?.iata,
          date: props.modelValue.date || undefined,
          custom: filterConnectionFlights,
        })
      "
      :modelValue="modelValue.connection.flight"
      @update:modelValue="
        (e) => {
          modelValue.connection.flight = e;
        }
      "
    />
    less time than 45 min:
    {{
      (new Date(modelValue.connection.flight.departure.actualTime).getTime() -
        new Date(modelValue.flight.arrival.actualTime).getTime()) /
      1000 /
      60
    }}
    min
  </div>
</template>

<script setup lang="ts">
import SectionSubHeader from "@/components/organisms/Calculator/SectionSubHeader.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import FlightList from "@/components/organisms/Calculator/FlightList.vue";
import type { ClaimsForm } from "@/types";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const { disruptions } = useDisruption();
const { getFilteredFlights } = useFlights();

const filterConnectionFlights = (flight: Flight) => {
  if (!props.modelValue.flight) return false;

  const { arrival } = props.modelValue.flight;
  // const buffer = 1800000; // 30 min
  const buffer = 2700000; // 45 min

  return (
    new Date(flight.departure.actual || flight.departure.scheduled).getTime() -
      new Date(arrival.scheduled).getTime() >
    buffer
  );
};
</script>
