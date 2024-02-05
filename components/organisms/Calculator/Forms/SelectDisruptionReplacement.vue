<template>
  <div
    class="flex flex-col gap-3 mt-5"
    v-if="
      modelValue.disruption.type === 'delayed' &&
        ['<3'].includes(modelValue.disruption.details || '')
    "
  >
    <SectionSubHeader
      :label="`Hast du wegen der Verspätung deinen Anschlussverpasst?`"
    />
    <div class="grid sm:grid-cols-2 gap-3">
      <ButtonLarge
        v-for="c in [
          {
            value: false,
            label: $t('no'),
            subLabel: `Ich habe ${arrivalCity ||
              $t('myDestination')} wie geplant erreicht.`
          },
          {
            value: true,
            label: $t('yes'),
            subLabel: 'Ich habe meinen Anschluss verpasst'
          }
        ]"
        :key="c.value.toString()"
        @click.prevent="modelValue.disruption.replacement = c.value"
        :selected="modelValue.disruption.replacement === c.value"
        :name="c.value.toString()"
        :label="c.label"
        :subLabel="c.subLabel"
      />
    </div>
    <!-- {{ modelValue.disruption }} -->

    <div
      class="flex flex-col gap-3 mt-5"
      v-if="modelValue.disruption.replacement"
    >
      <SectionSubHeader :label="`Ist dein Ersatzflug hier aufgeführt?`" />
      <FlightList
        :flights="
          getFilteredFlights({
            departure: modelValue.airport.departure?.iata,
            arrival: modelValue.airport.arrival?.iata,
            date: props.modelValue.flight_date,
            custom: isReplacementFlightWithinBounds
          })
        "
        :modelValue="modelValue.disruption.replacementFlight"
        @update:modelValue="
          e => {
            modelValue.disruption.replacementFlight = e;
          }
        "
      />
    </div>
  </div>

  <div
    class="flex flex-col gap-3 mt-5"
    v-if="
      modelValue.disruption.type === 'cancelled' &&
        ['<7', '8-14'].includes(modelValue.disruption.details || '')
    "
  >
    <SectionSubHeader :label="`Wurde Ersatzbeförderung angeboten?`" />
    <div class="grid sm:grid-cols-2 gap-3">
      <ButtonLarge
        v-for="c in [
          { value: false, label: $t('no') },
          { value: true, label: $t('yes') }
        ]"
        :key="c.value.toString()"
        @click.prevent="modelValue.disruption.replacement = c.value"
        :selected="modelValue.disruption.replacement === c.value"
        :name="c.value.toString()"
        :label="c.label"
      />
    </div>
    <div
      class="flex flex-col gap-3 mt-5"
      v-if="modelValue.disruption.replacement"
    >
      <SectionSubHeader :label="`Ist dein Ersatzflug hier aufgeführt?`" />
      <FlightList
        :flights="
          getFilteredFlights({
            departure: modelValue.airport.departure?.iata,
            arrival: modelValue.airport.arrival?.iata,
            date: props.modelValue.flight_date,
            custom: isReplacementFlightWithinBounds
          })
        "
        :modelValue="modelValue.disruption.replacementFlight"
        @update:modelValue="
          e => {
            modelValue.disruption.replacementFlight = e;
          }
        "
      />
    </div>
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

const { delayedDetails, cancelledDetails } = useDisruption(
  props.modelValue.flight
);

const isReplacementFlightWithinBounds = (flight: Flight) => {
  if (!props.modelValue.flight) return false;
  if (flight.flight.iata?.toUpperCase() === props.modelValue.flight.flight.iata)
    return false;
  // 0-7 Tage: max 1h vor planm. Abflug gestartet + max 2h nach planm. Ankunft gelandet
  // 8-14 Tage: max 2h vor planm. Abflug gestartet + max 4h nach planm. Ankunft gelandet
  const { details } = props.modelValue.disruption;
  const { departure, arrival } = props.modelValue.flight;
  const arrivalBuffer = "<7" === details ? 3600000 : 7200000;
  const departureBuffer = "<7" === details ? 7200000 : 14400000;

  return (
    !!details &&
    ["<7", "8-14"].includes(details) &&
    new Date(flight.departure.actual || flight.departure.scheduled).getTime() -
      new Date(departure.scheduled).getTime() <=
      arrivalBuffer &&
    new Date(arrival.scheduled).getTime() -
      new Date(flight.arrival.actual || flight.arrival.scheduled).getTime() <=
      departureBuffer
  );
};
</script>
