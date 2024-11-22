<template>
  <footer
    class="text-neutral-300 bg-gray-800 z-10 w-full p-5 sm:p-12 lg:p-24 @container"
    :class="$route.meta.classes?.footer"
  >
    <nav
      class="grid @2xl:grid-cols-12 gap-5 gap-y-12 md:gap-12 max-w-5xl mx-auto w-full"
    >
      <div class="@2xl:col-span-4 @5xl:col-span-3 flex flex-col gap-24">
        <NuxtLink
          :to="localePath('index')"
          class="w-full max-w-[160px] h-min flex gap-3 items-center leading-none cursor-pointer"
          title="home"
          @click="scrollTop"
        >
          <Icon
            v-if="Logo"
            :icon="Logo"
            class="shrink-0 border border-white/30 rounded-md"
          />
          <span class="flex gap-1">
            <span class="font-bold shrink-0">RightsPlus</span
            ><span class="font-medium shrink-0">Flights</span>
          </span>
        </NuxtLink>
      </div>
      <ul
        class="@2xl:col-span-8 @5xl:col-span-9 grid grid-cols-2 @5xl:grid-cols-4 font-medium gap-5 gap-y-12 sm:gap-12"
      >
        <li v-for="column in routes" class="flex flex-col gap-3">
          <span
            class="uppercase font-semibold tracking-widest text-xs md:text-sm text-gray-500"
            >{{ column.title }}</span
          >
          <ul class="flex flex-col gap-3 text-sm md:text-base">
            <li v-for="item in column.links" class="leading-tight">
              <NuxtLink
                :to="localePath(item.path)"
                class="hover:text-gray-400 break-words hyphens-auto"
                exactActiveClass="text-gray-400"
                >{{ item.title }}</NuxtLink
              >
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <hr class="max-w-5xl mx-auto w-full border-t border-gray-700 my-12" />
    <div class="max-w-5xl mx-auto w-full flex gap-12 items-center">
      <span
        class="flex w-full text-xs sm:text-sm text-gray-500"
        v-html="
          `Copyright © 2015-${new Date().getFullYear()} Rights Plus GbR. ${t(
            'allRightsReserved'
          )}`
        "
      />
      <LanguageSwitcher />
    </div>
  </footer>
</template>

<script setup lang="ts">
import Logo from "~/assets/logo";
import LanguageSwitcher from "@/components/molecules/LanguageSwitcher.vue";
const { t } = useI18n();
import { type RouteName } from "~/composables/useLocaleContent";
const { localePath } = useLocaleContent();

const routes = computed(
  () =>
    [
      {
        title: t("ourService"),
        links: [
          {
            path: "claim-new",
            title: t("checkClaim"),
          },
          // {
          //   path: "delayed-and-cancelled-flights",
          //   title: t("disruptedFlights"),
          // },
          {
            path: "your-passenger-rights",
            title: t("yourRights"),
          },
          {
            path: "prices-and-services",
            title: t("pricesAndServices"),
          },
        ],
      },
      {
        title: t("about").trim(),
        links: [
          // {
          //   path: "blog",
          //   title: t("blog"),
          // },
          {
            path: "team",
            title: t("team"),
          },
          {
            path: "about-rights-plus",
            title: t("about", { name: "RightsPlus" }),
          },
        ],
      },
      {
        title: t("legal"), // Legal
        links: [
          {
            path: "privacy",
            title: t("privacy"),
          },
          {
            path: "terms-and-conditions",
            title: t("termsAndConditions"),
          },
          {
            path: "legal-notice",
            title: t("legalNotice"),
          },
        ],
      },
      {
        title: t("help"),
        links: [
          {
            path: "faq",
            title: t("customerService"),
          },
          {
            path: "faq",
            title: t("faq"),
          },
        ],
      },
    ] satisfies { title: string; links: { path: RouteName; title: string }[] }[]
);
const scrollTop = () => {
  // scroll to top smooth
  // @todo use animejs instead
  window.scrollTo({ top: 0, behavior: "smooth" });
};
const offset = (i: number, array: number[]) => {
  return Math.abs(i - Math.ceil((array.length - 1) / 2));
};
</script>

<style scoped></style>
