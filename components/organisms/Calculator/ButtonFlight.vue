<template>
  <FlightCard :flight="flight" is="button" @click="emit('click', flight)" />
</template>

<script setup lang="ts">
import type { Flight } from "@/types";
import FlightCard from "~/components/cells/FlightCard.vue";

defineProps<{
  flight: Flight;
  selected?: boolean;
}>();

const emit = defineEmits(["click"]);
</script>
