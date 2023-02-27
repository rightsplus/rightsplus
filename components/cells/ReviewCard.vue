<template>
  <NuxtLink
    :to="review.author_url"
    target="_blank"
    class="flex flex-col gap-4 bg-neutral-100 rounded-xl px-8 py-7 w-full hover:bg-white duration-300"
  >
    <div class="flex justify-between items-center leading-none">
      <Stars :rating="review.rating" />
      <span class="text-base font-medium leading-none text-gray-500">{{
        review.relative_time_description
      }}</span>
    </div>
    <p class="text-base leading-tight line-clamp-3 mb-auto">
      {{ review.text }}
    </p>
    <div
      class="flex items-center gap-x-3 gap-y-1 text-sm leading-none flex-wrap"
    >
      <span class="font-bold">{{ review.author_name.split(" ")[0] }}</span>
      <span
        ><FontAwesomeIcon icon="check-circle" class="text-green-500"
      /></span>
      <span>RightsPlus Kund:in</span>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import { Review } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Stars from "@/components/molecules/Stars.vue";
defineProps<{
  review: Review;
  url?: string;
}>();
</script>

<style scoped></style>
