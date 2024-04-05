<template>
  <section class="min-h-screen pt-20 sm:pt-36 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto sm:px-12 h-full relative z-1">
      <ClaimsCalculator />
    </div>
  </section>
</template>

<script setup lang="ts">
import ClaimsCalculator from "@/components/organisms/Calculator/ClaimsCalculator.vue";

definePageMeta({
  title: "Ansprüche berechnen",
  description: ""
});
onMounted(() => {
  useAppState().headerColor = "dark";
});
onBeforeUnmount(() => {
  useAppState().headerColor = null;
});
</script>
