<script setup lang="ts">
definePageMeta({
  layout: "default",
  classes: {
    header: "text-white",
  },
});
const { t } = useI18n();
const { queryLocaleContent } = useI18nContent('pages');
const route = useRoute();
const { data } = useAsyncData("about-rights-plus", () => queryLocaleContent(route.fullPath).first());
</script>

<template>
  <div>
    <NuxtLayout>
      <section class="min-h-screen pt-48 pb-8 bg-gray-900 text-white">
        <img
          src="/images/empty-airport.jpg"
          alt="Airport"
          class="image absolute inset-0 min-h-[70vw] w-full object-cover object-top -z-1 top-8 md:top-6 lg:top-0"
          quality="80"
          width="1920"
          format="webp"
        />
        <div class="max-w-4xl mx-auto px-5 sm:px-12 h-full relative z-1">
          <div class="flex flex-col gap-12 leading-0 h-full">
            <div class="flex flex-col gap-5 mt-[20vw] lg:mt-[40vh] mb-48">
              <span class="uppercase tracking-wider text-primary-600 font-bold"
                >{{t(data?.category)}}</span
              >
              <div class="flex flex-col gap-5 drop-shadow-xl">
                <h1 class="text-4xl sm:text-6xl font-extrabold">{{ t(data?.title || "") }}</h1>
                <span class="text-2xl sm:text-3xl font-medium">
                  {{ t(data?.lead || "") }}
                </span>
                <ContentRenderer
                  :value="data || {}"
                  class="markdown"
                />
              </div>
              <div class="flex items-center gap-8 mt-24">
                <img
                  src="/bawa.jpg"
                  alt="Joachim Bawa"
                  quality="80"
                  format="webp"
                  width="128"
                  height="128"
                  class="object-cover rounded-full w-16 h-16 grayscale contrast-125"
                />
                <div class="flex flex-col">
                  <span class="text-xl font-bold">Joachim Bawa</span>
                  <span class="text-base text-neutral-400"
                    >{{ t('managingDirector')}}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.image {
  /* from 0 to 5% */
  /* from 50% to 100% */
  mask: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25) 5%,
    rgba(0, 0, 0, 1) 15% 50%,
    transparent 100%
  );
  @media screen and (max-width: 1024px) {
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 20% 50%,
      transparent 100%
    );
  }
}
</style>
