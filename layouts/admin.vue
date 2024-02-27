<template>
  <div class="flex flex-col">
    <div
      class="min-h-screen p-12 bg-neutral-200 mx-auto w-full block md:flex gap-8"
    >
      <div class="flex flex-col gap-5 min-w-[240px]">
        <span class="flex gap-3 items-center leading-none mx-3">
          <Icon :icon="Logo" class="[&>svg]:w-4" />
          <span class="flex gap-1 text-base">
            <span class="font-bold">RightsPlus</span
            ><span class="font-medium">Admin</span>
          </span>
          <button
            class="rounded-full aspect-square hover:bg-red-500 hover:text-white text-red-500 w-8 h-8 flex items-center justify-center ml-auto -mr-1"
            @click="signOut"
          >
            <FontAwesomeIcon icon="door-open" fixed-width class="text-sm" />
          </button>
        </span>
        <hr class="mx-3 border-t-neutral-300" />
        <CellsSidebarMenu :items="menu" />
      </div>
      <main class="w-full">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Logo from "~/assets/logo";

const user = useSupabaseUser();
const { auth } = useSupabaseAuthClient();
const signOut = () => {
  auth.signOut();
  navigateTo("/");
};
const menu = [
  {
    label: "Deine Forderungen",
    href: "/claim",
    icon: "plane",
  },
  {
    label: "Profil",
    href: "/profile",
    icon: "user",
  },
];
</script>
