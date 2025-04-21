<template>
  <div>
    <NuxtLayout name="dashboard">
      <div>Welcome</div>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
// const localePath = useLocalePath();

definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  redirect: "/de/admin/claim",
});
</script>
