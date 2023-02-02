<template>
  <Html :lang="$i18n.locale">
    <Head>
      <Title>RightsPlus</Title>
    </Head>
    <Body class="antialiased text-gray-800 bg-stone-100 text-lg">
      <div class="flex flex-col h-screen">
        <Header class="w-full" />
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
        <Footer class="w-full mt-auto" />
      </div>
    </Body>
  </Html>
</template>
<script lang="ts">
import Header from "~/components/species/Header.vue";
import Footer from "~/components/species/Footer.vue";
// import "@formkit/themes/genesis";

export default defineComponent({
  async setup() {
    const app = useNuxtApp();
    if (!app.$state) app.provide("state", reactive({headerColor: null}));
  },
  components: {
    Header,
    Footer,
  },
});
</script>
