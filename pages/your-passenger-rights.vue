<script setup lang="ts">
definePageMeta({
  layout: false,
});
const { t } = useI18n();
const { queryLocaleContent } = useI18nContent();
const route = useRoute();
const { data } = useAsyncData("your-passenger-rights", () =>
queryLocaleContent(route.fullPath).findOne()
);
</script>
<template>
  <div>
    <NuxtLayout name="generic">
      <template #category>
        <div class="flex items-center gap-2">
          <img :src="`/locales/en-EU.svg`" class="relative z-10 w-7 shrink-0" />
          <span class="font-bold uppercase text-neutral-500">{{
            t(data?.category)
          }}</span>
        </div>
      </template>
      <template #title>{{ t(data?.title || "") }}</template>
      <template #lead>{{ t(data?.lead || "") }}</template>
      <ContentRenderer
        :value="data || {}"
        class="markdown grid grid-cols-subgrid sm:!col-start-1 !-col-end-1 [&>*]:col-start-2"
      />
    </NuxtLayout>
  </div>
</template>
