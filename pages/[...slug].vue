<script setup lang="ts">
const route = useRoute();
const { query, currentContent } = useI18nContent();
const { data = {} } = useAsyncData(route.fullPath, query);
definePageMeta({
  layout: "generic",
});
console.log("currentContent", currentContent.value, data);
</script>
<template>
  <ContentRenderer :value="data" class="markdown" />
</template>
