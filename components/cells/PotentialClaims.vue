<template>
  <div class="flex flex-col gap-5">
    <span v-if="noClaims" class="font-bold leading-tight">Du hast voraussichtlich keinen Anspruch auf Entschädigung ({{ noClaims }})</span>
    <span v-else class="font-bold leading-tight">Du hast gute Aussichten auf {{ $n(potentialReimbursment, 'currency') }}</span>
		<ol class="pl-4 list-decimal text-sm">
			<li><b>Verjährt:</b> {{ status.barred?.label }}</li>
			<li><b>EU:</b> {{ status.europeanUnion?.label }}</li>
      <li><b>Distanz:</b> {{ status.distance?.label }}</li>
      <li><b>Gecancelt:</b> {{ status.cancelled?.label }}</li>
      <li><b>Mindestens 3h Verspätet:</b> {{ status.delayed?.label }}</li>
      <li><b>Außergewöhlicher Umstand:</b> {{ status.extraordinaryCirumstance?.label }}</li>
		</ol>
      <!-- <pre>{{ $state.claims }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import { euMember } from "is-european";

const status = computed(() => useFlightStatus(useAppState().claims.flight))
const noClaims = computed(() => {
	if (status.value.barred?.value) return 'Verjährt'
	return false
})
const potentialReimbursment = computed(() => {
	let claims = 250
	const { value: eu } = status.value.europeanUnion
	const { value: distance } = status.value.distance
	const withinEU = eu.airline || eu.departure
	if (distance > 1500) claims = 400
	if (distance > 3500 && !withinEU) claims = 400
	return claims
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
</script>