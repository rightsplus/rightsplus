<template>
  <div>
    <NuxtLayout>
      <div class="min-h-screen py-36 bg-neutral-200 mx-auto px-12">
        <Authentication />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import Authentication from "@/components/core/Authentication.vue";
definePageMeta({
  middleware: ["auth"],
});
const user = useSupabaseUser();
const router = useRouter();
const route = useRoute();
watch(user, (val) => {
  if (val)
    router.push(useLocalePath()((route.query.redirect as string) || "index"));
});
</script>
