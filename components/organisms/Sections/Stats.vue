<template>
  <section class="py-24 relative" v-bind="$attrs">
    <div class="grid gap-12 max-w-7xl mx-auto px-12 h-full relative z-1">
      <div class="flex justify-around gap-12 leading-0 h-full">
        <div v-for="(stat, i) in stats" class="flex flex-col gap-2 items-center">
          <span class="text-6xl font-bold">
            {{ stat.title }}
          </span>
          <p class="text-lg text-gray-300 font-medium">
            {{ stat.description }}
          </p>
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
      stats: [
        {
          title: "400+",
          description: `Fälle bearbeitet`,
        },
        {
          title: "€25k",
          description: `in Entschädigungen erkämpft`,
        },
        {
          title: "98%",
          description: `Erfolgsquote`,
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
