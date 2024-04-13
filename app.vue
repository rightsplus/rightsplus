<template>
  <Html :lang="$i18n.locale">
    <Head>
      <Title>RightsPlus</Title>
    </Head>
    <Body class="antialiased text-gray-800" :class="$route.meta.classes?.body">
      <!-- <pre
        class="fixed z-[999] bg-white rounded m-1 py-0.5 px-1.5 shadow text-xs"
        >{{ $route.name?.toString() }}</pre
      > -->

      <NuxtPwaAssets />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>
<script setup lang="ts">
import { state } from "~/store";
const client = useSupabaseClient();
const app = useNuxtApp();
if (!app.$state) app.provide("state", reactive(state));
const route = useRoute();
// watch(currentRoute, (e) => console.log(e.fullPath, e.redirectedFrom, e.query))

// If you want to use it in setup, import from the nuxtApp.

onMounted(() => {
  if (app.$pwa?.offlineReady) {
    console.log("App ready to work offline");
  }
});
watch(
  () => route,
  (e) => {
    console.log(e.name?.toString());
  }
);
</script>
