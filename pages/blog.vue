<template>
  <section class="min-h-screen pt-36 sm:pt-48 pb-8 bg-neutral-200">
    <div class="max-w-5xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-5">
          <span class="uppercase tracking-wider text-primary-500 font-bold"
            >RightsPlus</span
          >
          <div class="flex flex-col gap-5 drop-shadow-xl">
            <h1 class="text-4xl sm:text-6xl font-extrabold">Blog</h1>
            <span class="text-2xl sm:text-3xl font-medium">
              Aktuelles aus dem Reiserecht
            </span>
          </div>
          <article
            v-for="article in articles"
            :key="article.id"
            class="bg-white rounded-lg p-5 grid gap-1"
          >
            <span class="text-sm">{{ time(article.createdAt) }}</span>
            <span class="text-xl font-bold">{{ article.title }}</span>
            <p class="text-base line-clamp-3">{{ article.excerpt }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const { locale } = useI18n();
const articles = ref([
  {
    id: "1238",
    title: "Warum wir das machen",
    excerpt:
      "Rights Plus bietet Dienstleistungen im Bereich der Durchsetzung von Entschädigungsansprüchen im Zusammenhang mit Flugverspätungen, Flugannullierungen und unfreiwilliger Umbuchung bzw. Beförderungsverweigerung gemäß der EU-Fluggastrechteverordnung.",
    createdAt: "2024-02-01T17:40:00.000Z",
  },
  {
    id: "1238",
    title: "Warum wir das machen",
    excerpt:
      "Rights Plus bietet Dienstleistungen im Bereich der Durchsetzung von Entschädigungsansprüchen im Zusammenhang mit Flugverspätungen, Flugannullierungen und unfreiwilliger Umbuchung bzw. Beförderungsverweigerung gemäß der EU-Fluggastrechteverordnung.",
    createdAt: "2024-02-01T17:40:00.000Z",
  },
]);

const time = (time: string) => {
  return new Date(time).toLocaleDateString(locale.value);
};
</script>

<style scoped></style>
