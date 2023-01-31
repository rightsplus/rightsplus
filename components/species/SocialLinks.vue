<template>
  <ul
    class="col-span-2 flex flex-col text-xl font-medium leading-loose md:leading-normal"
    :style="{ '--total': routes.length }"
    v-if="routes.length > 0"
  >
    <li v-for="(item, i) in routes" :key="item.name" :style="{ '--i': i }">
      <hr v-if="item.spacer" class="border-none h-4" />
      <NuxtLink
        v-else
        :to="item.path"
        target="_blank"
        class="duration-75 hover:text-gold-600 whitespace-nowrap py-3 md:py-1"
        exactActiveClass="text-gold-500"
      >
        <ClientOnly>
          <FontAwesomeIcon :icon="item.icon" class="mr-3" fixed-width />
        </ClientOnly>
        <span>{{ cta ? item.cta : item.title }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    links: {
      type: Array,
      default: () => ["instagram", "facebook", "email"],
    },
    cta: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    routes() {
      return [
        {
          name: "instagram",
          path: "https://www.instagram.com/heidi.vogler.33/",
          title: "Instagram",
          cta: "Folge mir auf Instagram",
          icon: ["fab", "instagram"],
          spacer: false,
        },
        {
          name: "facebook",
          path: "https://www.facebook.com/heidi.vogler.33",
          title: "Facebook",
          cta: "Folge mir auf Facebook",
          icon: ["fab", "facebook"],
          spacer: false,
        },
        {
          name: "email",
          path: "mailto:hallo@heidivogler.de",
          title: "Email",
          cta: "Schreib mir eine Email",
          icon: ["fas", "envelope"],
          spacer: false,
        },
      ].filter((e) => this.links.includes(e.name));
    },
  },
});
</script>
