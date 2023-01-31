<template>
  <div class="p-5 md:p-12 mx-auto w-full">
    <h1 class="font-bold text-left text-4xl sm:text-6xl mb-10">
      {{ $route.meta.title }}
    </h1>
    <p class="text-xl mb-12 max-w-2xl" v-if="$route.meta.description">
      {{ $route.meta.description }}
    </p>
    <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-12">
      <Offer
        v-for="(offer, i) in offers"
        :key="offer.id"
        :offer="offer"
        class="md:min-w-[360px] h-96"
        :class="{ 'lg:col-span-2': featured.includes(offer.id) || i === 0 }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Button from "~/components/molecules/Button.vue";
import Offer from "~/components/organisms/Offer.vue";
export default defineComponent({
  components: {
    Button,
    Offer,
  },
  setup() {
    definePageMeta({
      title: "Angebote",
      description:
        "Hier wirst du deinen Weg finden und kannst im Wald oder mit den Pferden einen Prozess der Heilung zu beginnen.",
    });

    return {};
  },
  data() {
    return {
      offers: null,
      featured: [],
    };
  },
  async mounted() {
    // this.$strapi.find("home").then(({data}) => {
    //   this.featured = data?.attributes?.offers?.data.slice(0, 3).map(({id}) => id)
    // })
    this.offers = (
      await this.$strapi.find("offers", { populate: ["content", "hero"] })
    ).data;
    this.$state.headerColor = "dark"
  },
  unmounted() {
    this.$state.headerColor = null
  },
});
</script>

<style scoped></style>
