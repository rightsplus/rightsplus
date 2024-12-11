<template>
  <div>
    <NuxtLayout name="dashboard">
      <div class="flex w-full" ref="container">
        <div
          class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 lg:w-[--width] flex-shrink-0 flex"
          :style="`--width: ${width}px`"
        >
          <div
            class="h-16 flex-shrink-0 flex items-center border-b border-gray-100 dark:border-gray-800 px-4 gap-x-4 min-w-0"
          >
            <div
              class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0"
            >
              <div class="flex items-stretch gap-1.5 min-w-0">
                <h1
                  class="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white min-w-0"
                >
                  <span class="truncate">{{ $t("flight", 2) }}</span>
                </h1>
              </div>
            </div>
          </div>
          <div class="flex-1 flex flex-col overflow-y-auto p-2">
            <div>
              <DashboardListFlight
                :flight="flight.data"
                v-for="flight in flights?.slice(0, 100)"
                :key="flight.iata"
                @click="currentSelection = flight"
                :active="currentSelection?.iata === flight.iata"
              />
              <div
                class="flex items-center align-center text-center w-full flex-row"
              >
                <div
                  class="flex border-gray-100 dark:border-gray-800 w-full border-t border-solid"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <DashboardSeparator vertical @drag="width = $event - offset" />

        <div class="flex-1 flex flex-col overflow-y-auto p-0 w-full">
          <div
            class="flex-col items-stretch relative w-full flex-1 hidden lg:flex"
          >
            <div class="flex flex-col gap-5 p-5 w-full" v-if="currentSelection">
              <div class="flex items-center gap-5 justify-between w-full">
                <div class="flex items-center gap-5">
                  <h2 class="text-lg font-bold">{{ currentSelection.iata }}</h2>
                </div>
                <Button @click="currentSelection = null">
                  <FontAwesomeIcon icon="xmark" />
                </Button>
              </div>
              <FlightDetails :flight="currentSelection?.data" />
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // middleware: ["auth"],
  layout: "dashboard",
  key: "flights",
});
import type { Database, RowAirline, RowFlight } from "@/types";
const container = ref();
const width = ref(700);
const offset = ref(0);
onMounted(() => {
  const { left } = container.value.getBoundingClientRect();
  offset.value = left;
});

const client = useSupabaseClient<Database>();
const { data: flights } = await useAsyncData("flights", async () => {
  const { data: flights } = await client
    .from("flight")
    .select("*")
    .order('scheduledDeparture', { ascending: false })
    .returns<RowFlight[]>();

  return flights;
});

const currentSelection = ref<RowFlight | null>(null);
</script>
