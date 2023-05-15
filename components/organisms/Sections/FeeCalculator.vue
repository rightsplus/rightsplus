<template>
  <section class="py-24 bg-gray-200 relative">
    <div
      class="grid gap-12 max-w-xl mx-auto p-5 sm:p-12 h-full relative z-1 bg-white sm:rounded-xl"
    >
      <div class="flex flex-col justify-around gap-4 leading-0 h-full">
        <h2 class="text-2xl font-medium">Entschädigungshöhe und Vergütung</h2>
        <p>
          Unsere Vergütung hängt von deiner Entschädigung ab. Wir bekommen nur
          Geld, wenn du auch eine Entschädigung bekommst. Das bedeutet, dass wir
          uns für dich einsetzen und motiviert sind, dir eine hohe Entschädigung
          zu sichern. So profitieren wir beide.
        </p>
      </div>
      <div class="flex flex-col gap-4">
      <span class="uppercase text-base tracking-wider font-medium text-gray-500">Entschädigungshöhe</span>
      <div class="grid grid-cols-3 gap-4">
        <button
          v-for="option in options"
          :key="option"
          @click="componsation = option"
          class="text-xl rounded-xl border border-1 border-gray-400 p-3 sm:p-5 hover:bg-neutral-100 font-bold tracking-tighter"
          :class="{ 'border-primary-500 border-2': componsation === option }"
        >
          {{ $n(option || 0, "currency") }}
        </button>
      </div>
      </div>
      <div class="flex gap-12 justify-between">
        <div class="flex flex-col">
          <span class="text-gray-500 font-medium text-base">Du erhältst</span>
          <span class="font-bold text-5xl tracking-tighter tabular-nums">{{
            $n(tweened.number, "currency", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}</span>
        </div>
        <!-- <div class="flex flex-col text-right">
          <span class="text-gray-500 font-medium text-base text"
            >Unsere Vergütung</span
          >
          <span class="font-bold text-5xl tracking-tighter">{{
            $n(compensation * 0.25, "currency")
          }}</span>
        </div> -->
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import Button from "@/components/molecules/Button.vue";
import gsap from 'gsap'
const options = ref([250, 400, 600])
const commission = 0.25
const componsation = ref(options.value[0])
const tweened = reactive({
  number: componsation.value
})
const compensation = (value: number) => Number(value) * (1 - commission) || 0
watch(componsation, (n) => {
  gsap.to(tweened, { duration: 1, ease: 'expo', number: compensation(n) })
})
</script>