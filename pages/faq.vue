<template>
  <section class="min-h-screen pt-36 sm:pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-5">
          <h1 class="text-4xl sm:text-6xl font-extrabold">FAQ</h1>
          <p
            class="text-2xl sm:text-3xl font-medium text-gray-500 hyphens-auto"
          >
            Hast du Fragen?
          </p>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div class="bg-white rounded-xl p-5">Kundenservice</div>
            <div class="bg-white rounded-xl flex flex-col p-5 gap-5">
              <div
                v-for="{ q, a, name } in qa"
                :key="name"
                class="flex flex-col"
              >
                <span class="font-bold">{{ q }}</span>
                <span class="">{{ a }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Angebote",
  description:
    "Hier wirst du deinen Weg finden und kannst im Wald oder mit den Pferden einen Prozess der Heilung zu beginnen.",
});
const qa = [
  {
    name: "a",
    q: "Was macht man am besten?",
    a: "Am besten du gehst deinen Weg.",
  },
  {
    name: "a",
    q: "Was noch?",
    a: "Überleg dir was du willst und kommunizier ehrlich.",
  },
];
</script>

<style scoped></style>
