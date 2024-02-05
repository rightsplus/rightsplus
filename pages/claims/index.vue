<template>
  <div
    class="min-h-screen p-12 pt-24 sm:pt-36 pb-8 bg-neutral-200 max-w-7xl mx-auto w-full"
  >
    <div class="mt-12 mb-24 block space-y-4 md:flex md:space-x-12 md:space-y-0 w-full">
      <div class="flex flex-col space-y-4 items-start w-[240px]">
        <aside
          class="w-full md:w-sidebar md:min-w-sidebar md:sticky md:top-4 h-max pt-0 md:!w-auto"
        >
          <div class="pt-0 mb-6">
            <button
              type="button"
              class="border-none hover:bg-gray-100 hover:rounded-md w-56 !h-16 -ml-4 md:-ml-0 flex items-center border border-gray-200 rounded-md h-md py-2 px-3 space-x-2 hover:border-gray-400 focus:outline-none focus-visible:border-pink-400"
            >
              <div class="flex space-x-3 items-center w-full truncate">
                <span
                  class="inline-block rounded-full overflow-hidden"
                  title="Studio Leon Vogler"
                  style="width: 32px; height: 32px; min-width: 32px; min-height: 32px;"
                >
                  <div
                    class="w-full h-full rounded-full bg-cover bg-no-repeat bg-center"
                    style='background-image: url("https://avatars.githubusercontent.com/u/24809946?v=4");'
                  ></div>
                </span>
                <div class="flex flex-col items-start">
                  <p class="text-base font-semibold">
                    {{ user?.user_metadata.full_name }}
                  </p>
                  <p class="text-xs text-gray-600 font-medium">
                    {{ user?.email }}
                  </p>
                </div>
              </div>
            </button>
          </div>
          <div v-for="(item, index) in menu" :key="index">
            <NuxtLink
              class="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 relative flex items-center md:px-3 py-2 rounded text-foreground md:hover:bg-gray-100 hover:text-foreground sidebar-item sidebar-item-General group mb-2 gap-3 mx-1"
              :to="item.href"
            >
              <FontAwesomeIcon :icon="item.icon" fixed-width class="text-sm" />
              <p class="text-base">{{ item.label }}</p>
            </NuxtLink>
          </div>
        </aside>
      </div>
      <main class="flex flex-col items-center w-full min-w-0 min-h-lg pt-3 w-full">
        <section class="flex flex-col flex-grow w-full first:mt-0 last:mb-0">
          <div class="flex flex-col space-y-12 w-full">
            <div class="flex justify-between items-center">
              <p class="text-2xl font-normal">Deine Forderungen</p>
            </div>
            <hr class="my-4 w-full border-t border-gray-100" />
            <div class="flex flex-col">
              <div class="flex flex-col">
                <p class="font-semibold">Aktuelle Forderungen</p>
              </div>
              <OrganismsCalculatorClaimsList :claims="claims" />
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClaimsCalculator from "@/components/organisms/Calculator/ClaimsCalculator.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { ClaimsForm } from "@/types"
const user = useSupabaseUser();
const client = useSupabaseClient()
definePageMeta({
  title: "Ansprüche berechnen",
  description: "",
  middleware: ["auth"],

});
onMounted(() => {
  useAppState().headerColor = "dark";
});
onBeforeUnmount(() => {
  useAppState().headerColor = null;
});

const menu = [
  {
    label: "Deine Forderungen",
    href: "/claims",
    icon: "plane",
  },
  {
    label: "Profil",
    href: "/profile",
    icon: "user",
  },
];


const claims = ref(
  null as
    | null
    | {
        id: string;
        data: ClaimsForm;
      }[]
);
useAsyncData("claims", async () => {
  if (!user.value?.email) return;
  const { data, error } = await client
    .from("claims")
    .select(
      `
        *,
        users ( * ),
        flights ( * )
      `
    )
    .eq("email", user.value.email);
  if (error) throw error;
  return data;
}).then(({ data }) => {
  if (!data.value) return;
  claims.value = data.value;
  data.value?.forEach(({ flights }) => {
    if (flights.data)
      useAirports([flights.data.departure?.iata, flights.arrival?.iata]);
  });
});
</script>
