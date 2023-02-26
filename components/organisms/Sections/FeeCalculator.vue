<template>
  <section class="py-24 bg-gray-200 relative">
    <div
      class="grid gap-12 max-w-xl mx-auto p-12 h-full relative z-1 bg-white rounded-xl"
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
      <div class="grid grid-cols-3 gap-6">
        <button
          v-for="option in options"
          :key="option"
          @click="compensation = option"
          class="text-xl rounded-xl border border-1 border-gray-400 p-6 hover:bg-neutral-100 font-bold tracking-tighter"
          :class="{ 'border-primary-500 border-2': compensation === option }"
        >
          {{ $n(option, "currency") }}
        </button>
      </div>
      </div>
      <div class="flex gap-12 justify-between">
        <div class="flex flex-col">
          <span class="text-gray-500 font-medium text-base">Du erhältst</span>
          <span class="font-bold text-5xl tracking-tighter">{{
            $n(compensation * 0.75, "currency")
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
<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/molecules/Button.vue";

export default defineComponent({
  components: {
    Button,
  },
  data() {
    return {
      compensation: 250,
      options: [250, 400, 600],
    };
  },
  methods: {
    scrollToHash(hash: string) {
      document.querySelector(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
  },
});
</script>
<style scoped>
.green:after {
  opacity: 0;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: hard-light;
  background-size: cover;
  transition: 2s;
}
.show-green:after {
  opacity: 1;
}
</style>
