<template>
  <Html :lang="$i18n.locale">
    <Head>
      <Title>RightsPlus</Title>
    </Head>
    <Body class="antialiased text-gray-800 bg-neutral-200 text-lg">
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
const { currentRoute } = useRouter()
const isPDF = computed(() => currentRoute.value.path.split("/")[1] === 'pdf')
if (!app.$state) app.provide("state", reactive(state));
watch(currentRoute, (e) => console.log(e.fullPath, e.redirectedFrom, e.query))
</script>
