<template>
  <div class="flex">
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
              <span class="truncate">{{ $t("airline", 2) }}</span>
            </h1>
          </div>
          <input
            v-model="query"
            placeholder="Filter ..."
            class="ml-auto rounded-xl p-1 px-3"
          />
        </div>
      </div>
      <div class="flex-1 flex flex-col overflow-y-auto p-0">
        <div>
          <div
            class="p-4 text-sm cursor-pointer border-l-2 text-gray-900 dark:text-white border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10"
            v-for="airline in airlines?.slice(0, 100)"
            @click="currentSelection = airline"
          >
            <div class="flex items-center justify-between font-semibold">
              <div class="flex items-center gap-3">
                <CellsAirlineLogo :airline="airline" />
                <span>{{ airline.name }}</span>
              </div>
              <span>{{ airline.iata }}</span>
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
      <Separator />
    </div>
    <div class="flex-1 flex flex-col overflow-y-auto p-0">
      <div class="flex-col items-stretch relative w-full flex-1 hidden lg:flex">
        <div
          class="flex flex-col gap-5 p-5 w-full"
          v-if="localCurrentSelection"
        >
          <div class="flex items-center gap-5 justify-between w-full">
            <div class="flex items-center gap-5">
              <CellsAirlineLogo :airline="localCurrentSelection" />
              <h2 class="text-lg font-bold">
                {{ localCurrentSelection.name }}
              </h2>
            </div>
            <Button @click="localCurrentSelection = null">
              <FontAwesomeIcon icon="xmark" />
            </Button>
          </div>
          <FormKit v-model="localCurrentSelection.email" :label="$t('email')" />
          <FormKit
            type="button"
            @click.prevent="saveChanges"
            :suffix-icon="
              loading ? 'circle-quarter' : success ? 'circle-check' : 'error'
            "
            label="Save Changes"
            :errors="errors"
            :classes="{
              outer: !loading ? '[&_.formkit-suffix-icon]' : '',
              input: success ? '!bg-green-500' : '',
              suffixIcon: loading ? '[&>svg]:animate-revolve' : '',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});
import type { Database, RowAirline } from "@/types";

const client = useSupabaseClient<Database>();
const { data } = await useAsyncData("airlines", async () => {
  const { data: airlines } = await client
    .from("airline")
    .select("*")
    .returns<RowAirline[]>();

  return {
    airlines,
  };
});
const query = ref("");
const airlines = computed(() =>
  !query.value
    ? data.value?.airlines
    : data.value?.airlines?.filter((airline) => {
        return airline.name.toLowerCase().includes(query.value.toLowerCase());
      })
);

const currentSelection = ref<RowAirline | null>(null);
const localCurrentSelection = ref<RowAirline | null>(null);
watch(currentSelection, (value) => {
  localCurrentSelection.value = value;
});
const loading = ref(false);
const errors = ref<string[]>([]);
const success = ref(false);
const saveChanges = async () => {
  loading.value = true;
  const { data, error, status } = await client
    .from("airline")
    .upsert(localCurrentSelection.value);
  console.log(data, status);
  loading.value = false;
  if (error) {
    console.error(error);
    errors.value.push(error.message);
    return;
  } else {
    success.value = true;
    setTimeout(() => {
      success.value = false;
    }, 2000);
  }
};
// const airlines = ref<RowAirline[]>([]);
// watch(query, async () => {
//   const { data } = await client
//       .from("airline")
//       .select("*")
//       .textSearch("name", query.value, {
//         type: "phrase",
//         config: "english",
//       })
//       .range(0, 10)
//       .returns<RowAirline[]>();

//   if (!data) return;
//   airlines.value = data;
// });
</script>

<style scoped></style>
