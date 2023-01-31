<template>
  <div>
    <div class="h-[90vh] min-h-[720px] relative">
      <TransitionGroup name="slide-in">
        <Image
          v-if="page"
          :media="page.attributes.hero.image.data?.attributes"
          class="h-full -mt-36 -z-10 object-top"
          width="full"
          aspectRatio="16/10"
        />
        <HeroCopy
          v-if="page && show"
          :copy="page.attributes.hero.copy"
          :subCopy="page.attributes.hero.subCopy"
          class="absolute bottom-0 px-5 py-10 md:px-12 py-24 w-full bg-gradient-to-t z-20"
        />
      </TransitionGroup>
    </div>
    <Transition name="slide-in">
      <ContentCollection v-if="page" :content="page.attributes.content" />
    </Transition>
    <div class="flex justify-center items-center md:gap-24 gap-12 px-5 py-10 md:px-12 md:py-24 flex-wrap">
      <NuxtLink
        v-for="logo in logos"
        :to="logo.link"
        :title="logo.alt"
        class="hover:opacity-80 w-32 md:w-36"
        target="_blank"
        ><img :src="logo.src" :alt="logo.alt"
      /></NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import Image from "~/components/molecules/Image.vue";
import HeroCopy from "~/components/organisms/HeroCopy.vue";
import ContentCollection from "~/components/species/ContentCollection.vue";

export default defineComponent({
  components: {
    Image,
    HeroCopy,
    ContentCollection,
  },
  data() {
    return {
      page: null,
      show: false,
      logos: [
        {
          src: "/logos/DSGF.svg",
          alt: "DSGF",
          link: "https://www.dgsf.org/",
        },
        {
          src: "/logos/IPTh.svg",
          alt: "IPTh",
          link: "https://www.ipth.de/",
        },
        {
          src: "/logos/Journey.svg",
          alt: "The Journey",
          link: "https://www.thejourney.com/",
        },
      ],
    };
  },
  methods: {},
  async mounted() {
    setTimeout(() => {
      this.show = true;
    }, 500);
    this.page = (await this.$strapi.find("about", { populate: "*" })).data;
    this.$state.headerColor = "light"
  },
  unmounted() {
    this.$state.headerColor = null
  },
  head() {
    return {
      title: "Über Mich",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.page?.attributes.hero.subCopy,
        },
      ],
    };
  },
});
</script>

<style scoped></style>
