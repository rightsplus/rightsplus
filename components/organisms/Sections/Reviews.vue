<template>
  <section class="py-24 bg-grey-200 relative">
    <div class="grid gap-12 mx-auto px-5 sm:px-12 relative z-1">
      <div class="flex flex-col gap-12 leading-0">
        <div
          class="flex flex-col gap-5 text-center sm:max-w-3xl mx-auto box-content"
        >
          <h1 class="text-2xl sm:text-5xl font-bold">
            RightsPlus Kund·innen berichten
          </h1>
          <h2 class="text-lg sm:text-2xl font-medium text-gray-500">
            Unsere Kund·innen sprechen für sich! Über 500 zufriedene
            Nutzer·innen haben bereits auf die einfache und effektive Erstattung
            ihrer Entschädigungsansprüche durch RightsPlus gesetzt.
          </h2>
        </div>
        <div
          class="flex overflow-x-scroll w-screen max-w-screen sm:w-full sm:max-w-full -m-5 p-5 sm:m-0 sm:p-0 sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <ReviewCard
            v-for="review in entries"
            :key="review.author_name"
            :review="review"
            @click="activeReview = review"
            class="shrink-0 max-w-[80vw] sm:max-w-none cursor-pointer"
          />
        </div>
        <Popup :open="!!activeReview" @closeOutside="activeReview = null"
          ><ReviewCard
            v-if="activeReview"
            :review="activeReview"
            @close="activeReview = null"
            size="large"
        /></Popup>
        <NuxtLink
          :to="$state.reviews.url"
          target="_blank"
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
import type { Review } from "@/types";
const { $state } = useNuxtApp();
const { locale } = useI18n();
const { key, placeId } = useRuntimeConfig().public.google;
const request = `https://maps.googleapis.com/maps/api/place/details/json?key=${key}&place_id=${placeId}&fields=review,url&language=${locale.value}`;

interface MapsResponseData {
  result: {
    reviews: Review[];
    url: string;
  };
}
const shuffle = (reviews?: Review[]) =>
  reviews?.sort(() => Math.random() - 0.5).slice(0, 4) || [];
const activeReview = ref<Review | null>();
const added = [
  {
    author_name: "Leon Vogler",
    author_url:
      "https://www.google.com/maps/contrib/108999170046068646837/reviews",
    language: "de",
    original_language: "de",
    profile_photo_url:
      "https://lh3.googleusercontent.com/a/AAcHTtdirEWToPJXhLRKZRcptoNNX1TCde9GVeSG6gBY4Q=w72-h72-p-rp-mo-br100",
    rating: 4,
    relative_time_description: "vor 3 Wochen",
    text: "Vielen Dank, hat alles super schnell und unkompliziert geklappt.",
    time: 1575290474,
    translated: false
  }
];
const entries = computed(() =>
  shuffle([...added, ...(useAppState().reviews.entries || [])])
);
useFetch<MapsResponseData>(request)
  .then(({ data }) => {
    if (!data.value?.result) return;
    useAppState().reviews = {
      entries: data.value?.result?.reviews,
      url: data.value?.result?.url
    };
  })
  .catch(e => console.log(e));
</script>
