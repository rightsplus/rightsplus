<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <main class="relative top-36 mb-36 max-w-4xl mx-auto w-full px-12">
      <h1 v-if="$slots.title" class="font-bold text-left text-4xl sm:text-6xl my-24 hyphens-auto leading">
        <slot name="title" />
      </h1>
      <div class="pb-36">
      <slot />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Header from "~/components/species/Header.vue";
import Footer from "~/components/species/Footer.vue";
export default defineComponent({
  components: {
    Header,
    Footer,
  },
});
</script>

<style scoped></style>
