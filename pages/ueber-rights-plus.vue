<template>
  <section class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
        <div class="flex flex-col gap-5">
          <h1 class="text-6xl font-extrabold">
            HUHU
          </h1>
          <span class="text-3xl font-medium text-gray-500">
            {{ $route.meta.description }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Button from "~/components/molecules/Button.vue";
export default defineComponent({
  components: {
    Button,
  },
  setup() {
    definePageMeta({
      title: "Angebote",
      description:
        "Hier wirst du deinen Weg finden und kannst im Wald oder mit den Pferden einen Prozess der Heilung zu beginnen.",
    });

    return {};
  },
  data() {
    return {
      featured: [],
    };
  },
  async mounted() {
    this.$state.headerColor = "dark";
  },
  unmounted() {
    this.$state.headerColor = null;
  },
  methods: {
    ucFirstAll(string: string) {
      return string.replaceAll('-', ' ').replaceAll("faq", "FAQ").replaceAll('ue', 'ü').replaceAll('ae', 'ä').replaceAll('oe', 'ö').split(" ").map((word) => this.ucfirst(word)).join(" ").replaceAll("Rights Plus", "RightsPlus");
    },
    ucfirst(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
});
</script>

<style scoped></style>
