<script setup lang="ts">
definePageMeta({
  layout: false,
  validate({ params }) {
    const slug = typeof params.slug === 'string' ? params.slug : params.slug.join('/')
    const isStaticFile = /\.(png|jpe?g|gif|svg|webp|mp4|js|css|ico|woff2?)$/.test(slug);
    return !isStaticFile;
  },
});

const { queryLocaleContent } = useI18nContent();
const route = useRoute();
const { data } = useAsyncData(route.fullPath, () => {
  return queryLocaleContent(route.fullPath).first();
});
</script>
<template>
  <div>
    <NuxtLayout name="generic">
      <template #category>{{ data?.category }}</template>
      <template #title>{{ data?.title }}</template>
      <template #lead>{{ data?.lead }}</template>
      <ContentRenderer :value="data || {}" class="markdown" />
    </NuxtLayout>
  </div>
</template>
