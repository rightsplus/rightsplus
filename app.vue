<template>
  <Html :lang="$i18n.locale">
    <Head>
      <Title>RightsPlus</Title>
    </Head>
    <Body class="antialiased text-gray-800" :class="$route.meta.classes?.body">
      <NuxtPwaAssets />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>
<script setup lang="ts">
import { state } from "~/store";
const app = useNuxtApp();
if (!app.$state) app.provide("state", reactive(state));
// If you want to use it in setup, import from the nuxtApp.

onMounted(() => {
  if (app.$pwa?.offlineReady) {
    console.log("App ready to work offline");
  }
});
</script>
