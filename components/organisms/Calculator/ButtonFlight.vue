<template>
  <button @click="emit('click', flight)">
    <FlightCard :flight="flight" :selected="selected" is="button" />
  <!-- <div
      class="w-14 h-14 hidden justify-center items-center bg-white rounded-full -ml-2 shrink-0 @md:flex"
    >
      <FontAwesomeIcon
        v-if="flight.flight_status === 'otherFlight'"
        icon="plane-slash"
        class="text-sm text-gray-400"
      />
      <img
        v-else
        v-show="!logoError"
        @error="logoError = true"
        @load="logoError = false"
        :alt="flight.airline?.name"
        :src="logo"
        class="w-10 text-xs"
      />
    </div>
    <div class="flex flex-col items-start text-start">
      <span
        class="text-sm leading-none"
        v-if="
          flight.flight_status !== 'otherFlight' &&
          flight.departure &&
          flight.arrival
        "
        ><span class="font-bold">{{
          departureCity
        }}</span>
        to
        <span class="font-bold">{{
          arrivalCity
        }}</span></span
      >

      <span
        v-if="flight.flight_status === 'otherFlight'"
        class="text-lg font-bold leading-none h-6"
        >{{ $t("otherFlight.label") }}</span
      >
      <span
        v-else-if="flight.departure && flight.arrival"
        class="text-lg font-bold flex items-center gap-3"
        >{{ time(flight.departure.scheduled)
        }}<FontAwesomeIcon icon="plane" class="text-sm text-gray-400" />{{
          time(flight.arrival.scheduled)
        }}<span v-if="overNight(flight)" class="-ml-2 text-gray-500 text-xs"
          >+{{ overNight(flight) }}</span
        ></span
      >
      <span
        v-if="flight.flight_status === 'otherFlight'"
        class="text-base leading-none"
        >{{ $t("otherFlight.sublabel") }}</span
      >
      <span v-else class="flex items-center gap-2 text-base leading-none">
        <span
          class="w-6 h-6 flex justify-center items-center bg-white rounded-full ml-auto shrink-0 @md:hidden"
          v-if="flight.airline"
        >
          <img
            v-show="!logoError"
            @error="logoError = true"
            @load="logoError = false"
            :alt="flight.airline?.name"
            :src="logo"
            class="w-5" /></span
        ><span
          >{{ flight.airline?.name
          }}<span
            v-if="ucfirst(flight.flight.codeshared?.airline_name)"
            class="opacity-50"
          >
            operated by
            {{ ucfirst(flight.flight.codeshared?.airline_name) }}</span
          ></span
        ></span
      >
    </div>

    <div
      class="ml-auto"
      v-if="flight.flight_status === 'otherFlight'"
    >
      <FormKit
        @click.stop
        :label="$t('flightNumber')"
        v-model="flight.iata"
        outer-class="text-left"
        placeholder="z.B. FR789"
        maxlength="20"
        autocomplete="off"
        v-maska:[options]
      />
    </div>
    <div
      class="flex flex-col gap-1 items-center ml-auto"
      v-else
    >
      <span
        class="ml-auto text-gray-400 text-base font-medium leading-none whitespace-nowrap"
        >{{ iata }}</span
      >
      <span
        v-if="flight.flight_status === 'cancelled'"
        class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
        :class="selected ? 'text-red-400' : 'text-red-500'"
        >{{ $t("cancelled") }}</span
      >
      <span
        v-else-if="flight.arrival?.delay > 0"
        class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
        :class="selected ? 'text-red-400' : 'text-red-500'"
        >{{
          $t("delayed.by", { value: getDuration(flight.arrival?.delay) })
        }}</span
      >
      <span
        v-else-if="flight.arrival?.delay < 0"
        class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
        :class="selected ? 'text-green-400' : 'text-green-500'"
        >{{
          $t("early.by", { value: getDuration(flight.arrival?.delay * -1) })
        }}</span
      >
      <span
        v-else-if="
          flight.flight_status === 'scheduled' &&
          new Date(flight.departure.scheduled) > new Date()
        "
        class="ml-auto text-sm font-medium leading-none whitespace-nowrap"
        :class="selected ? 'text-green-400' : 'text-green-600'"
        >{{ $t("onTime") }}</span
      >
    </div> -->
  </button>
</template>

<script setup lang="ts">
import type { Flight } from "@/types";
import FlightCard from "~/components/cells/FlightCard.vue";

defineProps<{
  flight: Flight;
  selected: boolean;
}>();

const emit = defineEmits(["click"]);
</script>
