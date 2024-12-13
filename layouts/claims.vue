<template>
  <div class="flex flex-col">
    <Header class="w-full z-50" />
    <div
      class="min-h-screen md:p-12 bg-neutral-200 mx-auto w-full block md:flex gap-8"
    >
      <!-- <CellsSidebarMenu :user="user" :items="menu" /> -->
      <main class="w-full" :class="$route.meta.classes?.main">
        <!-- <h1 class="text-3xl">{{ $route.meta.title }}</h1> -->
        <!-- <hr class="my-12 w-full border-t border-neutral-300" /> -->
        <slot />
      </main>
    </div>
    <Footer class="w-full mt-auto" />
  </div>
</template>

<script lang="ts" setup>
import Header from "@/components/species/Header.vue";
import Footer from "@/components/species/Footer.vue";
</script>
