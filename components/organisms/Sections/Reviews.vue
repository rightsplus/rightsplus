<template>
  <section class="py-24 bg-grey-200 relative">
    <div class="grid gap-12 mx-auto px-5 md:px-12 relative z-1">
      <div class="flex flex-col gap-12 leading-0">
        <div
          class="flex flex-col gap-5 text-center md:max-w-3xl mx-auto box-content"
        >
          <h1 class="text-2xl sm:text-5xl font-bold">
            {{ t('reviews.title') }}
          </h1>
          <h2 class="text-lg sm:text-2xl font-medium text-gray-500">
            {{ t('reviews.subtitle') }}
          </h2>
        </div>
        <div
          class="flex overflow-x-auto w-screen max-w-screen md:w-full md:max-w-full -m-5 p-5 md:m-0 md:p-0 md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <ReviewCard
            v-for="review in entries"
            :key="review.author_name"
            :review="review"
            @click="activeReview = review"
            class="shrink-0 max-w-[80vw] md:max-w-none lg:max-xl:[&:nth-child(n+4)]:hidden cursor-pointer"
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
          :to="state.reviews.url"
          target="_blank"
          class="text-center cursor-pointer underline-offset-1 hover:underline flex gap-2 items-center mx-auto font-medium"
          ><span>{{ t('reviews.viewMore') }}</span>
          <FontAwesomeIcon icon="arrow-right" class="text-sm"
        /></NuxtLink>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import ReviewCard from "@/components/cells/ReviewCard.vue";
import type { Review } from "@/types";
const state = useAppState();
const { locale, t } = useI18n();
const { key, placeId } = useRuntimeConfig().public.google;
const request = `https://maps.googleapis.com/maps/api/place/details/json?key=${key}&place_id=${placeId}&fields=review,url&language=${locale.value}`;
const { fetchProxy } = useSupabaseFunctions();

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
    translated: false,
  },
];
const entries = computed(() =>
  shuffle([...added, ...(useAppState().reviews.entries || [])])
);
onMounted(() => {
  fetchProxy<{ result: { reviews: Review[]; url: string } }>(request)
    .then(({ result }) => {
      if (!result?.reviews?.length) return;
      useAppState().reviews = {
        entries: result?.reviews,
        url: result?.url,
      };
    })
    .catch((e) => console.log(e));
});
</script>
