<template>
  <Html :lang="$i18n.locale">
    <Head>
      <Title>RightsPlus</Title>
    </Head>
    <Body class="antialiased text-gray-800" :class="$route.meta.classes?.body">
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
// watch(currentRoute, (e) => console.log(e.fullPath, e.redirectedFrom, e.query))
</script>
