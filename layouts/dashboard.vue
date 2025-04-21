<template>
  <div class="grid grid-rows-[auto_1fr] h-screen">
    <header
      class="flex items-center justify-between gap-x-2 px-4 py-3 border-b border-gray-100 z-50"
    >
      <NuxtLinkLocale
        type="button"
        to="index"
        class="flex items-center gap-x-2"
      >
        <Icon
          :icon="Logo"
          class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-5 w-5 text-[10px]"
        /><span class="truncate text-gray-900 font-bold">
          <span>RightsPlus </span>
          <span class="font-medium">Flights</span></span
        >
      </NuxtLinkLocale>
      <nav class="flex items-center gap-x-4 text-sm font-medium">
        <ul class="flex items-center gap-x-2">
          <li>
            <NuxtLinkLocale
              to="admin-claim"
              class="flex items-center gap-x-2 p-2 px-3 rounded-md hover:bg-primary-50"
              active-class="font-bold"
            >
              <span>{{ t("claim", 2) }}</span>

              <Badge
                v-if="unreadClaims"
                :content="unreadClaims.toString()"
                primary
              />
            </NuxtLinkLocale>
          </li>
          <li>
            <Button
              alert
              tertiary
              square
              class="h-8 !p-2 aspect-square text-xs bg-transparent"
              @click="signOut"
              ><FontAwesomeIcon icon="arrow-right-from-bracket"
            /></Button>
          </li>
        </ul>
      </nav>
    </header>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import Logo from "~/assets/logo";
import type { Database } from "~/types";
const localeRoute = useLocaleRoute();
const { t } = useI18n();
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();
const adminStore = useAdminState();
const unreadClaims = computed(
  () => adminStore.claims.filter((e) => e.unread).length
);

const width = ref(250);
const signOut = () => {
  client.auth.signOut();
  user.value = null;
  navigateTo(localeRoute("index"));
};
definePageMeta({
  middleware: ["auth"],
});

const { data: claims } = useAsyncData("claims", async () => {
  const { data: claims, error } = await client
    .from("claim")
    .select(`*`, { count: "exact", head: true })
    .is(`unread`, true);

  return claims;
});

const menu = [
  {
    label: t("claim", 2),
    href: "admin-claim",
    icon: "folder-closed",
    badge: claims.value?.length,
  },
  // {
  //   label: t("booking", 2),
  //   href: "admin-bookings",
  //   icon: "tickets-airline",
  // },
  {
    label: t("flight", 2),
    href: "admin-flights",
    icon: "plane",
  },
  {
    label: t("airline", 2),
    href: "admin-airlines",
    icon: "plane-tail",
  },
];
</script>
