<template>
  <div class="" v-if="weather?.temperature">
    <span class="font-bold text-xl">{{ $n(weather?.temperature, "celsius") }}</span>
		<!-- {{ $n(weather.gusts) }} km/h
		{{ $n(weather.wind) }} km/h -->
		Regen: {{ $n(weather.rain, 'mm') }}
		<!-- {{ $n(weather.rain, "precipitation") }}
		{{ $n(weather.snow, "precipitation") }}
		{{ $n(weather.clouds, "clouds") }} -->

  </div>
</template>

<script setup lang="ts">
defineProps<{
	weather: {
		time: string;
		temperature: number;
		gusts: number;
		wind: number;
		rain: number;
		snow: number;
		clouds: number;
	}
}>();
</script>

<style scoped></style>
