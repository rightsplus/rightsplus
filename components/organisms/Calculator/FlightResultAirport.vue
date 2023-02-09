<template>
  <div class="flex flex-col gap-2">
    <span class="uppercase tracking-wider">{{ label }}</span>
    <div class="flex flex-col">
      <span class="font-bold leading-none text-lg text-gray-700">{{
        flight.iata
      }}</span>
      <span class="text-base">{{ allAirports[flight.iata]?.city }}</span>
    </div>
    <div class="flex flex-col leading-none">
    <span class="font-bold text-gray-700">{{ time(flight.actual) }} Ortszeit</span>
    <span
      :class="{
        'text-red-600': flight.delay > 0,
        'text-green-600': flight.delay <= 0,
      }"
      >{{ delay(flight.delay) }}</span
    >
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Airport, Flight } from "@/types";

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    flight: {
      type: Object as () => Flight["departure" | "arrival"],
      required: true,
    },
    allAirports: {
      type: Object as () => Record<string, Airport>,
      required: true,
    },
  },
  methods: {
    time(date: string) {
      return new Date(date).toLocaleTimeString(this.$i18n.locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    date(date: string) {
      return new Date(date).toLocaleDateString(this.$i18n.locale);
    },
    duration(minutes: number) {
      const min = `${minutes % 60} min`;
      const h = `${Math.floor(minutes / 60)} h`;
      return minutes >= 60 ? `${h} ${min}` : min;
    },
    delay(delay: number) {
      if (delay === 0) return "pünktlich";
      if (delay < 0) return `${this.duration(delay)} früher`;
      return `${this.duration(delay)} verspätet`;
    },
  },
});
</script>
