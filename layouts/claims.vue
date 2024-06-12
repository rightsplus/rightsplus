<template>
  <div class="flex flex-col">
    <Header class="w-full z-50" />
    <div
      class="min-h-screen p-12 bg-neutral-200 max-w-7xl mx-auto w-full block md:flex gap-8"
    >
      <!-- <CellsSidebarMenu :user="user" :items="menu" /> -->
      <main class="w-full" :class="$route.meta.classes?.main">
        <!-- <h1 class="text-3xl">{{ $route.meta.title }}</h1> -->
        <!-- <hr class="my-12 w-full border-t border-neutral-300" /> -->
        <slot />
      </main>
    </div>
    <Footer class="w-full mt-auto" />
  </div>
</template>

<script lang="ts" setup>
import Header from "@/components/species/Header.vue";
import Footer from "@/components/species/Footer.vue";
const user = useSupabaseUser();
const { auth } = useSupabaseAuthClient();
const menu = computed(() => [
  {
    label: "Deine Forderungen",
    link: "claim",
    icon: "plane",
  },
  {
    label: "Profil",
    link: "profile",
    icon: "user",
  },
  // {
  //   separator: true,
  // },
  // {
  //   name: "status",
  //   onClick: () => {
  //     auth.signOut();
  //     navigateTo(localeRoute("index"));
  //   },
  //   label: "Ausloggen",
  //   icon: "door-open",
  //   critical: true,
  // },
]);
</script>
