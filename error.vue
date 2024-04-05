<template>
  <NuxtLayout>
    <div
      class="w-full h-screen flex items-center justify-center flex-col gap-10"
    >
      <FontAwesomeIcon
        icon="plane-circle-xmark"
        class="text-4xl text-primary-500"
      />
      <div class="flex-col gap-1 flex items-center justify-center w-full p- max-w-24 mx-auto">
        <h1 class="text-6xl font-bold">Oh no!</h1>
        <p class="text-gray-500">
          Sieht so aus als wäre hier was schief gelaufen.
        </p>
        <code v-html="message" class="w-full" />
      </div>
      <NuxtLink to="/" class="text-primary-500">Zurück zur Startseite</NuxtLink>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const message = computed(() => useError().value?.message);
</script>
