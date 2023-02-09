<template>
  <section class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <img src="/airport-light-comp.jpg" alt="Airport" class="absolute inset-0 h-full max-h-screen w-full object-cover object-right -z-1 hidden lg:block" />
    <div class="max-w-7xl mx-auto px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
        <div class="flex flex-col gap-5">
          <h1 class="text-6xl font-extrabold">
            Flug verspätet oder annuliert?
          </h1>
          <span class="text-3xl font-medium text-gray-500"
            >Mit RightsPlus setzen wir deine Ansprüche auf Entschädigung gemäß
            EU-Recht durch.</span
          >
        </div>
        <ReimbursementCalculator />
        <ScrollDown class="mt-auto"/>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import Button from "~/components/molecules/Button.vue";
import Arrow from "~/components/molecules/Arrow.vue";
import ReimbursementCalculator from "~~/components/organisms/Calculator/ReimbursementCalculator.vue";
import ScrollDown from "~/components/cells/ScrollDown.vue";

export default defineComponent({
  components: {
    Button,
    Arrow,
    Event,
    ReimbursementCalculator,
    ScrollDown
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
