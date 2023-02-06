<template>
  <Html :lang="$i18n.locale">
    <Head>
      <Title>RightsPlus</Title>
    </Head>
    <Body class="antialiased text-gray-800 bg-neutral-200 text-lg">
      <div class="flex flex-col h-screen">
        <Header class="w-full z-50" />
        <NuxtLayout>
          <NuxtPage class="" />
        </NuxtLayout>
        <Footer class="w-full mt-auto" />
      </div>
    </Body>
  </Html>
</template>
<script lang="ts">
import Header from "~/components/species/Header.vue";
import Footer from "~/components/species/Footer.vue";
import { state } from "~/store";

export default defineComponent({
  async setup() {
    const app = useNuxtApp();

    if (!app.$state) app.provide("state", reactive(state));
  },
  components: {
    Header,
    Footer,
  },
});
</script>
