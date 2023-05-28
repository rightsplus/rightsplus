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
    <div v-if="modelValue.airport" class="relative -mb-5">
      <AirportInput
        label="Abflug"
        placeholder="z.B. New York oder JFK"
        name="departure"
        id="departure"
        prefix-icon="plane-arrival"
        :modelValue="modelValue.airport.departure"
        @update:modelValue="modelValue.airport.departure = $event"
        :floatingLabel="true"
      />
      <div
        v-for="(layover, i) in modelValue.airport.layover"
        v-if="modelValue.airport?.layover && modelValue.airport.layover.length"
      >
          <AirportInput
            v-if="modelValue.airport.layover[i]"
            :id="`layover-${i}`"
            :label="`${i + 1}. Zwischenstopp hinzufügen`"
            placeholder="z.B. Frankfurt oder FRA"
            name="layover"
            prefix-icon="plus"
            :modelValue="modelValue.airport.layover[i]"
            @update:modelValue="update($event, i)"
            :suffix-icon="
              modelValue.airport.layover.length > 0 ? 'xmark' : undefined
            "
            @suffix-icon-click="modelValue.airport.layover?.splice(i, 1)"
          />
      </div>
      <button
        v-if="showAddLayoverButton"
        class="text-sm font-medium text-blue-600 hover:underline underline-offset-2 text-left flex gap-2 items-center h-8 my-8"
        @click="addLayover"
      >
        <span><FontAwesomeIcon icon="plus" /></span>
        <span class="leading-none">Zwischenstopps hinzufügen</span>
      </button>
      <div>
        <AirportInput
          label="Ankunft"
          placeholder="z.B. Tokyo oder NRT"
        name="arrival"
        id="arrival"
          prefix-icon="plane-arrival"
          :modelValue="modelValue.airport.arrival"
          @update:modelValue="modelValue.airport.arrival = $event"
          :floatingLabel="true"
        />
      </div>
    </div>
    <div class="flex flex-col gap-3"
        v-if="
          useAppState().routes && Object.values(useAppState().routes).length > 1
        ">
    <h3
      class="flex justify-between items-center text-lg sm:text-xl font-medium"
    >
      <span class="text-gray-500">Bei welchem Flug gab es Probleme?</span>
    </h3>
      <div
        v-for="([key, route], i) in Object.entries(useAppState().routes)"
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
            to
            <span class="font-bold">{{
              route.arrival?.airport.city
            }}</span></span
          >
        </ButtonLarge>
      </div>
    </div>
    <NavigationButtons @next="$emit('submit')" :nextDisabled="!modelValue.airport.departure || !modelValue.airport.arrival || !!(modelValue.route && !useAppState().routes[modelValue.route || ''])" />
  </div>
</template>

<script lang="ts" setup>
import Button from "@/components/molecules/Button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirportInput from "./Forms/AirportInput.vue";
import ButtonLarge from "./ButtonLarge.vue";
import NavigationButtons from "./NavigationButtons.vue";
import { ClaimsForm } from "~~/types";

const { modelValue } = defineProps<{
  modelValue: ClaimsForm;
}>();

watch(() => useAppState().routes, () => {
  if ((useAppState().routes && Object.values(useAppState().routes).length <= 1)) {
    modelValue.route = Object.keys(useAppState().routes)[0];
  }
}, {deep: true, immediate: true})
function update(e: any, i: number) {
  if (e && "iata" in e && modelValue.airport.layover) {
    modelValue.airport.layover[i] = e;
  }
}
const showAddLayoverButton = computed(() => {
  return (
    modelValue.airport.layover.every(e => 'iata' in e) &&
    (!modelValue.airport.layover ||
    (modelValue.airport.layover && modelValue.airport.layover.length < 3))
  );
});
function addLayover() {
  if (!modelValue.airport.layover) {
    modelValue.airport.layover = [{}];
    return;
  }
  modelValue.airport.layover.push({});

  setTimeout(() => {
    document
      .querySelector(`#layover-${modelValue.airport.layover.length - 1}`)
      ?.focus();
  }, 0);
}
</script>
<style scoped></style>
