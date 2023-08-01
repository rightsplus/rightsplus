<template>
  <section class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
        <div class="flex flex-col gap-5">
          <h1 class="text-4xl sm:text-6xl font-extrabold">
            {{ ucFirstAll(useRoute().params.slug as string) }}
          </h1>
          <span
            class="text-2xl sm:text-3xl font-medium text-gray-500 hyphens-auto"
          >
            {{ useRoute().meta.description }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "",
  description: "",
});
onMounted(() => {
  useAppState().headerColor = "dark";
});
onUnmounted(() => {
  useAppState().headerColor = null;
});

const ucFirstAll = (string: string) => {
  return string
    .replaceAll("-", " ")
    .replaceAll("faq", "FAQ")
    .replaceAll("ue", "ü")
    .replaceAll("ae", "ä")
    .replaceAll("oe", "ö")
    .split(" ")
    .map((word) => ucfirst(word))
    .join(" ")
    .replaceAll("Rights Plus", "RightsPlus");
};
const ucfirst = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
</script>

<style scoped></style>
