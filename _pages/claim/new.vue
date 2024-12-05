<template>
  <section class="min-h-screen pt-20 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto sm:px-12 h-full relative z-1">
      <ClientOnly><ClaimsCalculator /></ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import ClaimsCalculator from "@/components/organisms/Calculator/ClaimsCalculator.vue";

definePageMeta({
  title: "Ansprüche berechnen",
  pageTransition: {
    name: "layout",
    mode: "out-in",
  }
});
</script>
