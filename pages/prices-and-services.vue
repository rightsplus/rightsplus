<script setup lang="ts">
definePageMeta({
  layout: false,
});
const route = useRoute();
const { data } = useAsyncData('prices-and-services', () =>
  queryContent(route.fullPath).findOne()
);
</script>
<template>
  <div>
    <NuxtLayout name="generic">
      <template #category>{{ data.category || "" }}</template>
      <template #title>{{ data.title || "" }}</template>
      <template #description>{{
        data.description || ""
      }}</template>
      <ContentRenderer :value="data" class="markdown" />
    </NuxtLayout>
  </div>
</template>
