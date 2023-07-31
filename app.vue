<template>
  <Html :lang="$i18n.locale">
    <Head>
      <Title>RightsPlus</Title>
    </Head>
    <Body class="antialiased text-gray-800 bg-neutral-200 text-lg">
      <div class="flex flex-col">
        <Header class="w-full z-50" />
        <NuxtPage />
        <Footer class="w-full mt-auto" />
      </div>
    </Body>
  </Html>
</template>
<script setup lang="ts">
import Header from "~/components/species/Header.vue";
import Footer from "~/components/species/Footer.vue";
import { state } from "~/store";
const app = useNuxtApp();

if (!app.$state) app.provide("state", reactive(state));
</script>
