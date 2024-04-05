<template>
  <div class="flex gap-0.5 @sm:gap-1 @lg:gap-2 items-end">
    <div
      v-for="(freq, hour) in frequency"
      class="flex flex-col gap-2 basis-0 grow"
      :class="{
        'pointer-events-none opacity-50': !freq,
      }"
    >
            <!-- (dayTime === 'morning' && hour < 13) ||
            (dayTime === 'afternoon' && hour >= 13 && hour < 18) ||
            (dayTime === 'evening' && hour >= 18), -->
      <div
        class="cursor-pointer rounded-sm bg-gray-200 hover:bg-gray-300"
        :class="{
          'bg-primary-400 hover:!bg-primary-500':
            time === hour,
        }"
        :style="`height: ${((freq / max) * 30 + 2)}px`"
        @click="
          freq &&
            $emit('select',
              hour
            )
        "
      />
              <!-- hour < 13
                ? 'morning'
                : hour >= 13 && hour < 18
                ? 'afternoon'
                : 'evening' -->
      <span
        class="@lg:inline text-xs text-center font-medium tracking-tighter"
        >{{ hour }}</span
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Flight } from "@/types";
const props = defineProps<{
	flights: Flight[]
  dayTime: string | null;
  time: number;
}>();

const flightsPerHour = computed(() =>
  props.flights.map((e, i) =>
    new Date(e.departure.scheduledTime).getHours()
  )
);
const frequency = computed(() =>
  [...Array(24)].map(
    (_, index) =>
      flightsPerHour.value.filter((flight) => flight === index).length
  )
);
const max = computed(() => Math.max(...frequency.value));
</script>
