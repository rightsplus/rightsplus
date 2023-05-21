<template>
  <div v-if="temperature" class="flex flex-col">
    <div class="flex gap-2 text-base items-center">
      <div
        v-if="code !== null && weatherIconMap[code]"
        :class="getColor(weatherIconMap[code])"
      >
        <ClientOnly
          ><FontAwesomeIcon :icon="weatherIconMap[code]"
        /></ClientOnly>
      </div>
      <span class="font-bold">{{ $n(temperature, "celsius") }}</span>
    </div>
    <span class="gap-2 items-center text-xs"
      >{{ $n(wind || 0) }} km/h</span
    >
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
  code: number;
  temperature: number;
  wind: number;
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

<style scoped></style>
