<template>
  <e-html lang="en">
    <e-text>
      View on GitHub: {{ url }}
    </e-text>
  </e-html>
</template>
<script lang="ts" setup>
defineProps<{ url: string }>();
</script>
