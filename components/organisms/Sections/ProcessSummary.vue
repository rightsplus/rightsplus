<template>
  <section class="bg-neutral-100">
    <div
      class="grid gap-12 lg:grid-cols-2 max-w-7xl mx-auto p-5 sm:p-12 md:py-36 h-full relative z-1"
    >
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-6">
          <h2 class="text-3xl sm:text-5xl font-bold">
            In 3 Schritten deine Entschädigung sichern
          </h2>
          <h3 class="text-xl sm:text-2xl text-gray-500 font-medium">
            Mit RightsPlus setzen wir deine Ansprüche gemäß EU-Recht durch.
          </h3>
        </div>
        <Button class="!bg-gray-700 hover:!bg-gray-800 mr-auto" @click="scrollToHash('#calculator')"
          >Mehr erfahren</Button
        >
      </div>
      <div class="bg-white p-5 sm:p-12 rounded-2xl">
        <ol class="flex flex-col gap-8">
          <li v-for="item in process" :key="item.title" class="flex gap-5 items-center" :class="item.color">
            <ClientOnly><FontAwesomeIcon :icon="item.icon" /></ClientOnly>
            <div class="flex flex-col gap-1 leading-none">
              <span class="text-base leading-none text-gray-500">{{ item.description }}</span>
              <span class="font-bold text-gray-800">{{ item.title }}</span>
            </div>
          </li>
        </ol>
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
          icon: "circle-check",
          color: "text-green-500",
          title: "Entschädigungsanspruch prüfen",
          description: "Anhand von Flugnummer und Datum",
        },
        {
          icon: "file-pen",
          color: "text-blue-500",
          title: "Kontaktdaten eingeben",
          description: "Um den Anspruch geltend zu machen",
        },
        {
          icon: "money-bill-1-wave",
          color: "text-primary-500",
          title: "Entschädigung erhalten",
          description: "Innerhalb von 2 Wochen",
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
