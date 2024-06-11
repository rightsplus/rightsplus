<template>
  <div class="fixed inset-0 flex overflow-hidden bg-white">
    <div
      data-n-ids='{"dashboard:panel:0":"dashboard:panel:0"}'
      class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 lg:w-[--width] flex-shrink-0 hidden lg:flex"
      style="--width: 250px"
    >
      <div
        class="h-16 flex-shrink-0 flex items-center border-b border-gray-100 dark:border-gray-800 px-4 gap-x-4 min-w-0 !border-transparent"
      >
        <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">
          <div class="flex items-stretch gap-1.5 min-w-0 flex-1">
            <button
              type="button"
              class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 p-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center lg:hidden"
              aria-label="Open sidebar"
            >
              <span
                class="i-heroicons-bars-3-20-solid flex-shrink-0 h-5 w-5"
                aria-hidden="true"
              ></span>
            </button>
            <div
              data-headlessui-state=""
              class="relative inline-flex text-left rtl:text-right w-full"
            >
              <div
                id="headlessui-menu-button-5yOShZwaZW:1"
                aria-haspopup="menu"
                aria-expanded="false"
                data-headlessui-state=""
                class="inline-flex w-full"
                role="button"
                data-n-ids='{"5yOShZwaZW:0":"5yOShZwaZW:1"}'
              >
                <button
                  type="button"
                  class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center w-full"
                >
                  <Icon
                    :icon="Logo"
                    class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-5 w-5 text-[10px]"
                  /><span
                    class="truncate text-gray-900 dark:text-white font-semibold"
                  >
                    <span class="font-bold">RightsPlus </span>
                    <span class="font-medium">Flights</span></span
                  >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full flex-1 relative overflow-hidden">
        <div class="flex-grow flex flex-col min-h-0 gap-y-2 py-2">
          <div class="w-full flex flex-col px-4">
            <button
              type="button"
              class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
              aria-label="Search"
            >
              <FontAwesomeIcon :icon="'search'" fixed-width /><span class=""
                >Search...</span
              >
              <div
                class="hidden lg:flex items-center gap-0.5 ml-auto -my-1 flex-shrink-0"
              >
                <kbd
                  class="inline-flex items-center justify-center text-gray-900 dark:text-white h-5 min-w-[20px] text-[11px] px-1 rounded font-medium font-sans bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-300 dark:ring-gray-700 ring-inset"
                  >⌘</kbd
                ><kbd
                  class="inline-flex items-center justify-center text-gray-900 dark:text-white h-5 min-w-[20px] text-[11px] px-1 rounded font-medium font-sans bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-300 dark:ring-gray-700 ring-inset"
                >
                  K
                </kbd>
              </div>
            </button>
          </div>
          <div class="flex-1 px-4 flex flex-col gap-y-2 overflow-y-auto">
            <ul class="relative !min-h-[auto] !min-w-[auto]">
              <li tag="li" class="!overflow-visible" v-for="(item, i) in menu">
                <NuxtLink
                  class="group relative flex items-center gap-1.5 px-2.5 py-1.5 w-full rounded-md font-medium text-sm focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 before:absolute before:inset-px before:rounded-md disabled:cursor-not-allowed disabled:opacity-75 text-gray-900 dark:text-white hover:text-gray-900 dark:hover:text-white hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50"
                  active-class="before:!bg-gray-100 dark:before:!bg-gray-800"
                  draggable="false"
                  :to="localeRoute(item.href)"
                >
                  <FontAwesomeIcon
                    :icon="item.icon"
                    fixed-width
                    class="relative"
                  />
                  <span class="text-sm truncate relative"
                    ><span class="sr-only">Current page: </span
                    >{{ item.label }}</span
                  ><span
                    v-if="item.badge"
                    class="inline-flex items-center font-medium text-xs px-1.5 py-0.5 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 flex-shrink-0 ml-auto relative rounded"
                    >{{ item.badge }}</span
                  ></NuxtLink
                >
              </li>
            </ul>
            <div
              class="flex items-center align-center text-center w-full flex-row"
            >
              <div
                class="flex border-gray-100 dark:border-gray-800 w-full border-t border-solid"
              ></div>
            </div>
            <div
              class="mt-auto flex border-gray-100 dark:border-gray-800 w-full border-t border-solid"
            ></div>
          </div>

          <div
            class="flex items-center justify-between gap-x-1.5 flex-shrink-0 px-4"
          >
            <div
              data-headlessui-state=""
              class="relative inline-flex text-left rtl:text-right w-full"
            >
              <div
                id="headlessui-menu-button-5yOShZwaZW:2"
                aria-haspopup="menu"
                aria-expanded="false"
                data-headlessui-state=""
                class="inline-flex w-full"
                role="button"
                data-n-ids='{"5yOShZwaZW:0":"5yOShZwaZW:2"}'
              >
                <button
                  type="button"
                  class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center w-full"
                >
                  <span
                    class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-5 w-5 text-[10px]"
                  ></span
                  ><span class="">Joachim</span
                  ><Button>Ausloggen</Button><span
                    class="i-heroicons-ellipsis-vertical w-5 h-5 ml-auto"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="hidden md:block bg-transparent select-none absolute z-50 group w-[9px] h-full inset-y-0 -right-[5px] cursor-col-resize"
      >
        <div
          class="group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition duration-200 absolute w-px h-full inset-x-0 mx-auto"
        ></div>
      </div>
    </div>

    <div class="flex flex-1 w-full min-w-0">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Logo from "~/assets/logo";
const localeRoute = useLocaleRoute();
const user = useSupabaseUser();
const { auth } = useSupabaseAuthClient();
const signOut = () => {
  auth.signOut();
  navigateTo("/");
};
const menu = [
  {
    label: "Home",
    href: "/admin",
    icon: "house",
  },
  {
    label: "Fälle",
    href: "/admin/claims",
    icon: "folder-closed",
    badge: 18,
  },
  {
    label: "Kunden",
    href: "/admin/clients",
    icon: "user",
  },
  {
    label: "Airlines",
    href: "/admin/airlines",
    icon: "plane-tail",
  },
];
</script>
