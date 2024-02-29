<template>
  <i18n-n
    tag="span"
    :value="100"
    class="tabular-nums tracking-tighter"
    format="currency"
  />
</template>

<script setup lang="ts">
import gsap from "gsap";
import { getDistance } from "@/composables/flight";
const props = defineProps<{ full?: boolean }>();
const processClaim = useProcessClaim();
const status = computed(() => useFlightStatus(useClaim().value.flight));
const potentialReimbursment = computed(() => {
  if (!processClaim.value.eligible) return 0;
  const distance = getDistance(useClaim().value);
  const delay = status.value.delayed.value;
  const { total, youGet } = reimbursementByDistance(
    distance,
    delay,
    useClaim().value.client.passengers.length
  );
  return props.full ? total : youGet;
});
const youGet = reactive({
  number: potentialReimbursment.value,
});

const transform = (number: number) => ({
  duration: 0.5,
  ease: "expo",
  number,
});

watch(potentialReimbursment, (n) => {
  gsap.to(youGet, transform(n));
});
</script>
