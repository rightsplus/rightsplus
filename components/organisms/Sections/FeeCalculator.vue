<template>
  <section class="sm:py-24 bg-gray-200 relative">
    <img src="/airfield.jpg" class="object-cover w-full h-full absolute inset-0 opacity-50" />
    <div
      class="grid gap-12 max-w-full sm:max-w-xl mx-auto p-5 sm:p-12 h-full relative z-1 bg-white sm:rounded-xl"
    >
      <div class="flex flex-col justify-around gap-4 leading-0 h-full">
        <h2 class="text-2xl sm:text-3xl font-medium">Entschädigungshöhe und Vergütung</h2>
        <p class="text-sm">
          Unsere Vergütung hängt von deiner Entschädigung ab. Wir bekommen nur
          Geld, wenn du auch eine Entschädigung bekommst. Das bedeutet, dass wir
          uns für dich einsetzen und motiviert sind, dir eine hohe Entschädigung
          zu sichern. So profitieren wir beide.
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <span
          class="uppercase text-base tracking-wider font-medium text-gray-500"
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
        <div class="grid gap-4 duration-500" :class="{'opacity-0': distance <= 3500}">
          <FormKit
            v-model="withinEU"
            type="checkbox"
            decorator-icon="check"
            :required="true"
            ><template #label
              ><span class="text-sm leading-none">
                Start <strong>und</strong> Landung innerhalb der EU</span
              ></template
            >
          </FormKit>
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
          <span class="text-base">Unsere Vergütung ({{$n(commission, 'percent')}}): <span class="font-bold tabular-nums tracking-tighter">{{
            $n(weGet.number * -1, "currency", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}</span></span>
          <span class="text-base">Mehrwertsteuer ({{$n(vatRate, 'percent')}}): <span class="font-bold tabular-nums tracking-tighter">{{
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

const commission = 0.25;
const vatRate = 0.19;
const distance = ref(1000);
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
const withinEU = ref(false);
const compensation = computed(() =>
  reimbursementByDistance(distance.value, withinEU.value)
);
const compensate = (value: number, reduce: number) =>
  Number(value) * reduce || 0;

const total = reactive({
  number: compensate(compensation.value, 1),
});
const weGet = reactive({
  number: compensate(compensation.value, commission),
});
const vat = reactive({
  number: compensate(compensation.value, commission) * vatRate,
});
const youGet = reactive({
  number: compensate(compensation.value, 1 - commission) - compensate(compensation.value, commission) * vatRate,
});

watch(compensation, (n) => {
  gsap.to(total, {
    duration: 1,
    ease: "expo",
    number: compensate(n, 1),
  });
});
watch(compensation, (n) => {
  gsap.to(weGet, {
    duration: 1,
    ease: "expo",
    number: compensate(n, commission),
  });
});
watch(compensation, (n) => {
  gsap.to(vat, {
    duration: 1,
    ease: "expo",
    number: compensate(n, commission) * vatRate,
  });
});
watch(compensation, (n) => {
  gsap.to(youGet, {
    duration: 1,
    ease: "expo",
    number: compensate(n, 1 - commission) - compensate(n, commission) * vatRate,
  });
});
</script>
