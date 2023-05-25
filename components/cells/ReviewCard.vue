<template>
  <NuxtLink
    :to="link"
    target="_blank"
    class="flex flex-col gap-4 bg-neutral-100 rounded-xl p-5 sm:px-8 sm:py-7 w-full hover:bg-white duration-300"
  >
    <div class="flex justify-between items-center leading-none gap-5">
      <Stars :rating="review.rating" />
      <span class="text-base font-medium leading-none text-gray-500 ml-auto">{{
        review.relative_time_description
      }}</span>
      <button
        v-if="$attrs.onClose"
        class="h-12 w-12 min-w-[48px] md:h-16 md:w-16 md:min-w-[48px] items-center justify-center -m-3 md:-m-5 text-stone-400 hover:text-primary-500 rounded-xl"
        @click="$emit('close')"
      >
        <FontAwesomeIcon icon="times" />
      </button>
    </div>
    <p
      class="text-base mb-auto"
      :class="{ 'leading-tight line-clamp-3': size !== 'large' }"
    >
      {{ review.text }}
    </p>
    <div
      class="flex items-center gap-x-3 gap-y-1 text-sm leading-none flex-wrap"
    >
      <img v-if="size === 'large'" :src="review.profile_photo_url" class="w-8 h-8" />
      <span class="font-bold">{{ review.author_name.split(" ")[0] }}</span>
      <ClientOnly
        ><FontAwesomeIcon icon="check-circle" class="text-green-500"
      /></ClientOnly>
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
  link?: string;
  size?: "small" | "medium" | "large";
}>();
</script>

<style scoped></style>
