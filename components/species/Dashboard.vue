<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-4xl sm:text-6xl tracking-tighter leading-tight font-extrabold uppercase font-mono relative">
      <ClientOnly>
        <template #fallback>
          {{title[0]}}
        </template>
        <span v-for="char, i in titleASCII" :key="i" class="dashed">
          {{ transform(char) }}
        </span>
      </ClientOnly>
    </h1>
    <span class="text-xl sm:text-2xl font-medium text-gray-500"
      >{{ subtitle }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  data() {
    return {
      animatedNumber: {
        value: 160,
      },
      key: 0,
      currentText: this.title[0]
    };
  },
  props: {
    title: {
      type: Array as PropType<string[]>,
      default: () => ["Flug verspätet oder annuliert?", "Jetzt Anspruch Prüfen!"],
    },
    subtitle: {
      type: String,
      default: "Mit RightsPlus setzen wir deine Ansprüche auf Entschädigung gemäß EU-Recht durch.",
    },
  },
  methods: {
    animateNumber(number: { value: number }, target: number) {
      if (number.value === 160) number.value = 33;
      if (number.value < 65) number.value = 65;
      if (number.value > 90 && number.value < 192) number.value = 192;
      number.value += 1;
      if (number.value < target) {
        try {
        requestAnimationFrame(() =>
          setTimeout(() => this.animateNumber(number, target), 100)
        );
        } catch {}
      }
      return number.value;
    },
    randASCII(value: number) {
      if (
				(value >= 32 && value <= 39) ||
        (value === 44) ||
        (value === 46) ||
        (value === 47) ||
        (value === 58) ||
        (value === 59) ||
        (value === 63) ||
        (value >= 65 && value <= 90) ||
        (value >= 97 && value <= 122) ||
        (value >= 192 && value <= 687)
      ) {
        return value;
      } else {
        const randomCharCode = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
        return randomCharCode;
      }
    },
    transform(value: number) {
      return String.fromCharCode(this.randASCII(value));
    },
  },
  mounted() {
    setInterval(() => {
      this.key = this.key ? 0 : 1;
    }, 5000);
  },
  watch: {
    key: {
      handler(val) {
        this.animatedNumber.value = 160;
        this.currentText = this.title[val];
        this.animateNumber(this.animatedNumber, 300);
      },
      immediate: true,
    },
  },
  computed: {
    titleASCII() {
      return this.currentText
        .toUpperCase()
        .split("")
        .map((c) => Math.min(this.animatedNumber.value, c.charCodeAt(0)));
    },
  },
});
</script>

<style scoped>
.dashed {
  /* position: relative; */
  /* clip-path: path('M 0 -10 H 100 v 47.5 H 0 Z M 0 39.5 H 100 v 40 H 0 Z'); */
}</style>
