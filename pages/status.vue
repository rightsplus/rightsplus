<template>
  <div class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
        <div class="flex flex-col gap-12">
          <h1 class="text-6xl font-extrabold">Der Status deiner Forderung</h1>
          <FlightResult v-if="claims?.[0]?.flight" :flight="claims[0].flight"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FlightResult from '~~/components/organisms/Calculator/FlightResult.vue';

const user = useSupabaseUser();

definePageMeta({
  middleware: ["auth"],
});

onMounted(() => {
  watchEffect(() => {
    if (!user.value) navigateTo("/login");
  });
});
const { data: claims } = await useFetch("/api/claims", {
  headers: useRequestHeaders(["cookie"]),
});
</script>

<style scoped></style>
