<template>
  <div vclass="flex flex-col">
    <div class="flex gap-2 text-base items-center">
      <div
        v-if="code && weatherIconMap[code]"
        :class="getColor(weatherIconMap[code])"
      >
        <FontAwesomeIcon :icon="weatherIconMap[code]" />
      </div>
      <div v-else-if="temperature" class="text-gray-400">
        <FontAwesomeIcon icon="cloud-slash" />
      </div>
      <div v-else>
        <FontAwesomeIcon
          icon="circle-quarter"
          class="text-gray-400 animate-revolve"
        />
      </div>
      <span class="font-medium" v-if="temperature">{{
        $n(temperature, { maximumFractionDigits: 0 })
      }}&deg;</span>
      <span class="font-medium text-neutral-300 bg-neutral-300 rounded" v-else
        >--&deg;</span
      >
    </div>
    <span
      class="gap-2 items-center text-xs"
      :class="{ 'text-neutral-200 bg-neutral-200 rounded': !wind }"
      >{{ $n(wind || 0) }} km/h</span
    >
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
  code?: number;
  temperature?: number;
  wind?: number;
}>();

const getColor = (icon: string) => {
  if (icon.includes("rain")) return "text-blue-500";
  if (icon.includes("wind")) return "text-blue-400";
  if (icon.includes("cloud")) return "text-gray-400";
  if (icon.includes("sun")) return "text-yellow-500";
  if (icon.includes("snow")) return "text-white";
  if (icon.includes("bolt")) return "text-yellow-500";
  if (icon.includes("smog")) return "text-gray-400";
  return "text-gray-400";
};

const weatherIconMap = [
  "sun",
  "cloud-rain",
  "cloud-sun-rain",
  "cloud-showers-heavy",
  "bolt",
  "snowflake",
  "smog",
  "wind",
  "cloud",
  "cloud-sun",
  "cloud-moon",
  "cloud-sun",
  "cloud-moon",
  "cloud-rain",
  "cloud-sun-rain",
  "cloud-showers-heavy",
  "bolt",
  "snowflake",
  "smog",
  "wind",
  "smog",
  "cloud-sun",
  "cloud-moon",
  "cloud-sun",
  "cloud-moon",
  "cloud-rain",
  "cloud-sun-rain",
  "cloud-showers-heavy",
  "bolt",
  "snowflake",
  "smog",
  "wind",
  "smog",
  "cloud-sun",
  "cloud-moon",
  "cloud-sun",
  "cloud-moon",
  "cloud-rain",
  "cloud-sun-rain",
  "cloud-showers-heavy",
  "bolt",
  "snowflake",
  "smog",
  "wind",
  "smog",
  "smog",
  "smog",
  "smog",
  "smog",
];
</script>