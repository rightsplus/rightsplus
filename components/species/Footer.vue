<template>
  <footer class="text-neutral-300 bg-gray-800 z-10 w-full p-5 md:p-12 py-24">
    <nav class="grid grid-cols-12 gap-6 md:gap-12 max-w-5xl mx-auto w-full">
      <div class="col-span-12 sm:col-span-6 lg:col-span-6 flex flex-col gap-24">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <NuxtLink to="/" class="w-full max-w-[160px] h-min" title="home" @click="scrollTop">
            <Icon v-if="Logo" :icon="Logo"  />
          </NuxtLink>
        </div>
      </div>
      <ul
        class="col-span-6 sm:col-span-3 lg:col-span-3 flex flex-col text-xl font-medium leading-loose md:leading-normal"
        :style="{ '--total': routes.length }"
      >
        <!-- <li v-for="(item, i) in routes" :key="item.name" :style="{ '--i': i }">
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
        </li> -->
      </ul>
    </nav>
    <span class="flex justify-center w-full pt-24 text-sm text-center">{{
      `Copyright © 2015-${new Date().getFullYear()} Rights Plus Gbr. All rights reserved.`
    }}</span>
  </footer>
</template>

<script lang="ts">
import Button from "~/components/molecules/Button.vue";
import Icon from "~/components/molecules/Icon.vue";
import Logo from "~/assets/logo";
export default defineComponent({
  components: {
    Button,
    Icon,
  },
  mounted() {
    this.routes = [
      {
        name: "termine",
        path: "/termine",
        title: "Termine",
      },
      {
        name: "angebote",
        path: "/angebote",
        title: "Angebote",
      },
      {
        name: "ueber-mich",
        path: "/ueber-mich",
        title: "Über Mich",
      },
      {
        name: "kontakt",
        path: "/kontakt",
        title: "Kontakt",
      },
      {
        spacer: true,
      },
      {
        name: "impressum",
        path: "/impressum",
        title: "Impressum",
      },
      {
        name: "datenschutz",
        path: "/datenschutz",
        title: "Datenschutz",
      },
    ];
  },
  data() {
    return {
      Logo,
      routes: [],
    };
  },
  methods: {
    scrollTop() {
      // scroll to top smooth
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    offset(i: number, array: number[]) {
      return Math.abs(i - Math.ceil((array.length - 1) / 2));
    },
  },
});
</script>

<style scoped></style>
