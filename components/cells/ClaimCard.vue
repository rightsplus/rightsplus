

<script setup lang="ts">
import type { ClaimsForm, Flight } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  claim: ClaimsForm;
  airports?: boolean;
  certain?: boolean;
}>();

const flight = computed(() => props.claim.flight);
const emit = defineEmits(["click"]);

const { compensation, message } = useCompensation(
  !props.certain
);
</script>
<template>
  <div v-if="flight" class="flex flex-col gap-5">
    <div class="bg-neutral-100 rounded-lg p-5 min-h-20 flex flex-col gap-3 justify-center">
      <!-- Compensation -->
      <!-- {{ compensation }} // {{ distance }} -->
      <!-- {{
      eligible === false
        ? "ineligible"
        : eligible === true
        ? "eligible"
        : `unknown: ${message}`
    }} -->
      <div class="flex flex-col">
        <span class="text-center" v-if="message">{{ message }}</span>
        <div
          class="flex flex-col justify-center text-center items-center gap-3 p-3"
          v-if="!certain || compensation"
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
      </div>
    </div>

    <CellsFlightCardExtended
      :flight="flight"
      :airport="claim.airport"
    />
  </div>
  <div v-else>{{ flight }}</div>

  <!-- <pre>{{ flight }}</pre> -->
</template>