<template>
  <span v-if="youGet.number">Vergütung: <span class="tabular-nums tracking-tighter">{{
    $n(youGet.number, "currency")
  }}</span></span>
</template>

<script setup lang="ts">
import gsap from "gsap";
import { getDistance } from "@/composables/flight";
const processClaim = useProcessClaim()
const status = computed(() => useFlightStatus(useClaim().value.flight));
const potentialReimbursment = computed(() => {
  console.log(processClaim.value)
  if (!processClaim.value.eligible) return 0
  const distance = getDistance(useClaim().value);
  const delay = status.value.delayed.value;
  return reimbursementByDistance(
    distance,
    delay,
    useClaim().value.client.passengers.length
  ).youGet;
});
const youGet = reactive({
  number: potentialReimbursment.value
});

const transform = (number: number) => ({
  duration: 0.5,
  ease: "expo",
  number
});

watch(potentialReimbursment, n => {
  gsap.to(youGet, transform(n));
});

</script>
