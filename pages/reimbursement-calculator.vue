<template>
  <section class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full max-w-[720px] mx-auto">
        <div class="flex flex-col gap-5">
          <ReimbursementCalculator />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Button from "@/components/molecules/Button.vue";
import ReimbursementCalculator from "@/components/organisms/Calculator/ReimbursementCalculator.vue";
export default defineComponent({
  components: {
    Button,
    ReimbursementCalculator
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
    this.$state.headerColor = "dark"
  },
  unmounted() {
    this.$state.headerColor = null
  },
});
</script>

<style scoped></style>
