<template>
  <div>
    <NuxtLayout name="dashboard">
      <div>Welcome</div>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});
</script>
