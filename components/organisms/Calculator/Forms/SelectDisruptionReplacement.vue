<template>
  <div
    class="flex flex-col gap-3 mt-5"
    v-if="
      modelValue.airport.trip.layover?.length &&
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
            subLabel: `Ich habe ${
              arrivalCity || $t('myDestination')
            } wie geplant erreicht.`,
          },
          {
            value: true,
            label: $t('yes'),
            subLabel: 'Ich habe meinen Anschluss verpasst',
          },
        ]"
        :key="c.value.toString()"
        @click.prevent="modelValue.disruption.replacementFlight = c.value"
        :selected="modelValue.disruption.replacementFlight === c.value"
        :name="c.value.toString()"
        :label="c.label"
        :subLabel="c.subLabel"
      />
    </div>
    <!-- {{ modelValue.disruption }} -->

    <div
      class="flex flex-col gap-3 mt-5"
      v-if="modelValue.disruption.replacementFlight"
    >
      <FormKit
        label="Flugnummer"
        name="flightNumber"
        v-model="modelValue.disruption.replacementFlight"
      />
      <SectionSubHeader :label="`Ist dein Ersatzflug hier aufgeführt?`" />
      <FlightList
        :flights="
          getFilteredFlights({
            departure: modelValue.airport.departure?.iata,
            arrival: modelValue.airport.arrival?.iata,
            date: props.modelValue.date || undefined,
            custom: isReplacementFlightWithinBounds,
          })
        "
        :modelValue="modelValue.replacement.flight"
        @update:modelValue="
          (e) => {
            modelValue.replacement.flight = e;
          }
        "
      />
    </div>
  </div>

  <div
    class="flex flex-col gap-3 mt-5"
    v-if="
      modelValue.disruption.type === 'cancelled' &&
      ['<8', '8-14'].includes(modelValue.disruption.details || '')
    "
  >
    <SectionSubHeader :label="`Wurde Ersatzbeförderung angeboten?`" />
    <div class="grid sm:grid-cols-2 gap-3">
      <ButtonLarge
        v-for="c in [
          { value: false, label: $t('no') },
          { value: true, label: $t('yes') },
        ]"
        :key="c.value.toString()"
        @click.prevent="modelValue.disruption.replacementFlight = c.value"
        :selected="modelValue.disruption.replacementFlight === c.value"
        :name="c.value.toString()"
        :label="c.label"
      />
    </div>
    <div
      class="flex flex-col gap-3 mt-5"
      v-if="modelValue.disruption.replacementFlight"
    >
      <SectionSubHeader :label="`Ist dein Ersatzflug hier aufgeführt?`" />
      <FlightList
        :flights="
          getFilteredFlights({
            departure: modelValue.airport.departure?.iata,
            arrival: modelValue.airport.arrival?.iata,
            date: props.modelValue.date || undefined,
            custom: isReplacementFlightWithinBounds,
          })
        "
        :modelValue="modelValue.replacement.flight"
        @update:modelValue="
          (e) => {
            modelValue.replacement.flight = e;
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
import type { ClaimsForm, Flight } from "@/types";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();

const { locale } = useI18n();
const { getFilteredFlights } = useFlights()

const arrivalCity = ref();
watch(
  () => props.modelValue.airport,
  () => {
    getCities([props.modelValue.airport.trip.arrival?.iata], locale.value).then(
      ([arrival]) => {
        arrivalCity.value = arrival;
      }
    );
  },
  { immediate: true, deep: true }
);

</script>
