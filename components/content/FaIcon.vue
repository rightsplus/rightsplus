<template>
  <FontAwesomeIcon :icon="icon" />
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
}>();
</script>
