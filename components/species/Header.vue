<template>
  <header
    class="z-40 w-full text-neutral"
    :class="[
      $route.meta.classes?.header,
      {
        open: menuOpen,
      },
    ]"
    @click.self="menuOpen = false"
    :style="`--total: ${links?.length}`"
  >
    <div
      v-if="useRouter().currentRoute.value.path !== '/admin' && isAdmin"
      role="banner"
      class="flex flex-col bg-white z-50 fixed bottom-3 left-3 rounded-lg shadow-xl text-xs"
    >
      <div class="p-3 flex items-center gap-3">
        <span class="">Angemeldet als Admin</span>
        <NuxtLinkLocale
          class="rounded-full hover:bg-blue-600 bg-blue-500 text-white px-3 py-1.5 font-medium"
          to="admin-claims"
          >Zum Dashboard</NuxtLinkLocale
        >
      </div>
    </div>
    <BurgerIcon
      :active="menuOpen"
      @click="menuOpen = !menuOpen"
      class="absolute cursor-pointer right-5 sm:right-12 top-4 sm:top-6 z-40 md:hidden"
      :class="{
        'text-gray-800': menuOpen,
      }"
    />
    <nav
      class="flex justify-center md:items-center px-5 sm:px-12 text-xl md:text-sm lg:text-base h-24 bg-gradient-to-b mx-auto font-medium"
      :class="{
        'max-w-7xl': useRoute().path !== '/admin',
        'max-w-screen': useRoute().path === '/admin',
      }"
    >
      <!-- {{  useSteps().index }} -->
      <TransitionGroup
        name="list"
        tag="ul"
        class="w-full flex flex-col items-center md:flex-row gap-x-6 gap-y-2 landscape:gap-y-[1vh] relative"
      >
        <li class="order-0 md:order-1 mr-auto" key="logo">
          <NuxtLinkLocale
            to="/"
            class="flex gap-3 items-center sm:py-3 leading-none cursor-pointer"
            title="RightsPlus"
            @click="clickLink"
            :class="{
              'text-gray-800': menuOpen,
            }"
          >
            <Icon :icon="Logo" />
            <span class="flex gap-1 text-lg sm:text-xl">
              <span class="font-bold">RightsPlus</span
              ><span class="font-medium">Flights</span>
            </span>
          </NuxtLinkLocale>
        </li>
        <li
          v-for="(item, i) in links"
          :key="item.name"
          class="order-1 flex whitespace-nowrap"
          :class="{
            'button': item.type === 'button',
            '!hidden': item.hidden,
          }"
          :ref="!item.icon && item.type !== 'button' ? item.path : ''"
          :style="{
            '--k': `${i}`,
          }"
        >
          <NuxtLinkLocale
            :to="item.path"
            class="flex gap-3 items-center py-3 leading-none cursor-pointer group -text-gray-800 sm:text-current"
            exactActiveClass="text-gray-500"
            :title="item.title || item.name"
            :class="{
              'text-white bg-gray-700 px-4 md:py-3 md:my-2 -mx-1 rounded-full hover:text-white hover:bg-gray-800':
                item.type === 'button',
              'hover:text-gray-500 ': item.type !== 'button',
              'bg-red-500 hover:bg-red-600 active:bg-red-700': item.critical,
            }"
            @click="clickLink(item)"
          >
            <span v-if="item.title">{{ item.title }}</span>
            <FontAwesomeIcon
              v-if="item.icon"
              :icon="item.icon"
              fixed-width
              class="duration-100 group-hover:scale-105 group-active:scale-95"
            />
          </NuxtLinkLocale>
        </li>
      </TransitionGroup>
    </nav>
  </header>
</template>

