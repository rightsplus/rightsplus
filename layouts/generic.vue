<script setup lang="ts">
import Header from "@/components/species/Header.vue";
import Footer from "@/components/species/Footer.vue";
const slots = useSlots()

onMounted(() => {
  scrollTo({ top: 0, behavior: "smooth" })
});
const route = useRoute();

type Props = {
  footer?: boolean;
};
withDefaults(defineProps<Props>(), {
  footer: true,
});
</script>

<template>
  <div class="flex flex-col">
    <Header class="w-full z-50 absolute" />
    <main
      class="min-h-screen py-48 w-full max-w-7xl mx-auto"
      :class="route.meta.classes?.main"
    >
      <div class="px-5 sm:px-12 h-full col-start-2">
        <article class="gap-y-12 grid grid-cols-1 sm:grid-cols-[1fr,min(896px,calc(100vw-6rem)),1fr] [&>*]:col-start-2">
          <div class="flex flex-col gap-3 leading-0">
            <slot name="before" />
            <span
              v-if="$slots.category"
              class="uppercase tracking-wider text-primary-500 font-bold"
              ><slot name="category"
            /></span>
            <h1
              v-if="$slots.title"
              class="text-4xl sm:text-6xl font-extrabold hyphens-auto break-words text-balance"
            >
              <slot name="title" />
            </h1>
            <span
              v-if="$slots.lead"
              class="text-2xl sm:text-3xl font-medium text-neutral-500"
            >
              <slot name="lead" />
            </span>
          </div>
          <slot />
        </article>
      </div>
    </main>
    <Footer class="w-full mt-auto" v-if="footer" />
  </div>
</template>
