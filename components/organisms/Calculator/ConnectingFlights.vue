<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-2xl sm:text-3xl font-bold">Deine Flugroute</h1>

    <h3
      class="flex justify-between items-center text-lg sm:text-xl font-medium"
    >
      <span class="text-gray-500">Hattest du Zwischenstopps?</span>
    </h3>
    <!-- <div class="grid sm:grid-cols-2 gap-3">
      <ButtonLarge
        @click.prevent="submitHandler(false)"
        :selected="!modelValue.airport.layover?.length"
        name="no"
        label="Nein"
        icon="plane"
        :subLabel="`Ich bin direkt${
          modelValue.airport?.arrival?.city
            ? ' nach ' + modelValue.airport?.arrival?.city
            : ''
        } geflogen`"
      />
      <ButtonLarge
        @click.prevent="submitHandler(true)"
        :selected="modelValue.airport.layover?.length"
        name="yes"
        label="Ja, ich musste umsteigen"
        icon="plus"
        subLabel="Zwischenstopps hinzufügen"
      />
    </div> -->
    <div v-if="modelValue.airport.trip" class="relative -mb-5">
      <AirportInput
        label="Abflug"
        placeholder="z.B. New York oder JFK"
        name="departure"
        id="departure"
        prefix-icon="plane-departure"
        :modelValue="modelValue.airport.trip.departure"
        @update:modelValue="modelValue.airport.trip.departure = $event"
        :floatingLabel="true"
      />
      <div
        v-for="(layover, i) in modelValue.airport.trip.layover"
        v-if="
          modelValue.airport.trip?.layover &&
          modelValue.airport.trip.layover.length
        "
      >
        <AirportInput
          v-if="modelValue.airport.trip.layover[i]"
          :id="`layover-${i}`"
          :label="`${i + 1}. Zwischenstopp`"
          placeholder="z.B. Frankfurt oder FRA"
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
        class="text-sm font-medium text-blue-600 hover:underline underline-offset-2 text-left flex gap-2 items-center h-8 my-8"
        @click="addLayover"
      >
        <span><FontAwesomeIcon icon="plus" /></span>
        <span class="leading-none">Zwischenstopp hinzufügen</span>
      </button>
      <div>
        <AirportInput
          label="Ankunft"
          placeholder="z.B. Tokyo oder NRT"
          name="arrival"
          id="arrival"
          prefix-icon="plane-arrival"
          :modelValue="modelValue.airport.trip.arrival"
          @update:modelValue="modelValue.airport.trip.arrival = $event"
          :floatingLabel="true"
        />
      </div>
    </div>
    <div
      class="flex flex-col gap-3"
      v-if="
        routes && Object.values(routes).length > 1
      "
    >
      <h3
        class="flex justify-between items-center text-lg sm:text-xl font-medium"
      >
        <span class="text-gray-500">Bei welchem Flug gab es Probleme?</span>
      </h3>
      <div
        v-for="([key, route], i) in Object.entries(routes)"
        :key="key"
        class="w-full flex flex-col gap-3"
      >
        <ButtonLarge
          :selected="modelValue.route === key"
          name="no"
          @click="modelValue.route = key"
          class="flex flex-col !gap-1 !items-start"
        >
          <span class="flex items-center gap-3 font-bold"
            >{{ route.departure.airport.iata
            }}<FontAwesomeIcon icon="plane" class="text-gray-400 text-sm" />
            {{ route.arrival?.airport.iata }}</span
          >
          <span class="text-sm"
            ><span class="font-bold">{{ route.departure.airport.city }}</span>
            nach
            <span class="font-bold">{{
              route.arrival?.airport.city
            }}</span></span
          >
        </ButtonLarge>
      </div>
    </div>
    <Callout
      type="warning"
      icon="exclamation-triangle"
      v-if="modelValue.route && !europeanUnion"
    >
      Sowohl der Abflugs- also auch der Zielflughafen befinden sich außerhalb
      der Europäischen Union.
    </Callout>
    <NavigationButtons
      @next="$emit('submit')"
      :nextLabel="
        !modelValue.airport.trip.layover.some((e) => Object.keys(e).length)
          ? 'Weiter ohne Zwischenstopps'
          : 'Weiter'
      "
      :nextDisabled="

        /**
         * disabled if
         * - not in EU (this is false if both airports are not EU or if not all airports are defined)
         * - layover is length > 0 and route is not defined
         */
        !europeanUnion ||
        !!(
          modelValue.route &&
          routes &&
          !routes[modelValue.route || '']
        )
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirportInput from "./Forms/AirportInput.vue";
import ButtonLarge from "./ButtonLarge.vue";
import NavigationButtons from "./NavigationButtons.vue";
import { ClaimsForm, Airport } from "~~/types";
import Callout from "~/components/molecules/Callout.vue";
import { euMember } from "is-european";

const { modelValue } = defineProps<{
  modelValue: ClaimsForm;
}>();
const routes = computed(() => generateRoutes?.(modelValue.airport.trip))
watch(
  () => modelValue.airport.trip,
  () => {
    const iatasRoute = Object.keys(routes.value)

    if (iatasRoute.length <= 1) {
      modelValue.route = iatasRoute[0];
    }
  },
  { deep: true, immediate: true }
)
watch(
  () => modelValue.airport.trip && modelValue.route,
  () => {
    const [departure, arrival] =
      modelValue.route?.split("-").map((e) => useAirports(e)) || [];

    modelValue.airport.departure = departure;
    modelValue.airport.arrival = arrival;
  },
  { deep: true, immediate: true }
);

const europeanUnion = computed(() => {
  return [modelValue.airport.departure, modelValue.airport.arrival]
    .map((e) => e?.country_code)
    .some(euMember);
});

const nextDisabled = computed(() => {
  return !europeanUnion;
});
function update(e: any, i: number) {
  if (e && "iata" in e && modelValue.airport.trip.layover) {
    modelValue.airport.trip.layover[i] = e;
  }
}
const showAddLayoverButton = computed(() => {
  return (
    (!modelValue.airport.trip.layover.length ||
      modelValue.airport.trip.layover.every((e) => "iata" in e)) &&
    (!modelValue.airport.trip.layover ||
      (modelValue.airport.trip.layover &&
        modelValue.airport.trip.layover.length < 3))
  );
});
function addLayover() {
  if (!modelValue.airport.trip.layover) {
    modelValue.airport.trip.layover = [{} as Airport];
    return;
  }
  modelValue.airport.trip.layover.push({} as Airport);

  setTimeout(() => {
    document
      .querySelector(`#layover-${modelValue.airport.trip.layover.length - 1}`)
      ?.focus();
  }, 0);
}
</script>
<style scoped></style>
