<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-2xl sm:text-3xl font-bold">Deine Flugroute</h1>

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
    <div v-if="modelValue.airport" class="relative">
      <AirportInput
        label="Abflug"
        placeholder="z.B. Frankfurt oder FRA"
        name="layover"
        prefix-icon="plane-arrival"
        :modelValue="modelValue.airport.departure"
        @update:modelValue="modelValue.airport.departure = $event"
        :floatingLabel="true"
      />
      <div
        v-for="(layover, i) in modelValue.airport.layover"
        v-if="modelValue.airport?.layover && modelValue.airport.layover.length"
      >
        <div v-if="modelValue.airport.layover[i]">
          <AirportInput
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
      </div>
      <button
        v-if="showAddLayoverButton"
        class="text-sm font-medium text-blue-600 hover:underline underline-offset-2 text-left flex gap-2 items-center h-8 my-7"
        @click="addLayover"
      >
        <span><FontAwesomeIcon icon="plus" /></span>
        <span class="leading-none">Zwischenstopps hinzufügen</span>
      </button>
      <div>
        <AirportInput
          label="Ankunft"
          placeholder="z.B. Frankfurt oder FRA"
          name="layover"
          prefix-icon="plane-arrival"
          :modelValue="modelValue.airport.arrival"
          @update:modelValue="modelValue.airport.arrival = $event"
          :floatingLabel="true"
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
  // console.log(`#layover-${modelValue.airport.layover.length - 2}`)
  // console.log(document.querySelector(`#layover-${modelValue.airport.layover.length - 2}`))
  setTimeout(() => {
    document
      .querySelector(`#layover-${modelValue.airport.layover.length - 1}`)
      ?.focus();
  }, 0);
}
</script>
<style scoped></style>
