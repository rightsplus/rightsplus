<template>
  <div class="flex flex-col gap-5">
    <span v-if="noClaims" class="font-bold leading-tight">Du hast voraussichtlich keinen Anspruch auf Entschädigung ({{ noClaims }})</span>
    <span v-else class="font-bold leading-tight">Du hast gute Aussichten auf {{ $n(potentialReimbursment, 'currency') }}</span>
		<ol class="pl-4 list-decimal text-sm">
			<li><b>Verjährt:</b> {{ barred ? `Ja (${barred})` : "Nein" }}</li>
			<li><b>Abflug in EU:</b> {{ euLabel(airport.departure?.country) }}</li>
      <li><b>Landung in EU:</b> {{ euLabel(airport.arrival?.country) }}</li>
      <li><b>Fluggesellschaft in EU:</b> {{ airline?.isEuMember ? "Ja" : `Nein (${airline?.country})` }}</li>
      <li><b>Distanz:</b> {{ $n(distance || 0, "km") }}</li>
      <li><b>Mindestens 3h Verspätet:</b> {{ ($state.claims.flight?.departure.delay || 0) / 60 > 3 ? `Ja (${$state.claims.flight?.departure.delay} min)` : `Nein (${$state.claims.flight?.departure.delay} min)` }}</li>
      <li><b>Außergewöhlicher Umstand:</b> ?</li>
		</ol>
      <!-- <pre>{{ $state.claims }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import { isEuMember } from "is-eu-member";

const barred = computed(() =>{
	// @todo better to use arrival date
	const d = useAppState().claims?.flight_date
	const date = d && new Date(d).getFullYear() || Infinity
	return new Date().getFullYear() - date > 3 && date
})
const euLabel = (country: string) => {
	return country && isEuMember(country) ? `Ja (${country})` : `Nein (${country})`;
}
const distance = computed(() => useAppState().claims.flight?.distance || 0)
const airport = computed(() => useAppState().claims?.airport)
const airlines = ref({} as Record<string, any>)
const airline = computed(() => {
	const { iata } = useAppState().claims.flight?.airline || {}
	return iata && airlines.value[iata]
})
const noClaims = computed(() => {
	if (barred.value) return 'Verjährt'
	if (!isEuMember(airport.value.departure?.country) && !isEuMember(airport.value.arrival?.country) && !airline.value?.isEuMember) return 'Nicht EU'
	if ((useAppState().claims.flight?.departure.delay || 0) / 60 < 3) return 'Kein Verspätung'
	return false
})
const potentialReimbursment = computed(() => {
	let claims = 250
	const withinEU = euLabel(airport.value.departure?.country) && euLabel(airport.value.arrival?.country)
	if (distance.value > 1500) claims = 400
	if (distance.value > 3500 && !withinEU) claims = 400
	return claims
})
onMounted(() => {
	fetch("api/airlines-aviation-edge.json")
		.then((data) => data.json())
		.then((data) => {
			console.log(data)
			airlines.value = data.reduce((acc, cur) => {
				acc[cur.codeIataAirline] = {
					// ...cur,
					name: cur.nameAirline,
					nameCountry: cur.nameCountry,
					country: cur.codeIso2Country,
					iata: cur.codeIataAirline,
					isEuMember: isEuMember(cur.codeIso2Country),
				};
				return acc;
			}, {})
		})

})
</script>