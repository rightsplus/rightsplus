<template>
  <EMarkdown
    :source="items.map((e, i) => `${i + 1}. **${e.title}** <br/>${e.body}`).join('\n')"
    :custom-styles="{
      ol: { paddingInlineStart: '20px' },
      ul: { paddingInlineStart: '20px' },
      li: { marginBlock: '10px' },
    }"
  />
</template>
<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  items: { title: string; body?: string }[];
}>();
</script>
