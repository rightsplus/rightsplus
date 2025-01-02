<template>
  <div class="">
    <div class="flex flex-col gap-3">
      <span class="uppercase tracking-wider text-yellow-800/70 font-bold">{{
        t("flightRoute")
      }}</span>
      <div
        :class="cn('grid gap-4', stackButtons ? 'grid-rows-3' : 'grid-cols-3')"
      >
        <ButtonLarge
          v-for="option in distances"
          :key="option.value"
          :name="option.label"
          @click="distance = option.value"
          :label="option.label"
          :prelabel="option.prelabel"
          :selected="distance === option.value"
          class="bg-yellow-800/5 hover:bg-yellow-800/10 hover:border-yellow-800/5"
        />
      </div>
      <div
        class="flex items-center duration-150"
        :class="{ 'opacity-0 pointer-events-none': distance !== 4000 }"
      >
        <FormKit
          type="checkbox"
          decorator-icon="check"
          id="withinEU"
          v-model="withinEU"
        />
        <label for="withinEU">{{ t("withinEU") }}</label>
      </div>
    </div>
    <div class="flex gap-12 justify-between text-right">
      <div class="flex flex-col w-full">
        <!-- {{ total }} -->
        <span
          >{{ t("claimEU") }}:
          <span class="font-bold tabular-nums tracking-tighter">{{
            n(total.number, "currency", options)
          }}</span></span
        >
        <span
          >{{ t("ourCommission") }} ({{
            n(compensation.commission, "percent")
          }}):
          <span class="font-bold tabular-nums tracking-tighter">{{
            n(weGet.number * -1, "currency", options)
          }}</span></span
        >
        <span v-if="compensation.vatRate"
          >{{ t("vat") }} ({{ n(compensation.vatRate, "percent") }}):
          <span class="font-bold tabular-nums tracking-tighter">{{
            n(vat.number * -1, "currency", options)
          }}</span></span
        >
        <span class="text-gray-500 font-medium text-base mt-5">{{
          t("youGet")
        }}</span>
        <span
          class="font-bold tabular-nums tracking-tighter text-xl sm:text-2xl"
          >{{ n(youGet.number, "currency", options) }}</span
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import gsap from "gsap";
import ButtonLarge from "./Calculator/ButtonLarge.vue";
defineProps<{ stackButtons?: boolean }>();
const distance = ref(2000);
const withinEU = ref(false);
const { t, n } = useI18n();
const distances = ref([
  {
    prelabel: t("lessThan").trim(),
    label: n(1500, "km").replace(/\s/g, "\u00a0"),
    value: 1000,
  },
  {
    label: `${n(1500)} – ${n(3500, "km").replace(/\s/g, "\u00a0")}`,
    value: 2000,
  },
  {
    prelabel: t("moreThan").trim(),
    label: n(3500, "km").replace(/\s/g, "\u00a0"),
    value: 4000,
  },
]);
const options = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};
const compensation = computed(() => {
  return compensationByDistance({
    distance: distance.value,
    withinEU: withinEU.value,
  });
});

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
});

watch(compensation, (n) => {
  gsap.to(total, transform(n.total));
  gsap.to(weGet, transform(n.weGet));
  gsap.to(vat, transform(n.vat));
  gsap.to(youGet, transform(n.youGet));
});
</script>
