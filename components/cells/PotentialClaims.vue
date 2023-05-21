<template>
  <div class="flex flex-col gap-5">
    <span v-if="!potentialReimbursment" class="text-sm font-bold leading-tight flex flex-col gap-2">Du hast möglicherweise keinen Anspruch auf Entschädigung.
		<span class="text-xs font-normal">{{ noClaims }}</span>
		<span class="text-xs font-normal">Du kannst jedoch trotzdem mit der Fallprüfung fortfahren. </span>
		<button class="mt-5 bg-primary-500 hover:bg-primary-600 text-white h-10 rounded-lg text-sm font-medium" @click="reset">Anderen Flug prüfen</button>
		</span>
    <span v-else class="flex flex-col gap-2 font-bold leading-tight">Du hast gute Aussichten auf {{ $n(potentialReimbursment, 'currency') }}<span class="text-xs font-normal">Jetzt Prüfung vervollständigen!</span></span>
		<!-- <ol class="pl-4 list-decimal text-sm">
			<li><b>Verjährt:</b> {{ status.barred?.label }}</li>
			<li><b>EU:</b> {{ status.europeanUnion?.label }}</li>
      <li><b>Distanz:</b> {{ status.distance?.label }}</li>
      <li><b>Gecancelt:</b> {{ status.cancelled?.label }}</li>
      <li><b>Mindestens 3h Verspätet:</b> {{ status.delayed?.label }}</li>
      <li><b>Außergewöhlicher Umstand:</b> {{ status.extraordinaryCirumstance?.label }}</li>
		</ol> -->
      <!-- <pre>{{ $state.claims }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import { euMember } from "is-european";

const status = computed(() => useFlightStatus(useAppState().claims.flight))
const noClaims = computed(() => {
	if (status.value.barred?.value) return 'Verjährt'
	if (!status.value.cancelled.value || !status.value.delayed.value) return "Weder Verspätung noch Ausfall"
	return false
})
const potentialReimbursment = computed(() => {
	if (!status.value.cancelled.value && !status.value.delayed.value) return 0
	const { value: eu } = status.value.europeanUnion
	const { value: distance } = status.value.distance
	return reimbursementByDistance(distance, eu.departure || eu.arrival)
})
onMounted(() => {
	fetch("api/airlines-aviation-edge.json")
		.then((data) => data.json())
		.then((data) => {
			console.log(data)
			useAirlines().value = data.reduce((acc, cur) => {
				acc[cur.codeIataAirline] = {
					// ...cur,
					name: cur.nameAirline,
					nameCountry: cur.nameCountry,
					country: cur.codeIso2Country,
					iata: cur.codeIataAirline,
					isEuMember: euMember(cur.codeIso2Country),
				};
				return acc;
			}, {})
		})

})

const reset = (e?: number) => {
	useAppState().claims.airport.departure = null
	useAppState().claims.airport.arrival = null
	useAppState().claims.airport.layover = []
	useAppState().claims.flight = null
  useAppState().claims.step = 0;
}
</script>