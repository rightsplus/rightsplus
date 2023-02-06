<template>
  <section class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <img src="airport-light.jpg" class="absolute inset-0 h-full w-full object-cover object-right -z-1 hidden lg:block" />
    <div class="max-w-7xl mx-auto px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
        <div class="flex flex-col gap-5">
          <h1 class="text-6xl font-extrabold">
            Flug verspätet oder annuliert?
          </h1>
          <span class="text-3xl font-medium text-gray-500"
            >Mit RightsPlus setzen wir deine Ansprüche auf Entschädigung gemäß
            EU-Recht durch.</span
          >
        </div>
      </div>
    </div>
  </section>
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
