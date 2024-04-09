<template>
  <EHeading class="font-bold my-5" :is="is || 'h1'" :class="{
    'text-3xl sm:text-5xl': !is || is === 'h1',
    'text-2xl sm:text-3xl': !is || is === 'h2',
    'text-xl sm:text-2xl': !is || is === 'h3',
  }">
    <slot />
  </EHeading>
</template>
<script setup lang="ts">
import { defineProps } from "vue"
defineProps<{
  is?: "h1" | "h2" | "h3"
}>()
</script>