<template>
  <div class="flex flex-col">
    <Header class="w-full z-50 absolute" />
    <main
      class="min-h-screen py-48 max-w-4xl mx-auto w-full"
      :class="$route.meta.classes?.main"
    >
      <div class="px-5 sm:px-12 h-full">
        <article class="flex flex-col gap-12">
          <div class="flex flex-col gap-3 leading-0">
          <slot name="before" />
            <span
              class="uppercase tracking-wider text-primary-500 font-bold"
              v-if="$route.meta.category"
              >{{ $t($route.meta.category) }}</span
            >
            <h1
              class="text-4xl sm:text-6xl font-extrabold hyphens-auto break-words text-balance"
              v-if="$route.meta.title"
            >
              {{ $t($route.meta.title) }}
            </h1>
            <span
              class="text-2xl sm:text-3xl font-medium text-neutral-500"
              v-if="$route.meta.lead"
            >
              {{ $t($route.meta.lead) }}
            </span>
          </div>
          <slot />
        </article>
      </div>
    </main>
    <Footer class="w-full mt-auto" />
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/species/Header.vue";
import Footer from "@/components/species/Footer.vue";
onMounted(() => scrollTo({ top: 0, behavior: "smooth" }));
</script>
