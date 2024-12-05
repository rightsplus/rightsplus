<script setup lang="ts">
defineProps<{
  is?: string;
}>();
</script>
<template>
  <Component :is="is || 'div'"><slot /></Component>
</template>
