<template>
  <NuxtLayout>
    <div
      class="w-full h-screen flex items-center justify-center flex-col gap-10"
    >
      <FontAwesomeIcon icon="meteor" class="text-4xl text-primary-500" />
      <div
        class="flex-col gap-2 flex items-center justify-center w-full max-w-24 mx-auto"
      >
        <h1 class="text-6xl font-bold">Oh no!</h1>
        <p class="text-gray-500">
          Sieht so aus als wäre hier was schief gelaufen.
        </p>
      </div>
      <div class="max-w-96 mx-auto p-5 w-full text-sm flex flex-col gap-5">
        <code
          v-html="error?.message"
          class="bg-neutral-100 rounded-xl p-3 flex"
        />
        <code
          v-html="error?.stack"
          class="bg-neutral-100 rounded-xl p-3 flex overflow-auto"
        />
      </div>
      <Button to="/" secondary>Zurück zur Startseite</Button>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Button from "@/components/core/Button.vue";
const error = useError();
onMounted(() => console.log(error.value?.stack));
</script>
