<script setup lang="ts">
definePageMeta({
  layout: false,
});
const { queryLocaleContent } = useI18nContent('pages');
const route = useRoute();
const { data } = await useAsyncData(route.fullPath, () => {
  return queryLocaleContent(route.fullPath).first();
});
</script>
<template>
  <div>
    <NuxtLayout name="generic">
      <template #category>
        <div class="flex items-center gap-2">
          <img :src="`/locales/en-EU.svg`" class="relative z-10 w-7 shrink-0" />
          <span class="font-bold uppercase text-neutral-500">{{
            data?.category
          }}</span>
        </div>
      </template>
      <template #title>{{ data?.title }}</template>
      <template #lead>{{ data?.lead }}</template>
      <ContentRenderer
        v-if="data"
        :value="data"
        class="markdown grid grid-cols-subgrid sm:!col-start-1 !-col-end-1 [&>*]:col-start-2"
      />
    </NuxtLayout>
  </div>
</template>
