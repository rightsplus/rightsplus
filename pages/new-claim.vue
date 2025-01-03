<script setup lang="ts">
import ClaimsCalculator from "@/components/organisms/Calculator/ClaimsCalculator.vue";

definePageMeta({
  title: "Ansprüche berechnen",
  layout: false,
  pageTransition: {
    name: "layout",
    mode: "out-in",
  },
});
</script>
<template>
  <div>
    <NuxtLayout name="claims">
      <section class="min-h-screen bg-neutral-200">
        <div
          class="max-w-7xl mx-auto sm:px-12 h-full relative z-1 mt-20 sm:mt-28 md:mt-8"
        >
          <ClaimsCalculator />
        </div></section
    ></NuxtLayout>
  </div>
</template>
