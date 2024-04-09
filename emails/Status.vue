<template>
  <EmailFrame>
    <EmailCard>
      <EmailPreTitle>{{ preTitle }}</EmailPreTitle>
      <EmailTitle is="h1">{{ title }}</EmailTitle>
      <EMarkdown :source="body" :custom-styles="{
        h1: 'text-2xl font-bold',
        h2: 'text-xl font-bold',
        h3: 'text-lg font-bold',
        h4: 'text-base font-bold',
        h5: 'text-sm font-bold',
        h6: 'text-xs font-bold',
        p: 'text-sm sm:text-base',
        a: 'text-blue-500 underline',
        ul: 'list-disc pl-5',
        ol: 'list-decimal pl-5',
        li: 'mb-2',
        blockquote: 'border-l-4 border-gray-300 pl-3',
      }" />
    </EmailCard>
  </EmailFrame>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  title: string;
  preTitle: string;
  body: string;
}>();

</script>
