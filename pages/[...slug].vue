<script setup lang="ts">
definePageMeta({
  layout: false,
  validate({ params }) {
    const slug = typeof params.slug === 'string' ? params.slug : params.slug.join('/')
    const isStaticFile = /\.(png|jpe?g|gif|svg|webp|mp4|js|css|ico|woff2?)$/.test(slug);
    return !isStaticFile;
  },
});
const { t } = useI18n();
const { queryLocaleContent } = useI18nContent();
const route = useRoute();
const { data } = useAsyncData("page", () => {
  return queryLocaleContent(route.fullPath).findOne();
});
onMounted(() => {
  console.log(route.fullPath)
})
</script>
<template>
  <div>
    <NuxtLayout name="generic">
      <template #category>{{ t(data?.category || "") }}</template>
      <template #title>{{ t(data?.title || "") }}</template>
      <template #lead>{{ t(data?.lead || "") }}</template>
      <ContentRenderer :value="data || {}" class="markdown" />
    </NuxtLayout>
  </div>
</template>
