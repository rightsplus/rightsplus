<template>
  <EButton
    class="p-4 rounded-xl bg-orange-500 text-white"
    :href="href"
  >
    <slot />
  </EButton>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  href: string;
}>();
</script>