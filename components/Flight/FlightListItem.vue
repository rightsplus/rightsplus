<template>
  <div v-if="type === 'separator'" class="text-center font-bold text-gray-400">
    {{ getLocalizedDate(flight.departure.scheduledTime) }}
  </div>
  <div
    v-if="type === 'expandCollapse'"
    class="text-center font-bold text-gray-400"
  >
    <div
      v-if="flight.type === 'toggle'"
      class="flex gap-2 items-center w-full justify-center text-sm text-gray-400"
    >
      <div class="hidden @md:flex gap-1 flex-row-reverse" v-if="!groupOpen">
        <AirlineLogo
          v-for="airline in flight.airlines"
          :key="airline.iata"
          :airline="airline"
          size="sm"
          class="-ml-4"
        />
      </div>
      <span class="font-medium">{{
        groupOpen ? "Weniger Anzeigen" : "Mehr Anzeigen"
      }}</span
      ><FontAwesomeIcon
        icon="angle-down"
        class="duration-300"
        :class="groupOpen ? 'rotate-180' : ''"
      />
    </div>
  </div>
  <FlightCard v-else />
</template>

<script setup lang="ts">
import type { Flight } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirlineLogo from "./AirlineLogo.vue";
import type { ButtonProps } from "../core/Button.vue";
const { locale } = useI18n();

const props = defineProps<FlightCardProps>();

const emit = defineEmits(["click", "toggle"]);
</script>
