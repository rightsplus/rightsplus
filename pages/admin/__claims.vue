<template>
  <div
    class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 lg:w-[--width] flex-shrink-0 flex"
    style="--width: 400px"
  >
    <div>
      <div
        class="h-16 flex-shrink-0 flex items-center border-b border-gray-100 dark:border-gray-800 px-4 gap-x-4 min-w-0"
      >
        <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">
          <div class="flex items-stretch gap-1.5 min-w-0">
            <button
              type="button"
              class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 p-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center lg:hidden"
              aria-label="Open sidebar"
            >
              <FontAwesomeIcon
                icon="bars"
                class="flex-shrink-0 h-5 w-5"
                aria-hidden="true"
              />
            </button>
            <h1
              class="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white min-w-0"
            >
              <span class="truncate">{{ $t("claim", 2) }}</span>
            </h1>
            <div class="inline-flex items-center">
              <span
                class="inline-flex items-center font-medium rounded-md text-xs px-1.5 py-0.5 bg-primary-50 dark:bg-primary-400 dark:bg-opacity-10 text-primary-500 dark:text-primary-400 ring-1 ring-inset ring-primary-500 dark:ring-primary-400 ring-opacity-25 dark:ring-opacity-25"
                >20</span
              >
            </div>
          </div>

          <div class="flex items-stretch flex-shrink-0 gap-1.5">
            <div class="">
              <div
                role="tablist"
                aria-orientation="horizontal"
                class="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full h-9 inline-grid items-center"
                style="grid-template-columns: repeat(2, minmax(0px, 1fr))"
              >
                <div
                  class="absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none"
                  style="top: 4px; left: 4px; width: 68px; height: 28px"
                >
                  <div
                    class="w-full h-full bg-white dark:bg-gray-900 rounded-md shadow-sm"
                  ></div>
                </div>
                <button
                  class="relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out h-7 px-3 text-[13px] font-medium rounded-md text-gray-900 dark:text-white"
                  id="headlessui-tabs-tab-suxx1afYiq_53"
                  role="tab"
                  aria-selected="true"
                  tabindex="0"
                  data-headlessui-state="selected"
                  type="button"
                  aria-controls="headlessui-tabs-panel-suxx1afYiq_55"
                >
                  <span class="truncate">All</span></button
                ><button
                  class="relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out h-7 px-3 text-[13px] font-medium rounded-md text-gray-500 dark:text-gray-400"
                  id="headlessui-tabs-tab-suxx1afYiq_54"
                  role="tab"
                  aria-selected="false"
                  tabindex="-1"
                  data-headlessui-state=""
                  type="button"
                  aria-controls="headlessui-tabs-panel-suxx1afYiq_56"
                >
                  <span class="truncate">Unread</span>
                </button>
              </div>
              <div class="relative w-full">
                <div
                  id="headlessui-tabs-panel-suxx1afYiq_55"
                  role="tabpanel"
                  tabindex="0"
                  data-headlessui-state="selected"
                  class="focus:outline-none"
                  aria-labelledby="headlessui-tabs-tab-suxx1afYiq_53"
                ></div>
                <div
                  id="headlessui-tabs-panel-suxx1afYiq_56"
                  role="tabpanel"
                  tabindex="-1"
                  hidden=""
                  data-headlessui-state=""
                  class="focus:outline-none"
                  style="display: none"
                  aria-labelledby="headlessui-tabs-tab-suxx1afYiq_54"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col overflow-y-auto p-0">
        <div v-for="claim in claims">
          <div
            class="p-4 text-sm cursor-pointer border-l-2 text-gray-900 dark:text-white border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10"
            :class="{
              'bg-primary-100 dark:bg-primary-900/10 border-primary-500/50 dark:border-primary-400/50':
                activeClaim?.id === claim.id,
            }"
            @click="
              () => {
                activeClaim = activeClaim?.id === claim.id ? undefined : claim;
              }
            "
          >
            <div class="flex items-center justify-between font-semibold">
              <div class="flex items-center gap-3">
                {{ formatClaimId(claim.id) }}
                <div
                  class="relative inline-flex items-center justify-center flex-shrink-0"
                >
                  <span
                    class="absolute rounded-full ring-1 ring-white dark:ring-gray-900 flex items-center justify-center text-white dark:text-gray-900 font-medium whitespace-nowrap h-2 min-w-[0.5rem] text-[7px] p-0.5 top-0 right-0 -translate-y-1/2 translate-x-1/2 transform bg-primary-500 dark:bg-primary-400"
                  ></span>
                </div>
              </div>
              <span>{{
                new Date(claim.createdAt).toLocaleString(locale, {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              }}</span>
            </div>
            <p class="font-semibold">{{ claim.client.lastName }}</p>
            <p class="line-clamp-1 flex items-center gap-2">
              <AirlineLogo
                :airline="claim.flights.airlines"
                size="xs"
              /><span>{{ claim.flightIata }}</span>
            </p>
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
      <div class="flex-1 flex flex-col overflow-y-auto p-0">
        <div
          class="flex-col items-stretch relative w-full flex-1 hidden lg:flex"
        >
          <div class="flex-1 p-5">
            <div v-if="activeClaim">
              <div class="flex justify-between">
                <h1 class="text-2xl font-bold">
                  {{ formatClaimId(activeClaim.id) }}
                </h1>
                <span class="flex gap-2 items-center"
                  ><span class="text-xl font-bold">{{
                    activeClaim.airport_departure
                  }}</span
                  ><FontAwesomeIcon
                    icon="plane"
                    class="text-gray-400 dark:text-gray-500"
                  /><span class="text-xl font-bold">{{
                    activeClaim.airport_arrival
                  }}</span></span
                >
              </div>
              <hr class="my-5" />
              <div class="flex gap-3 flex-wrap">
                <Button
                  class="bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-full px-5 py-2 font-medium text-sm flex items-center gap-2"
                  prefix-icon="building"
                  @click="sendEmailToAirline"
                >
                  <span>Email an {{ activeClaim.flights.airlines.name }}</span>
                </Button>
                <Button
                  class="bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-full px-5 py-2 font-medium text-sm flex items-center gap-2"
                  prefix-icon="user"
                >
                  <span>Email an Kunden</span>
                </Button>
                <Button
                  class="bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-full px-5 py-2 font-medium text-sm flex items-center gap-2"
                  prefix-icon="gavel"
                >
                  <span>Email an Kanzlei</span>
                </Button>
              </div>
              <!-- <span
          class="bg-orange-100 text-orange-600 rounded-full px-3 py-2 font-medium"
          >status</span
        > -->
            </div>
            <FontAwesomeIcon
              v-else
              icon="folder-closed"
              class="text-7xl text-gray-400 dark:text-gray-500"
            />
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
  key: "claims",
});

