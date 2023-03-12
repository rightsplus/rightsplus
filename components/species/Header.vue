<template>
  <header
    class="z-50 overflow-hidden absolute w-full text-neutral"
    :class="{
      open: menuOpen,
      loaded,
    }"
    style="backdropfilter: blur(var(--header-blur, 0px))"
  >
    <BurgerIcon
      :active="menuOpen"
      @click="menuOpen = !menuOpen"
      class="absolute cursor-pointer right-5 top-5 z-50 md:hidden"
    />
    <nav
      class="flex items-center justify-center px-10 text-base sm:text-sm lg:text-base h-24 bg-gradient-to-b max-w-7xl mx-auto"
    >
      <transition-group
        name="list"
        tag="ul"
        class="w-full flex flex-col md:flex-row items-center gap-x-6 gap-y-[4vh] relative"
        :style="{
          '--line-width': `${lineWidth}px`,
          '--line-offset-x': `${lineOffsetX}px`,
          '--line-opacity': `${lineOpacity}`,
        }"
      >
        <li class="order-0 md:order-1 mr-auto">
          <NuxtLink
            to="/"
            class="duration-500 flex gap-3 items-center py-3 leading-none cursor-pointer"
            exactActiveClass="text-neutral-600"
            title="RightsPlus"
          >
            <Icon :icon="Logo" />
            <span
              class="flex gap-1"
              :class="{
                'text-white drop-shadow': $state.headerColor === 'white',
                'text-neutral-800': $state.headerColor !== 'white',
              }"
            >
              <span class="font-bold">RightsPlus</span><span>Flights</span>
            </span>
          </NuxtLink>
        </li>
        <li
          v-for="(item, i) in links"
          :key="item.name"
          class="order-1"
          :ref="!item.icon && item.type !== 'button' ? item.path : ''"
          :data-parallax-hover="!item.icon && item.type !== 'button'"
        >
          <NuxtLink
            :to="item.path"
            class="duration-500 flex gap-3 items-center py-3 leading-none cursor-pointer"
            exactActiveClass="text-neutral-600"
            :title="item.title || item.name"
            :class="{
              'text-white bg-gray-700 px-5 rounded-full hover:text-white hover:bg-gray-800':
                item.type === 'button',
              'text-white drop-shadow': $state.headerColor === 'white',
            }"
            @click="
              (e) => {
                item.onClick?.();
                menuOpen = false;
              }
            "
          >
            <span v-if="item.title">{{ item.title }}</span>
          </NuxtLink>
        </li>
      </transition-group>
    </nav>
  </header>
</template>

