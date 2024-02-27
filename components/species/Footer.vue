<template>
  <footer class="text-neutral-300 bg-gray-800 z-10 w-full p-5 sm:p-12 lg:p-24">
    <nav
      class="grid grid-cols-12 gap-5 gap-y-12 md:gap-12 max-w-5xl mx-auto w-full"
    >
      <div class="col-span-12 sm:col-span-3 flex flex-col gap-24">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <NuxtLink
            to="/"
            class="w-full max-w-[160px] h-min"
            title="home"
            @click="scrollTop"
          >
            <Icon v-if="Logo" :icon="Logo" />
          </NuxtLink>
        </div>
      </div>
      <ul
        class="col-span-12 sm:col-span-9 grid grid-cols-2 lg:grid-cols-4 font-medium gap-5 gap-y-12 sm:gap-12"
      >
        <li v-for="column in routes" class="flex flex-col gap-3">
          <span
            class="uppercase font-semibold tracking-widest text-xs md:text-sm text-gray-500"
            >{{ column.title }}</span
          >
          <ul class="flex flex-col gap-3 text-sm md:text-base">
            <li v-for="item in column.links" class="leading-tight">
              <NuxtLink
                :to="item.link || `/${item.name}`"
                class="hover:text-gray-400 break-words hyphens-auto"
                exactActiveClass="text-gray-400"
                >{{ item.title }}</NuxtLink
              >
            </li>
          </ul>
        </li>
      </ul>
      <!-- <ul
        class="col-span-6 sm:col-span-3 lg:col-span-3 flex flex-col text-xl font-medium leading-loose md:leading-normal"
        :style="{ '--total': routes.length }"
      >
        <li v-for="(item, i) in routes" :key="item.name" :style="{ '--i': i }">
          <NuxtLink
            :to="item.path"
            v-if="!item.spacer"
            class="duration-75 hover:text-gold-600 whitespace-nowrap py-3 md:py-1"
            exactActiveClass="text-gold-500"
          >
            <Icon v-if="item.icon" :icon="item.icon" class="w-36" />
            <template v-else>{{ item.title }}</template>
          </NuxtLink>
          <hr v-else class="border-none h-4" />
        </li>
      </ul> -->
    </nav>
    <hr class="max-w-5xl mx-auto w-full border-t border-gray-700 my-12" />
    <div class="max-w-5xl mx-auto w-full flex gap-12 items-center">
      <span
        class="flex w-full text-xs sm:text-sm text-center text-gray-500"
        v-html="
          `Copyright © 2015-${new Date().getFullYear()} Rights Plus GbR. ${t('allRightsReserved')}`
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
const routes = computed(() => [
  {
    title: t("ourService"),
    links: [
      {
        name: "claim/new",
        title: t("calculateYourClaim")
      },

      {
        name: "your-rights",
        title: t("yourRights")
      },
      {
        name: "prices-and-services",
        title: t("pricesAndServices")
      },
    ]
  },
  {
    title: t("legal"), // Legal
    links: [
      {
        name: "privacy",
        title: t("privacy")
      },
      {
        name: "terms-and-conditions",
        title: t('termsAndConditions')
      },
      {
        name: "legal-notice",
        title: t('legalNotice')
      }
    ]
  },
  {
    title: t("about").trim(),
    links: [
      {
        link: "blog",
        name: "blog",
        title: t("blog")
      },
      {
        link: "team",
        name: "team",
        title: t("team")
      },
      {
        link: "ueber-rights-plus",
        name: "about-rights-plus",
        title: t("about", { name: "RightsPlus" })
      }
    ]
  },
  {
    title: t('help'),
    links: [
      {
        name: "customer-service",
        title: t("customerService")
      },
      {
        name: "faq",
        title: t("faq")
      }
    ]
  }
]);
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
