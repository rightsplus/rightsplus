<template>
  <div class="flex flex-col gap-5">
    <h1
      class="text-4xl sm:text-6xl md:text-7xl tracking-tighter leading-tight font-extrabold uppercase font-mono relative max-w-[300px] sm:max-w-[640px] lg:max-w-full lg:min-w-[700px]"
    >
      <ClientOnly>
        <template #fallback>
          {{ title[1] }}
        </template>
        <span v-for="(char, i) in titleASCII" :key="i">
          {{ transform(char) }}
        </span>
      </ClientOnly>
    </h1>
    <span class="text-xl sm:text-2xl font-medium opacity-100">{{
      subtitle
    }}</span>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const title = computed(() => [
  t("flightDelayedOrCancelled"),
  t("checkCompensationNow"),
]);
const subtitle = computed(() =>
  t("fightingForYourRights", { partner: "RightsPlus" })
);

const animatedNumber = ref(0);

const key = ref(0);
const currentText = ref(title.value[0]);

const convertNumber = (value: number) => {
  let n = Number(value);

  if (value === 160) n = 33;
  if (value < 33) n = 50;
  if (value > 128 && value < 255) n = Number(value);
  if (value > 90 && value < 192) n = 192;

  return n;
};

const animateNumber = async (number: { value: number }, target: number) => {
  number.value = convertNumber(number.value);
  number.value += 1;
  if (number.value < target) {
    try {
      requestAnimationFrame(() =>
        setTimeout(() => animateNumber(number, target), number.value / 2)
      );
    } catch {}
  } else {
    setTimeout(incrementKey, 3000);
  }
};

const randASCII = (value: number) => {
  if (
    (value >= 32 && value <= 39) ||
    value === 44 ||
    value === 46 ||
    value === 47 ||
    value === 58 ||
    value === 59 ||
    value === 63 ||
    (value >= 65 && value <= 90) ||
    (value >= 97 && value <= 122) ||
    (value >= 192 && value <= 687)
  ) {
    return value;
  } else {
    return Math.floor(Math.random() * (122 - 97 + 1)) + 97;
  }
};

const transform = (value: number) => String.fromCharCode(randASCII(value));

const incrementKey = () => {
  if (key.value === title.value.length - 1) {
    key.value = 0;
  } else {
    key.value++;
  }
};
const normalize = (value: number) => {
  const normalized = String.fromCharCode(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  return normalized.charCodeAt(0);
};

watch(
  () => key.value,
  (val) => {
    animatedNumber.value = 0;
    currentText.value = title.value[val];
    const max = currentText.value.split("").reduce((a, b) => {
      return normalize(b.charCodeAt(0)) > a ? normalize(b.charCodeAt(0)) : a;
    }, 0);
    animateNumber(animatedNumber, max);
  },
  {
    immediate: true,
  }
);

const titleASCII = computed(() => {
  return currentText.value
    .toUpperCase()
    .split("")
    .map((c) => {
      const character = c.charCodeAt(0);
      const current = animatedNumber.value;
      if (normalize(character) > current)
        return Math.random() * (character - current) + current;
      if (normalize(character) <= current) return character;
      return current;
    });
  // return currentText.value
  //   .toUpperCase()
  //   .split("")
  //   .map((c) => {
  //     const character = c.charCodeAt(0);
  //     const current = animatedNumber.value;
  //     if (normalize(character) > current)
  //       return Math.random() * (character - current) + current;
  //     if (normalize(character) <= current) return character;
  //     return current;
  //   });
});
</script>
