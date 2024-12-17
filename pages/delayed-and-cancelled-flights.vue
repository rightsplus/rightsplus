<template>
  <div>
    <NuxtLayout>
      <DisruptedFlights page class="h-full mt-24 md:mt-0 md:py-36"
    /></NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import DisruptedFlights from "@/components/organisms/Sections/DisruptedFlights.vue";
definePageMeta({
  layout: "default",
});

const title = "Aktuelle Verspätungen und Annullierungen";
const description = `Hattest du kürzlich eine Flugverspätung oder wurde dein Flug
          annulliert? Hier findest du eine Übersicht über aktuelle
          Flugverspätungen und Annullierungen.`;
const image =
  "http://localhost:3000/_ipx/w_1600&f_webp&q_70/images/billow926-jah2Y1d-6Cc-unsplash.jpg";
const url = "https://www.rightsplus.com/delayed-and-cancelled-flights";
useSeoMeta({
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: image,
  ogUrl: url,
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: image,
  twitterCard: "summary",
});

useHead({
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
  ],
});
</script>
