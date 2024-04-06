<template>
  <section class="sm:py-24 bg-gray-200 relative">
    <img src="/images/mkjr_-8QsqXeJMvOU-unsplash.jpg" class="object-cover w-full h-full absolute inset-0 opacity-100 brightness-80 saturate-50" />
    <div
      class="grid gap-12 max-w-full sm:max-w-xl mx-auto p-5 sm:p-12 h-full relative z-1 bg-white sm:rounded-xl"
    >
      <div class="flex flex-col justify-around gap-4 leading-0 h-full">
        <h2 class="text-2xl sm:text-3xl font-bold">Entschädigungshöhe und Vergütung</h2>
        <p class="text-sm">
          Unsere Vergütung hängt von deiner Entschädigung ab. Wir bekommen nur
          Geld, wenn du auch eine Entschädigung bekommst. Das bedeutet, dass wir
          uns für dich einsetzen und motiviert sind, dir eine hohe Entschädigung
          zu sichern. So profitieren wir beide.
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <span
          class="uppercase tracking-wider text-yellow-800/70 font-bold"
          >Flugstrecke</span
        >
        <div class="grid grid-cols-3 gap-4">
          <ButtonLarge
            v-for="option in distances"
            :key="option.value"
            :name="option.label"
            @click="distance = option.value"
            :label="option.label"
            :preLabel="option.preLabel"
            :selected="distance === option.value"
          />
        </div>
        <div class="flex items-center duration-150" :class="{'opacity-0 pointer-events-none': distance !== 4000}">
        <FormKit type="checkbox" decorator-icon="check" id="withinEU" v-model="withinEU" />
        <label for="withinEU">Innerhalb der EU</label>
      </div>
      </div>
      <div class="flex gap-12 justify-between text-right">
        <div class="flex flex-col w-full sm:text-xl">
            <!-- {{ total }} -->
          <span class="text-base">Anspruch nach EU-Recht: <span class="font-bold tabular-nums tracking-tighter">{{
            $n(total.number, "currency", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}</span></span>
          <span class="text-base">Unsere Vergütung ({{$n(compensation.commission, 'percent')}}): <span class="font-bold tabular-nums tracking-tighter">{{
            $n(weGet.number * -1, "currency", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}</span></span>
          <span class="text-base" v-if="compensation.vatRate">Mehrwertsteuer ({{$n(compensation.vatRate, 'percent')}}): <span class="font-bold tabular-nums tracking-tighter">{{
            $n(vat.number * -1, "currency", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}</span></span>
          <span class="text-gray-500 font-medium text-base mt-5">Du erhältst</span>
          <span class="font-bold tabular-nums tracking-tighter text-4xl sm:text-5xl">{{
            $n(youGet.number, "currency", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import gsap from "gsap";
import ButtonLarge from "../Calculator/ButtonLarge.vue";

const distance = ref(2000);
const withinEU = ref(false)
const distances = ref([
  {
    preLabel: `weniger als`,
    label: useI18n().n(1500, 'km').replace(/\s/g, '\u00a0'),
    value: 1000,
  },
  {
    label: `${useI18n().n(1500)} – ${useI18n().n(3500, 'km').replace(/\s/g, '\u00a0')}`,
    value: 2000,
  },
  {
    preLabel: `mehr als`,
    label: useI18n().n(3500, 'km').replace(/\s/g, '\u00a0'),
    value: 4000,
  },
]);
const compensation = computed(() =>
  reimbursementByDistance(distance.value, undefined, withinEU.value)
);

const total = reactive({
  number: compensation.value.total,
});
const weGet = reactive({
  number: compensation.value.weGet,
});
const vat = reactive({
  number: compensation.value.vat,
});
const youGet = reactive({
  number: compensation.value.youGet,
});

const transform = (number: number) => ({
  duration: 1,
  ease: "expo",
  number,
})

watch(compensation, (n) => {
  gsap.to(total, transform(n.total));
  gsap.to(weGet, transform(n.weGet));
  gsap.to(vat, transform(n.vat));
  gsap.to(youGet, transform(n.youGet));
});
</script>
