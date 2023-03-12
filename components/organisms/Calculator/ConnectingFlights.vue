<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-3xl font-bold">Hattest du Anschlussflüge?</h1>

    <div class="grid grid-cols-2 gap-3">
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
    </div>
    <div v-if="modelValue.airport.departure && modelValue.airport?.layover && modelValue.airport.layover.length" class="relative">
      <div class="opacity-50">
        <FormKit
          type="text"
          :modelValue="modelValue.airport.departure.full"
          label="Abflug"
          prefix-icon="plane-departure"
          disabled
        />
      </div>
      <div v-for="(layover, i) in modelValue.airport.layover">
        <AirportInput
          :label="`${i + 1}. Zwischenstopp hinzufügen`"
          placeholder="z.B. Frankfurt oder FRA"
          name="layover"
          prefix-icon="plus"
          :modelValue="modelValue.airport.layover[i]"
          @update:modelValue="update($event, i)"
          suffix-icon="times"
          @suffix-icon-click="modelValue.airport.layover.splice(i, 1)"
        />
      </div>
      <button
        v-if="
          modelValue.airport.layover &&
          modelValue.airport.layover.length < 4 &&
          !modelValue.airport.layover.filter((e) => !e.iata).length
        "
        class="text-sm font-medium text-blue-600 hover:underline underline-offset-2 text-left flex gap-2 items-center h-12"
        @click="modelValue.airport.layover && modelValue.airport.layover.push({})"
      >
        <span><FontAwesomeIcon icon="plus" /></span>
        <span class="leading-none">Weitere Zwischenstopps hinzufügen</span>
      </button>
      <div class="opacity-50" v-if="modelValue.airport.arrival">
        <FormKit
          type="text"
          :modelValue="modelValue.airport.arrival.full"
          label="Ankunft"
          prefix-icon="plane-arrival"
          disabled
        />
      </div>
    </div>
    <NavigationButtons @previous="$emit('back')" @next="$emit('submit')" />
  </div>
</template>

<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import Button from "@/components/molecules/Button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirportInput from "./Forms/AirportInput.vue";
import ButtonLarge from "./ButtonLarge.vue";
import NavigationButtons from "./NavigationButtons.vue";
import { ClaimsForm } from "~~/types";

const { modelValue } = defineProps<{
  modelValue: ClaimsForm;
}>();

function update(e: any, i: number) {
  if ("iata" in e && modelValue.airport.layover) {
    modelValue.airport.layover[i] = e;
    // console.log(props.modelValue.airport, generateRoutes(props.modelValue));
  }
}
function submitHandler(hasConnectingFlights: boolean) {
  if (hasConnectingFlights) {
    modelValue.airport.layover = [{}];
  } else {
    modelValue.airport.layover = false;
  }
}
</script>
<style scoped></style>
