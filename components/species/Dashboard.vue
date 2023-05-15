<template>
  <div class="flex flex-col gap-5">
    <h1
      class="text-4xl sm:text-7xl tracking-tighter leading-tight font-extrabold uppercase font-mono relative min-w-[700px]"
    >
      <ClientOnly>
        <template #fallback>
          {{ title[0] }}
        </template>
        <span v-for="(char, i) in titleASCII" :key="i">
          {{ transform(char) }}
        </span>
          <!-- {{ (char).toFixed() }} -->
      </ClientOnly>
    </h1>
    <span class="text-xl sm:text-2xl font-medium text-gray-500">{{
      subtitle
    }}</span>
  </div>
</template>

<script setup lang="ts">

const title = ["Flug verspätet oder annuliert?", "Jetzt Anspruch Prüfen!"]
const subtitle ="Mit RightsPlus setzen wir deine Ansprüche auf Entschädigung gemäß EU-Recht durch."

const animatedNumber = ref(0);

const key = ref(0);
const currentText = ref(title[0]);

const convertNumber = (value: number) => {
  let n = Number(value);

  if (value === 160) n = 33;
  if (value < 33) n = 50;
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
    setTimeout(incrementKey, 3000)
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
    return Math.floor(Math.random() * (90 - 65 + 1)) + 65;
  }
};
const transform = (value: number) => String.fromCharCode(randASCII(value));

const incrementKey = () => {
  if (key.value === title.length - 1) {
    key.value = 0;
  } else {
    key.value++;
  }
}
const convertUmlaut = (value: number) => {
  if (value === 196) return 65;
  if (value === 214) return 79;
  if (value === 220) return 85;
  if (value === 228) return 97;
  if (value === 246) return 111;
  if (value === 252) return 117;
  return value;
};
watch(
  () => key.value,
  (val) => {
    animatedNumber.value = 0;
    currentText.value = title[val];
    const max = currentText.value.split("").reduce((a, b) => {
      return convertUmlaut(b.charCodeAt(0)) > a
        ? convertUmlaut(b.charCodeAt(0))
        : a;
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
      const character = c.charCodeAt(0)
      const current = animatedNumber.value
      if (convertUmlaut(character) > current) return Math.random() * (character - current) + current
      if (convertUmlaut(character) <= current) return character
      return current
    });
});
</script>