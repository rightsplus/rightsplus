<script setup lang="ts">
definePageMeta({
  layout: false,
});
const route = useRoute();
const { data } = useAsyncData("your-passenger-rights", () =>
  queryContent(route.fullPath).findOne()
);
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
      <template #title>{{ $t(data?.title || "") }}</template>
      <template #description>{{ $t(data?.description || "") }}</template>
      <ContentRenderer :value="data || {}" class="markdown" />
    </NuxtLayout>
  </div>
</template>
