<template>
  <section class="py-24 bg-grey-200 relative">
    <div class="grid gap-12 max-w-[1440px] mx-auto px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-5 text-center max-w-3xl mx-auto">
          <h1 class="text-5xl font-bold">RightsPlus Kund:innen berichten</h1>
          <h2 class="text-2xl font-medium text-gray-500">
            Unsere Kunden sprechen für sich! Über 500 zufriedene Nutzer:innen
            haben bereits auf die einfache und effektive Erstattung ihrer
            Entschädigungsansprüche durch RightsPlus.
          </h2>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <ReviewCard
            v-for="review in shuffle($state.reviews.entries)"
            :key="review.author_name"
            :review="review"
            :link="$state.reviews.url"
          />
        </div>
        <NuxtLink
          :to="$state.reviews.url"
          class="text-center cursor-pointer underline-offset-1 hover:underline flex gap-2 items-center mx-auto font-medium"
          ><span>Weitere Bewertungen ansehen</span>
          <FontAwesomeIcon icon="arrow-right" class="text-sm"
        /></NuxtLink>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import ReviewCard from "@/components/cells/ReviewCard.vue";
import { Review } from "@/types";
// import { ref } from "vue";
const { $state } = useNuxtApp();
const { locale } = useI18n();
const { key, placeId } = useRuntimeConfig().public.google;
const request = `https://maps.googleapis.com/maps/api/place/details/json?key=${key}&place_id=${placeId}&fields=review&language=${locale.value}`;

interface MapsResponseData {
  result: {
    reviews: Review[];
    url: string;
  };
}
useFetch<MapsResponseData>(request).then(({ data }) => {
  $state.reviews = {
    entries: data.value?.result?.reviews,
    url: data.value?.result?.url,
  };
});
const shuffle = (reviews: Review[]) => reviews.sort(() => Math.random() - 0.5).slice(0, 4);
</script>
<style scoped>
.double {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.triple {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
