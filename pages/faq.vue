<template>
  <section class="min-h-screen pt-36 sm:pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-5">
          <h1 class="uppercase tracking-wider text-primary-500 font-bold">
            FAQ
          </h1>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-12">
            <div class="flex flex-col gap-5">
              <h2 class="text-3xl sm:text-4xl font-extrabold">
                Wie können wir helfen?
              </h2>
              <span class="text-xl sm:text-2xl font-medium text-gray-500">
                Du hast Fragen? Wir sind da um dir zu helfen.
              </span>
            </div>
          </div>
          <div class="flex justify-center">
            <FormKit
              type="text"
              :floatingLabel="false"
              placeholder="Suche nach Stichworten"
              prefix-icon="search"
              suffix-icon="xmark"
              @suffix-icon-click="filter = ''"
              outer-class="py-12 w-full max-w-2xl"
              :modelValue="filter"
              @update:modelValue="filter = $event"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-12">
          <Accordion :items="qa" itemKey="name" :active="active" @setActive="active = $event" border arrow collapsible>
            <template #title="{ item }">
              <span v-html="wrapWithEmTags(filter, item.q)"/>
            </template>
            <template #content="{ item }">
              <div v-html="wrapWithEmTags(filter, item.a)" />
                <div
                  class="flex flex-wrap gap-1 mt-3"
                  v-if="filter.length >= 2"
                >
                <span
                  v-for="tag in item.tags.filter((e) =>
                    e.toLowerCase().includes(filter.toLowerCase())
                  )"
                  v-html="tag"
                  class="text-sm py-1 px-2 leading-none rounded bg-neutral-300"
                /></div
              >
            </template>
          </Accordion>
            <div class="flex flex-col gap-5">
              <div class="sm:sticky sm:top-5 my-12 sm:my-0 flex flex-col gap-5">
                <p class="">
                  Deine Frage ist nicht dabei? Dann ruf an oder schreib uns eine
                  Email!
                </p>
                <div
                  class="flex flex-col gap-2 p-5 rounded-lg font-medium bg-primary-300/20 w-full"
                >
                  <span
                    class="text-sm uppercase tracking-wider font-bold text-neutral-500"
                  >
                    Kontakt
                  </span>
                  <ul class="text-sm font-bold flex flex-col gap-2 items-start">
                    <li
                      v-for="{ icon, text, link, name } in contact"
                      :key="name"
                    >
                      <NuxtLink :to="link" class="flex items-center gap-2"
                        ><ClientOnly
                          ><FontAwesomeIcon
                            :icon="icon"
                            class="text-primary-600" /></ClientOnly
                        >{{ text }}</NuxtLink
                      >
                    </li>
                  </ul>
                </div>
                <!-- <Button class="max-w-min !bg-gray-800 hover:!bg-gray-900"
                  >Kontakt aufnehmen<ClientOnly
                    ><FontAwesomeIcon
                      icon="arrow-right"
                      class="text-sm" /></ClientOnly
                ></Button> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Accordion from "@/components/organisms/Accordion/Accordion.vue";
import Button from "~/components/molecules/Button.vue";

definePageMeta({
  title: "Angebote",
  description:
    "Hier wirst du deinen Weg finden und kannst im Wald oder mit den Pferden einen Prozess der Heilung zu beginnen.",
});
const active = ref([] as number[]);
const filter = ref("");
watch(
  () => filter.value,
  (query) => {
    if (query.length < 2) return (active.value = []);

    active.value = qa.map((item, i) =>
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      item.a.toLowerCase().includes(filter.value.toLowerCase()) ||
      item.tags.some((e) =>
        e.toLowerCase().includes(filter.value.toLowerCase())
      )
        ? i
        : -1
    );
  }
);
function wrapWithEmTags(query: string, text: string) {
  if (query.length < 2) return text;
  const regex = new RegExp(query, "gi");
  const wrappedText = text.replace(regex, "<em>$&</em>");
  return wrappedText;
}