<script setup lang="ts">
import BurgerIcon from "~/components/molecules/BurgerIcon.vue";
import Logo from "~/assets/logo";
import type { Database } from "@/types";
import claimMachine from "~/machines/claimSubmission";
const { auth } = useSupabaseAuthClient();
// const localePath = useLocalePath();
interface Route {
  name: string;
  path: string;
  icon?: string;
  title?: string;
  class?: string;
  type?: string;
  onClick?: () => void;
}
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();
const claim = useClaim();
const { t } = useI18n();
const menuOpen = ref(false);
const isAdmin =
  user.value?.email &&
  (
    await client
      .from("users")
      .select("role")
      .eq("email", user.value?.email)
      .single()
  ).data?.role === "admin";

const { invoke } = useMachine(claimMachine, { context: claim });
const links = computed(() => [
  {
    path: "delayed-and-cancelled-flights",
    name: "disrupted-flights",
    title: t("disruptedFlights"),
  },
  {
    path: "your-passenger-rights",
    name: "your-passenger-rights",
    title: t("yourRights"),
  },
  {
    path: "claim-new",
    onClick: () => invoke("reset"),
    name: "claim",
    title: t("checkClaim"),
    type: "button",
  },
  // {
  //   name: "sign-out",
  //   onClick: () => auth.signOut(),
  //   type: "button",
  //   icon: "door-open",
  //   critical: true,
  //   hidden: !user.value,
  // },
]);

const clickLink = (item: Route) => {
  item.onClick?.();
  menuOpen.value = false;
};
watch(
  () => menuOpen,
  (value) => (document.body.style.overflow = value ? "hidden" : "auto")
);
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
  header {
    nav:deep(ul) {
      position: relative;
      &:after {
        background-color: white;
        /* content: ""; */
        position: absolute;
        bottom: 0.625em;
        opacity: 0;
        left: var(--line-offset-x, 0);
        width: calc(var(--line-width, 0) + 2em);
        transform: translateX(-50%);
        height: calc(100% - 1.25em);
        z-index: -1;
        transition: 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
        transition-property: transform, width, left, opacity;
        border-radius: 10px;
      }
    }
  }
}

@media (max-width: 767px) {
  header {
    height: 100vh;
    position: absolute;
    transition-duration: 500ms;
    pointer-events: none;
    & > * {
      pointer-events: all;
    }
    nav {
      background-color: #da792d00;
      transition-duration: 500ms;
      transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
      transition-property: background-color, height;
      align-items: flex-start;
      padding-top: var(--p-6);
      padding-top: 20px;
      border-end-start-radius: 30px;
      border-end-end-radius: 30px;
      overflow: hidden;
      will-change: height;
      transform: translate3d(0, 0, 0);
      ul {
        li.order-0 {
          margin-bottom: 20px;
        }
        li:not(.order-0) {
          /* color: white; */
          margin-left: 49px;
          margin-right: auto;
          display: block;
          opacity: 0;
          transform: scale(0.9);
          transform-origin: 0 top;
          transition-duration: 500ms;
          transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
          transition-property: opacity, transform;
          transition-delay: 0ms;
        }
        li.button {
          margin-top: 150px;
          transition-duration: 1500ms;
          transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
          transform: scale(0.9) translateY(150px);
          & + li.button {
            margin-top: 10px;
          }
        }
      }
    }
    &.open {
      background-color: #00000080;
      position: fixed !important;
      height: 100vh;
      pointer-events: all;
      nav {
        background-color: white;
        height: calc(var(--total) * 43px + 350px) !important;
        transition-delay: 0ms;
        ul {
          li:not(.order-0) {
            transform: scale(1);
            transition-delay: calc(var(--k) * 70ms + 300ms);
            transition-property: opacity, transform;
            opacity: 1;
          }
          li.button {
            transition-delay: calc(var(--k) * 70ms + 500ms);
            transition-timing-function: cubic-bezier(0, 1, 0, 1);
            @media screen and (orientation: landscape) {
              margin-top: 10vh;
            }
          }
          li.button + li.button {
            @media screen and (orientation: landscape) {
              margin-top: 0;
            }
          }
        }
      }
    }
  }
}
</style>
