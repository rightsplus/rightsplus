<template>
  <header
    class="z-40 overflow-hidden absolute w-full text-neutral"
    :class="{
      open: menuOpen,
    }"
    @click.self="menuOpen = false"
    :style="`--total: ${links.length}`"
  >
    <BurgerIcon
      :active="menuOpen"
      @click="menuOpen = !menuOpen"
      class="absolute cursor-pointer right-5 top-4 sm:top-6 z-40 md:hidden"
      :class="[useAppState()?.headerColor === 'white' ? 'text-white' : '']"
    />
    <nav
      class="flex items-center justify-center px-5 sm:px-12 text-xl md:text-sm lg:text-base h-24 bg-gradient-to-b mx-auto font-bold md:font-medium"
      :class="{
        'dark': useAppState()?.headerColor === 'white',
        'max-w-7xl': useRoute().path !== '/admin',
        'max-w-screen': useRoute().path === '/admin',
        }"
    >
      <TransitionGroup
        name="list"
        tag="ul"
        class="w-full flex flex-col md:flex-row gap-x-6 gap-y-2 landscape:gap-y-[1vh] relative"
      >
        <li class="order-0 md:order-1 mr-auto" key="logo">
          <NuxtLink
            to="/"
            class="flex gap-3 items-center sm:py-3 leading-none cursor-pointer"
            title="RightsPlus"
            @click="clickLink"
          >
            <Icon :icon="Logo" />
            <span
              class="flex gap-1"
              :class="{
                'text-white drop-shadow': $state?.headerColor === 'white',
              }"
            >
              <span class="font-bold">RightsPlus</span
              ><span class="font-medium">Flights</span>
            </span>
          </NuxtLink>
        </li>
        <li
          v-for="(item, i) in links"
          :key="item.name"
          class="order-1 flex whitespace-nowrap"
          :class="{ 'button text-base': item.type === 'button' }"
          :ref="!item.icon && item.type !== 'button' ? item.path : ''"
          :style="{
            '--k': `${i}`,
          }"
        >
          <NuxtLink
            :to="item.path"
            class="flex gap-3 items-center py-3 leading-none cursor-pointer"
            exactActiveClass="text-gray-500"
            :title="item.title || item.name"
            :class="{
              'text-white bg-gray-700 px-5 md:py-0 md:my-2 -mx-1 rounded-full hover:text-white hover:bg-gray-800':
                item.type === 'button',
              'hover:text-gray-500 ': item.type !== 'button',
              'text-white drop-shadow': $state?.headerColor === 'white',
            }"
            @click="clickLink(item)"
          >
            <span v-if="item.title">{{ item.title }}</span>
          </NuxtLink>
        </li>
      </TransitionGroup>
    </nav>
  </header>
</template>

<script setup lang="ts">
import BurgerIcon from "~/components/molecules/BurgerIcon.vue";
import Icon from "~/components/molecules/Icon.vue";
import Logo from "~/assets/logo";
import { Database } from "~/types";
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

const menuOpen = ref(false);
const isAdmin =
user.value?.email && (
    await client
      .from("users")
      .select("role")
      .eq("email", user.value?.email)
      .single()
  ).data?.role === "admin";

const links = computed((): Route[] => {
  const { path } = useRouter().currentRoute.value;
  const logout = {
    name: "status",
    onClick: () => {
      client.auth.signOut();
      navigateTo("/");
    },
    title: "Ausloggen",
    type: "button",
  } as Route;

  const status = isAdmin
    ? {
        name: "admin",
        path: "/admin",
        title: "Admin",
        type: "button",
      }
    : ({
        name: "status",
        path: "/status",
        title: "Meine Forderungen",
        type: "button",
      } as Route);

  const routes = [
    {
      name: "claims",
      path: "/claims-calculator",
      title: "Rechner",
    },
    {
      name: "ueber-rights-plus",
      path: "/ueber-rights-plus",
      title: "Über RightsPlus",
    },
    {
      name: "faq",
      path: "/faq",
      title: "FAQ",
    },
    {
      name: "rechte",
      path: "/deine-rechte",
      title: "Deine Rechte",
    },
    user && (path === "/status" || path === "/admin") ? logout : status,
  ] as Route[];
  return routes;
});

const clickLink = (item: Route) => {
  item.onClick?.();
  menuOpen.value = false;
};
watch(
  () => menuOpen,
  (value) => document.body.style.overflow = value ? "hidden" : "auto"
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
          display: block;
          opacity: 0;
          transform: scale(0.9);
          transform-origin: 0 top;
          transition-duration: 500ms;
          transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
          transition-property: opacity, transform;
          transition-delay: 0ms;
          margin-right: auto;
        }
        li.button {
          margin-top: 150px;
          transition-duration: 1500ms;
          transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
          transform: scale(0.9) translateY(150px);
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
        &.dark {
          background-color: var(--color-gray-900);
        }
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
        }
      }
    }
  }
}
</style>