const qa = [
  {
    q: "Welchen Service bietet RightsPlus für mich an?",
    a: "RightsPlus bietet dir den Service der Durchsetzung deiner Ansprüche bei Flugverspätungen, Flugausfällen oder verpassten Anschlussflügen an.",
    tags: [
      "Dienstleistung",
      "Rechtsvertretung",
    ],
  },
  {
    q: "Welchen Geldbetrag erhalte ich im Falle der erfolgreichen Durchsetzung des Anspruchs?",
    a: "Die genaue Höhe des Geldbetrags hängt von verschiedenen Faktoren ab, wie zum Beispiel der Flugstrecke und der Dauer der Verspätung.",
    tags: [
      "Vergütung",
      "Erfolgreiche Durchsetzung",
      "Flugstrecke",
      "Verspätungsdauer",
    ],
  },
  {
    q: "Muss ich einen Gutschein bzw. eine Gutschrift seitens der Fluggesellschaft akzeptieren?",
    a: "Nein. Die Fluggesellschaft benötigt dazu dein schriftliches Einverständnis. Es wird empfohlen, den Gutschein bzw. die Gutschrift nur dann anzunehmen, wenn du wirklich damit zufrieden bist. Häufig erhält man eine Gutschrift bzw. einen Gutschein, welcher nicht der tatsächlichen Höhe der zu erbringenden Entschädigungsleistung entspricht.",
    tags: [
      "Gutschein",
      "Gutschrift",
      "Fluggesellschaft",
      "Einverständnis",
      "Entschädigungsleistung",
    ],
  },
  {
    q: "Was muss ich für den Service von RightsPlus bezahlen?",
    a: "Die genauen Kosten für den Service von RightsPlus können je nach Fall unterschiedlich sein. Es wird empfohlen, dich direkt an RightsPlus zu wenden, um Informationen über die anfallenden Kosten zu erhalten.",
    tags: ["Servicekosten", "Kosten", "Fallabhängig"],
  },
  {
    q: "Entstehen für mich auch Kosten im Falle des Nichterfolgs?",
    a: "Im Falle des Nichterfolgs entstehen dir in der Regel keine Kosten. RightsPlus arbeitet in vielen Fällen auf Basis von Erfolgsgebühren, das bedeutet, dass nur im Erfolgsfall eine Gebühr fällig wird.",
    tags: ["Kosten", "Nichterfolg", "Erfolgsgebühren"],
  },
  {
    q: "Welchen Geldbetrag erhalte ich im Falle der erfolgreichen Durchsetzung des Anspruchs?",
    a: "Die genaue Höhe des Geldbetrags hängt von verschiedenen Faktoren ab, wie zum Beispiel der Flugstrecke und der Dauer der Verspätung.",
    tags: [
      "Geldbetrag",
      "Erfolgreiche Durchsetzung",
      "Flugstrecke",
      "Verspätungsdauer",
    ],
  },
  {
    q: "Muss ich einen Gutschein bzw. eine Gutschrift seitens der Fluggesellschaft akzeptieren?",
    a: "Nein. Die Fluggesellschaft benötigt dazu dein schriftliches Einverständnis. Es wird empfohlen, den Gutschein bzw. die Gutschrift nur dann anzunehmen, wenn du wirklich damit zufrieden bist. Häufig erhält man eine Gutschrift bzw. einen Gutschein, welcher nicht der tatsächlichen Höhe der zu erbringenden Entschädigungsleistung entspricht.",
    tags: [
      "Gutschein",
      "Gutschrift",
      "Fluggesellschaft",
      "Einverständnis",
      "Entschädigungsleistung",
    ],
  },
  {
    q: "Was muss ich für den Service von RightsPlus bezahlen?",
    a: "Die genauen Kosten für den Service von RightsPlus können je nach Fall unterschiedlich sein. Es wird empfohlen, dich direkt an RightsPlus zu wenden, um Informationen über die anfallenden Kosten zu erhalten.",
    tags: ["Servicekosten", "Kosten", "Fallabhängig"],
  },
  {
    q: "Entstehen für mich auch Kosten im Falle des Nichterfolgs?",
    a: "Im Falle des Nichterfolgs entstehen dir in der Regel keine Kosten. RightsPlus arbeitet in vielen Fällen auf Basis von Erfolgsgebühren, das bedeutet, dass nur im Erfolgsfall eine Gebühr fällig wird.",
    tags: ["Kosten", "Nichterfolg", "Erfolgsgebühren"],
  },
];

const contact = [
  {
    name: "phone",
    icon: "phone",
    text: "+49 (0) 6181 – 369 86 46",
    link: "tel:+4961813698646",
  },
  {
    name: "email",
    icon: "at",
    text: "info@rightsplus.de",
    link: "mailto:info@rightsplus.de",
  },
];
</script>