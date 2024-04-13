<template>
  <ButtonLarge
    :selected="!!selected"
    name="no"
    @click="emit('click')"
    class="flex !gap-1 items-center justify-between"
  >
  <div
    class="flex flex-col"
  >
    <span class="flex items-center gap-3 font-bold"
      >{{ leg.departure.airport.iata
      }}<FontAwesomeIcon icon="plane" class="text-gray-400 text-sm" />
      {{ leg.arrival?.airport.iata }}</span
    >
    <span class="text-sm">
      <span class="font-bold">{{ departureCity }}</span>
        {{$t("to")}}
      <span class="font-bold">{{ arrivalCity }}</span>
    </span>
  </div>
    <FontAwesomeIcon icon="angle-right" class="text-gray-400 text-sm" />
  </ButtonLarge>
</template>

<script setup lang="ts">
import type { Leg } from "@/types";
import ButtonLarge from "./ButtonLarge.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


const props = defineProps<{
  leg: Leg;
  selected?: boolean;
}>();

const emit = defineEmits(["click"]);

const { locale } = useI18n();

const departureCity = ref()
const arrivalCity = ref()

getCities([props.leg.departure.airport?.iata, props.leg.arrival.airport?.iata], locale.value).then(
  ([departure, arrival]) => {
    departureCity.value = departure
    arrivalCity.value = arrival
  }
);

</script>