import type { RowAirline, RowClaim, Database, RowFlight } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAdminState } from "~/composables/store";
import AirlineLogo from "~/components/cells/AirlineLogo.vue";
const currentUser = useSupabaseUser();
const activeClaim = ref();
const client = useSupabaseClient<Database>();
const { locale } = useI18n();
const state = useAdminState();
const { data: claims } = useAsyncData("claims", async () => {
  const { data: claims, error } = await client
    .from("claims")
    .select(
      `*,
        flights ( *, airlines ( * ) )
        `
    )
    .returns<
      (RowClaim & {
        flights: RowFlight & {
          airlines: RowAirline;
        };
      })[]
    >();
  // if (claims) state.claims = claims;
  return claims;
});

const date = (d: string) => new Date(d).toLocaleDateString(locale.value);
const time = (d: string) =>
  new Date(d).toLocaleString(locale.value, {
    dateStyle: "short",
    timeStyle: "short",
  });
const logo = getAirlineLogo || (() => "");
const { send } = useSendMail();
const sendEmailToAirline = () => {
  send({
    to: activeClaim.value.flights.airlines.email,
    subject: `Claim ${activeClaim.value?.id}`,
    text: `Dear ${activeClaim.value.flights.airlines.name},\n\nWe have a claim for you.\n\nBest regards,\n\nYour team`,
  });
};
</script>
