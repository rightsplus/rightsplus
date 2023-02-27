<template>
  <section class="py-24 bg-neutral-200 relative">
    <img
      src="/airport-light-comp.jpg"
      alt="Airport"
      class="absolute inset-0 h-full max-h-screen w-full object-cover object-right -z-1 hidden lg:block"
    />
    <div class="max-w-7xl mx-auto px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full md:w-1/2">
        <div class="flex flex-col gap-6">
          <h3
            class="text-xl text-green-600 font-medium uppercase tracking-wider"
          >
            Deine Rechte
          </h3>
          <h2 class="text-5xl font-bold">
            Wann bekomme ich eine Entschädigung?
          </h2>
        </div>
        <ol class="flex flex-col gap-8">
          <li
            v-for="item in process"
            :key="item.title"
            class="flex gap-5 items-center"
          >
            <ClientOnly
              ><FontAwesomeIcon :icon="item.icon" :class="item.color"
            /></ClientOnly>
            <div class="flex flex-col gap-1 leading-none">
              <span class="font-medium">{{ item.title }}</span>
            </div>
          </li>
        </ol>
        <div class="flex gap-5 items-center text-gray-500">
          <ClientOnly><FontAwesomeIcon icon="meteor" /></ClientOnly>
          <span class="flex flex-col gap-1 leading-none font-medium"
            >Ausnahmen möglich bei Verspätung aufgrund außergewöhnlicher
            Umstände</span
          >
        </div>
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
      page: null,
      process: [
        {
          icon: "plane-circle-xmark",
          color: "text-green-600",
          title:
            "Entschädigung deckt Verspätungen, Annullierungen und verweigerte Beförderungen ab",
        },
        {
          icon: "clock",
          color: "text-green-600",
          title:
            "Gilt für Verspätung von mindestens 2-3 Stunden (abhängig von Flugdistanz)",
        },
        {
          icon: "globe-europe",
          color: "text-green-600",
          title:
            "Flug muss innerhalb der EU starten oder landen oder der Flugbetreiber muss in der EU ansässig sein",
        },
        {
          icon: "calendar",
          color: "text-green-600",
          title: "Anspruch kann für die letzten 3 Jahre geltend gemacht werden",
        },
      ],
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
