<template>
  <div class="flex gap-0.5 @sm:gap-1 @lg:gap-2 items-end">
    <div
      v-for="(freq, hour) in frequency"
      class="flex flex-col gap-2 basis-0 grow"
    >
      <div
        class="cursor-pointer rounded-sm bg-gray-200 hover:bg-gray-300"
        :class="{
          'pointer-events-none opacity-50': !freq,

          'bg-primary-400 hover:!bg-primary-500':
            (dayTime === 'morning' && hour < 12) ||
            (dayTime === 'afternoon' && hour >= 12 && hour < 20) ||
            (dayTime === 'evening' && hour >= 20),
        }"
        :style="`height: ${freq * 10 + 5}px`"
        @click="
          freq &&
            $emit('select',
              hour < 12
                ? 'morning'
                : hour >= 12 && hour < 20
                ? 'afternoon'
                : 'evening'
            )
        "
      />
      <span
        class="hidden @lg:inline text-xs text-center font-medium tracking-tighter"
        >{{ hour }}</span
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { Flight } from "@/types";
const props = defineProps<{
	flights: Flight[]
  dayTime: string | null;
}>();

const flightsPerHour = computed(() =>
  props.flights.map((e, i) =>
    new Date(e.departure.scheduled).getHours()
  )
);
const frequency = computed(() =>
  [...Array(24)].map(
    (_, index) =>
      flightsPerHour.value.filter((flight) => flight === index).length
  )
);
</script>