<script lang="ts">
import Button from "~/components/molecules/Button.vue";
import BurgerIcon from "~/components/molecules/BurgerIcon.vue";
import Icon from "~/components/molecules/Icon.vue";
import Logo from "~/assets/logo";
interface Route {
  name: string;
  path: string;
  icon?: string;
  title?: string;
  class?: string;
  type?: string;
  onClick?: () => void;
}
export default defineComponent({
  setup() {
    const user = useSupabaseUser();
    const client = useSupabaseClient();
    return { user, client };
  },
  components: {
    Button,
    BurgerIcon,
    Icon,
  },
  mounted() {
    this.$nextTick(() => {
      this.setLine(false);
      setTimeout(() => {
        this.loaded = true;
      }, 300);
    });
    window.addEventListener("resize", () =>
      setTimeout(this.setLine, 300, false)
    );
    // this.initParallaxHover()
  },
  unmounted() {
    window.removeEventListener("resize", () =>
      setTimeout(this.setLine, 300, false)
    );
  },
  data() {
    return {
      Logo,
      menuOpen: false,
      lineWidth: 0,
      lineOffsetX: 0,
      lineOpacity: 1,
      loaded: false,
    };
  },
  computed: {
    links(): Route[] {
      const logout = {
        name: "status",
        onClick: () => {
          this.client.auth.signOut();
          navigateTo("/");
        },
        title: "Ausloggen",
        type: "button",
      } as Route;
      const status = {
        name: "status",
        path: "/status",
        title: "Forderungsstatus ansehen",
        type: "button",
      } as Route;

      const routes = [
        {
          name: "rechte",
          path: "/deine-rechte",
          title: "Deine Rechte",
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
        this.user && this.$router.currentRoute.value.path === "/status"
          ? logout
          : status,
      ] as Route[];
      return routes;
    },
  },
  methods: {
    initParallaxHover() {
      document
        .querySelectorAll("[data-parallax-hover=true]")
        .forEach((element) => {
          let rect: DOMRect | null = null;
          element.addEventListener(
            "mouseenter",
            (e) => {
              rect = e.currentTarget?.getBoundingClientRect() as DOMRect;
              this.setLine(e);
            },
            { passive: true }
          );

          element.addEventListener(
            "mousemove",
            (e) => {
              const { currentTarget, x, y } = e;
              if (!currentTarget || !x || !y) return;
              if (!rect)
                rect = currentTarget?.getBoundingClientRect() as DOMRect;
              const halfHeight = rect.height / 2;
              const topOffset = (y - rect.top - halfHeight) / halfHeight;
              const halfWidth = rect.width / 2;
              const leftOffset = (x - rect.left - halfWidth) / halfWidth;
              this.setTransformStyles(
                currentTarget?.parentElement,
                leftOffset,
                topOffset,
                3
              );
            },
            { passive: true }
          );
          element.addEventListener(
            "mouseleave",
            ({ currentTarget }) => {
              this.setTransformStyles(currentTarget?.parentElement, 0, 0);
              this.setLine(false);
            },
            { passive: true }
          );
        });
    },
    setStyles(el: HTMLElement, styles: Record<string, string>) {
      Object.keys(styles).forEach((key) => {
        el.style.setProperty(key, styles[key]);
      });
    },
    setTransformStyles(
      el: HTMLElement,
      leftOffset: number,
      topOffset: number,
      coefficient = 1
    ) {
      this.setStyles(el, {
        "--x": `${leftOffset * coefficient}px`,
        "--y": `${topOffset * coefficient}px`,
      });
    },
    offset(i: number, array: number[]) {
      return Math.abs(i - Math.ceil((array.length - 1) / 2));
    },
    setLine(e: MouseEvent | false) {
      const target = e
        ? (e.target as HTMLElement)
        : this.$refs[this.$route.path]?.[0];
      if (!target) {
        this.lineOpacity = 0;
        return;
      }
      const rect = target.getBoundingClientRect();
      this.lineWidth = rect.width;
      this.lineOpacity = 1;
      this.lineOffsetX = target.offsetLeft + rect.width / 2;
    },
  },
  watch: {
    $route() {
      this.setLine(false);
    },
  },
});
</script>

<style lang="scss" scoped>
.loaded nav:deep(ul):after {
  opacity: var(--line-opacity, 1);
}
[data-parallax-hover="true"] a:hover,
[data-parallax-hover="true"] .router-link-active {
  color: var(--color-primary-600);
  transition: 0ms;
}
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
        transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
        transition-property: transform, width, left, opacity;
        border-radius: 10px;
      }
    }
  }
}

@media (max-width: 767px) {
  header {
    nav {
      background-color: #00000000;
      backdrop-filter: blur(0px);
      transition: all 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
      align-items: flex-start;
      padding-top: var(--p-6);
      transition-delay: 250ms;
      padding-top: 20px;
      ul {
        li:not(.order-0) {
          display: block;
          opacity: 0;
          transform: scale(0.9);
          transition: 1000ms ease;
          transition-property: opacity, transform;
          transition-delay: 0;
        }
      }
    }
    &.open {
      color: white;
      position: fixed !important;
      nav {
        backdrop-filter: blur(20px);
        background-color: #00000080;
        height: 100vh !important;
        padding-top: calc(25vh - 50px);
        transition-delay: 0ms;
        ul {
          li:not(.order-0) {
            transform: scale(1);
            transition-delay: calc(var(--k) * 150ms + 150ms);
            transition-property: opacity, transform;
            opacity: 1;
            /* height: initial; */
          }
        }
      }
    }
  }
}
</style>
