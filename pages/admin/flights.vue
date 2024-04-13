<template>
  <div
    class="flex"
  >
    <div
    class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 lg:w-[--width] flex-shrink-0 flex"
    style="--width: 400px"
    >
      <div
        class="h-16 flex-shrink-0 flex items-center border-b border-gray-100 dark:border-gray-800 px-4 gap-x-4 min-w-0"
      >
        <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">
          <div class="flex items-stretch gap-1.5 min-w-0">
            <h1
              class="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white min-w-0"
            >
              <span class="truncate">{{ $t("flight", 2) }}</span>
            </h1>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col overflow-y-auto p-0">
        <div>
          <div
            class="p-4 text-sm cursor-pointer border-l-2 text-gray-900 dark:text-white border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10"
            v-for="flight in flights?.slice(0, 100)"
            @click="currentSelection = flight"
          >
            <div class="flex items-center justify-between font-semibold">
              <div class="flex items-center gap-3">
                <span>{{ flight.iata }}</span>
              </div>
              <span>{{ flight.status }}</span>
            </div>
          </div>
          <div
            class="flex items-center align-center text-center w-full flex-row"
          >
            <div
              class="flex border-gray-100 dark:border-gray-800 w-full border-t border-solid"
            ></div>
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
    <div class="flex-1 flex flex-col overflow-y-auto p-0">
      <div class="flex-col items-stretch relative w-full flex-1 hidden lg:flex">
        <div class="flex flex-col gap-5 p-5 w-full" v-if="currentSelection">
          <div class="flex items-center gap-5 justify-between w-full">
            <div class="flex items-center gap-5">
              <h2 class="text-lg font-bold">{{ currentSelection.iata }}</h2>
            </div>
            <Button @click="currentSelection = null">
              <FontAwesomeIcon icon="xmark" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  key: "flights",
});
import type { Database, AirlinesRow, FlightsRow } from "@/types";

const client = useSupabaseClient<Database>();
const { data: flights } = await useAsyncData("flights", async () => {
  const { data: flights } = await client
    .from("flights")
    .select("*")
    .returns<FlightsRow[]>();

  return flights;
});

const currentSelection = ref<FlightsRow | null>(null);
</script>
