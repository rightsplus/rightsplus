<template>
  <div class="flex flex-col gap-5">
    <span
      v-if="!potentialReimbursment"
      class="text-sm font-bold leading-tight flex flex-col gap-2"
      >Du hast möglicherweise keinen Anspruch auf Entschädigung.
      <span class="text-xs font-normal">{{ noClaims }}</span>
      <span class="text-xs font-normal"
        >Du kannst jedoch trotzdem mit der Fallprüfung fortfahren.
      </span>
      <button
        class="mt-5 bg-primary-500 hover:bg-primary-600 text-white h-10 rounded-lg text-sm font-medium"
        @click="reset"
      >
        Anderen Flug prüfen
      </button>
    </span>
    <span v-else class="flex flex-col gap-2 font-bold leading-tight"
      ><span>Du hast gute Aussichten auf <span class="tabular-nums tracking-tighter">{{ $n(youGet.number, "currency")
      }}</span></span><span class="text-xs font-normal"
        >Jetzt Prüfung vervollständigen!</span
      ></span
    >
    <!-- <ol class="pl-4 list-decimal text-sm">
			<li><b>Verjährt:</b> {{ status.barred?.label }}</li>
			<li><b>EU:</b> {{ status.europeanUnion?.label }}</li>
      <li><b>Distanz:</b> {{ status.distance?.label }}</li>
      <li><b>Gecancelt:</b> {{ status.cancelled?.label }}</li>
      <li><b>Mindestens 3h Verspätet:</b> {{ status.delayed?.label }}</li>
      <li><b>Außergewöhlicher Umstand:</b> {{ status.extraordinaryCirumstance?.label }}</li>
		</ol> -->
    <!-- <pre>{{ useClaim().value }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";

const status = computed(() => useFlightStatus(useClaim().value.flight));
const noClaims = computed(() => {
  if (status.value.barred?.value) return "Verjährt";
  if (!status.value.cancelled.value || !status.value.delayed.value)
    return "Weder Verspätung noch Ausfall";
  return false;
});
const potentialReimbursment = computed(() => {
  if (!status.value.cancelled.value && !status.value.delayed.value) return 0;
  const { value: eu } = status.value.europeanUnion;
  const { value: distance } = status.value.distance;
  return reimbursementByDistance(distance, eu.departure || eu.arrival, useClaim().value.client.passengerCount).youGet;
});
const youGet = reactive({
  number: potentialReimbursment.value,
});

const transform = (number: number) => ({
  duration: 0.5,
  ease: "expo",
  number,
})

watch(potentialReimbursment, (n) => {
  gsap.to(youGet, transform(n));
});

const reset = (e?: number) => {
  useClaim().value.airport.departure = null;
  useClaim().value.airport.arrival = null;
  useClaim().value.airport.layover = [];
  useClaim().value.flight = null;
  useClaim().value.step = 0;
};
</script>
