<template>
  <div>
    <NuxtLayout name="dashboard">
  <div class="flex w-full">
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
            class="ml-auto rounded-lg p-1 px-3 border-neutral-300"
          />
        </div>
      </div>
      <div
        class="flex-1 flex flex-col overflow-y-auto p-3"
        :class="{ 'pb-20': Math.ceil((airlines?.length || 0) / limit) > 1 }"
      >
        <DashboardListItem
          v-for="(airline, index) in airlines?.slice(
            (currentPage - 1) * limit,
            currentPage * limit
          )"
          :title="airline.name"
          :content="airline.iata"
          :active="airline.id === activeAirlineId"
          @click="
            activeAirlineId =
              activeAirlineId !== airline.id ? airline.id : undefined
          "
          :unread="null"
        >
          <template #prepend>
            <div class="flex items-center gap-2 text-neutral-400 mr-3">
              <CellsAirlineLogo :airline="airline" />
            </div>
          </template>
        </DashboardListItem>
      </div>
      <div
        class="absolute w-full bottom-0 mx-auto my-8 z-50 flex justify-center"
        v-show="Math.ceil((airlines?.length || 0) / limit) > 1"
      >
        <Pagination
          :pages="Math.ceil((airlines?.length || 0) / limit)"
          v-model:currentPage="currentPage"
          class="mx-auto"
        />
      </div>
      <Separator />
    </div>
    <div class="flex-1 flex flex-col overflow-y-auto p-0">
      <div class="flex-col items-stretch relative w-full flex-1 hidden lg:flex">
        <div class="flex flex-col gap-5 p-5 w-full" v-if="currentAirline">
          <div class="flex items-center gap-5 justify-between grow">
            <div class="flex items-center gap-5 grow">
              <CellsAirlineLogo :airline="currentAirline" size="lg" />
              <div class="flex flex-col grow">
                <InputShapeless
                  v-model="currentAirline.name"
                  class="text-2xl font-bold"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Transition name="scale">
                <Button
                  @click="saveChanges"
                  class="shrink-0 !p-1"
                  v-if="
                    JSON.stringify(currentAirline) !==
                      JSON.stringify(activeAirline) ||
                    loading ||
                    success
                  "
                >
                  <FontAwesomeIcon
                    :icon="
                      loading
                        ? 'circle-quarter'
                        : success
                        ? 'circle-check'
                        : 'check'
                    "
                    :class="{
                      'animate-revolve': loading,
                      'text-green-500': success,
                    }"
                  />
                </Button>
              </Transition>
              <Button
                @click="activeAirlineId = undefined"
                class="shrink-0 !p-1"
              >
                <FontAwesomeIcon icon="xmark" />
              </Button>
            </div>
          </div>
          <FormKit
            :label="$t('legalName')"
            v-model="currentAirline.legalName"
          />
          <FormPersonalInfo
            v-model:email="currentAirline.email"
            v-model:phone="currentAirline.phone"
            v-model:address="currentAirline.address"
          />
        </div>
      </div>
    </div>
  </div></NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { Database, RowAirline } from "@/types";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});

const supabase = useSupabaseClient<Database>();

const { data } = await useAsyncData("airlines", async () => {
  console.log("fetching airlines");
  try {
    const { data: airlines } = await supabase
      .from("airline")
      .select("*")
      .order("name", { ascending: false })
      .returns<RowAirline[]>();

    return {
      airlines: airlines?.sort((a, b) => (a.iata.includes("*") ? 1 : -1)),
    };
  } catch (err) {
    console.error(err);
  }
});
supabase
  .channel("custom-all-channel")
  .on<RowAirline>(
    "postgres_changes",
    { event: "*", schema: "public", table: "airline" },
    (payload) => {
      if (!data.value?.airlines) return;
      if (payload.eventType === "INSERT") {
        data.value.airlines.push(payload.new);
        return;
      }
      const i = data.value.airlines.findIndex(({iata}) => iata === payload.old.iata);
      if (payload.eventType === "DELETE") {
        data.value.airlines.splice(i, 1);
        return;
      }
      data.value.airlines[i] = payload.new;
      currentAirline.value = payload.new;
    }
  )
  .subscribe();

const currentPage = ref(1);
const limit = 10;
const query = ref("");
const airlines = computed(() =>
{
  return !query.value
    ? data.value?.airlines
    : data.value?.airlines?.filter((airline) => {
        return (
          airline.iata?.toLowerCase().includes(query.value?.toLowerCase()) ||
          airline.name?.toLowerCase().includes(query.value?.toLowerCase()) ||
          query.value?.toLowerCase().includes(airline.name?.toLowerCase())
        );
      })
}
);

const activeAirlineId = ref<RowAirline["id"]>();
const activeAirline = computed(() =>
  activeAirlineId.value !== undefined
    ? airlines.value?.find((e) => e.id === activeAirlineId.value)
    : undefined
);
const currentAirline = ref<RowAirline>();
watch(
  activeAirlineId,
  () =>
    activeAirline.value && (currentAirline.value = { ...activeAirline.value })
);
const compare = () => {};
const loading = ref(false);
const errors = ref<string[]>([]);
const success = ref(false);
const saveChanges = async () => {
  if (!currentAirline?.value) return;
  loading.value = true;
  try {
    const { data, error, status } = await supabase
      .from("airline")
      .upsert(currentAirline.value)
      .select();
    loading.value = false;
    if (error) {
      throw error.message;
    } else {
      success.value = true;
      setTimeout(() => {
        success.value = false;
      }, 2000);
    }
  } catch (error: string) {
    console.error(error);
    errors.value.push(error);
  } finally {
    console.log("done");
    loading.value = false;
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
