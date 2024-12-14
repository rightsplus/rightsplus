<template>
  <div v-if="flight">
    <div
      class=""
    >
      <!-- Compensation -->
      <!-- {{ compensation }} // {{ distance }} -->
      <!-- {{
      eligible === false
        ? "ineligible"
        : eligible === true
        ? "eligible"
        : `unknown: ${message}`
    }} -->
      <div v-if="certain" class="flex flex-col">
        <span class="text-center mt-3" v-if="message">{{ message }}</span>
        <div
          class="flex flex-col justify-center text-center items-center gap-3 p-3"
        >
          <FontAwesomeIcon
            class="shrink-0 text-xl"
            v-if="compensation"
            :icon="compensation ? 'money-bill-1-wave' : 'xmark'"
            :class="{ 'text-green-500': compensation }"
          />
          <div class="flex flex-col gap-2">
            <span
              class="text-xs text-neutral-500 leading-none"
              v-if="!certain"
              >{{
                $t(
                  compensation
                    ? "potentialCompensationFromAirline"
                    : "noPotentialCompensationFromAirline"
                )
              }}</span
            >
            <span
              class="font-bold sm:text-xl leading-none"
              v-if="compensation"
              >{{
                $t("perPerson", {
                  value: $n(compensation, "currency", {
                    maximumFractionDigits: 0,
                  }),
                })
              }}</span
            >
          </div>
        </div>
        <hr class="w-full" />
      </div>
    </div>

    <CellsFlightCardExtended :flight="flight" />
  </div>
  <div v-else>{{ flight }}</div>

  <!-- <pre>{{ flight }}</pre> -->
</template>

<script setup lang="ts">
import type { ClaimsForm, Flight } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirlineLogo from "./AirlineLogo.vue";

const props = defineProps<{
  claim: ClaimsForm;
  airports?: boolean;
  certain?: boolean;
}>();
const { locale } = useI18n();
const flight = computed(() => props.claim.flight);
const emit = defineEmits(["click"]);

const city = useCities({
  departure: flight.value?.departure?.iata,
  arrival: flight.value?.arrival?.iata,
});
const { airline } = useAirline(flight.value?.airline);
const { airline: codesharedAirline } = useAirline(
  flight.value?.codeshared?.airline
);
const status = useFlightStatus(flight.value);

const date = (time: string) => {
  return new Date(time).toLocaleDateString(locale.value, {
    timeZone: "UTC",
  });
};
const time = (time: string) => {
  return new Date(time).toLocaleTimeString(locale.value, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};
const { compensation, distance, message, eligible } = useCompensation(
  !props.certain
);
</script>
