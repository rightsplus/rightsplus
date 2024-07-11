<template>
  <div
    class="text-sm cursor-pointer text-gray-900 group"
    :class="{
      active: active,
    }"
  >
    <hr
      class="border-b-px border-gray-100 mx-3 duration-750 transition-opacity"
    />

    <div
      class="p-3 group-hover:bg-primary-100/50 w-full rounded-lg relative grid grid-cols-4 gap-3"
      :class="{
        '!bg-primary-100': active,
      }"
    >
      <div class="flex flex-col">
        <span class="font-bold">
          {{ flight.flight.iata }}
        </span>
        <span class="flex items-center gap-2">
          <CellsAirlineLogo :airline="flight.airline" size="xs" />
          <span class="text-neutral-500 font-medium leading-none line-clamp-1 text-xs" :class="{ '!text-neutral-200 bg-neutral-200 rounded': airlinePending }">{{ airline.name }}</span>
        </span>
      </div>
      <span> {{ flight.departure.iata }} → {{ flight.arrival.iata }} </span>
      <span>
        {{ time(flight.departure.scheduledTime, locale.value) }} →
        {{ time(flight.arrival.scheduledTime, locale.value) }}
      </span>
      <span>
        {{ flight.status }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Flight } from "@/types";

const props = defineProps<{
  flight: Flight;
  active: boolean;
}>();
const { locale } = useI18n()
const { airline, pending: airlinePending } = useAirline(props.flight.airline);
</script>

<style lang="scss">
.group {
  &:first-child,
  &.active,
  &.active + *,
  &:hover,
  &:hover + * {
    hr {
      opacity: 0;
    }
  }
}
</style>
