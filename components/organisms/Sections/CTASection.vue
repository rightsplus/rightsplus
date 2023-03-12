<template>
  <section
    class="py-24 bg-gradient-to-tr from-primary-700 to-primary-300 text-white relative"
  >
    <div
      class="grid gap-12 max-w-3xl mx-auto px-12 h-full relative z-1"
    >
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-6">
          <h2 class="text-4xl font-bold">
            Sichere dir deine verdiente Entschädigung
          </h2>
          <h3 class="text-xl font-medium">
            Mit unserer einfachen Online-Prüfung kannst du schnell und unkompliziert deine Entschädigungsansprüche prüfen. Und das Beste: Es ist kostenlos und unverbindlich.
          </h3>
        </div>
        <Button class="!bg-gray-800 hover:!bg-gray-900 mr-auto" @click="scrollToHash('#calculator')"
          >Jetzt Anspruch prüfen!</Button
        >
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
