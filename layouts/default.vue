<template>
  <div class="flex flex-col">
    <Header class="w-full z-50 absolute" />
    <main class="min-h-screen">
      <slot />
    </main>
    <Footer class="w-full mt-auto" />
  </div>
</template>

<script lang="ts" setup>
import Header from "@/components/species/Header.vue";
import Footer from "@/components/species/Footer.vue";
</script>
