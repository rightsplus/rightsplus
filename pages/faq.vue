<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Accordion from "@/components/organisms/Accordion/Accordion.vue";
import type { MarkdownNode } from "@nuxt/content";

definePageMeta({
  layout: "generic",
  classes: {
    main: "max-w-7xl",
  },
});
const { t } = useI18n();
const active = ref([] as number[]);
const filter = ref("");
function wrapWithEmTags(query: string, text: string) {
  if (query.length < 2) return text;
  const regex = new RegExp(query, "gi");
  const wrappedText = text.replace(regex, "<em>$&</em>");
  return wrappedText;
}

const { queryLocaleContent } = useI18nContent('pages');
const route = useRoute();
const { data } = useAsyncData("faq", () =>
  queryLocaleContent(route.fullPath).first()
);

const qa = computed(() => {
  return convertToQAFormat(data.value?.body?.value || []);
});

watch(filter, (query) => {
  if (query.length < 2) return (active.value = []);

  active.value = qa.value.map((item, i) =>
    item.q.toLowerCase().includes(query.toLowerCase()) ||
    item.a.toLowerCase().includes(filter.value.toLowerCase()) ||
    item.tags?.some((e) => e.toLowerCase().includes(filter.value.toLowerCase()))
      ? i
      : -1
  );
});
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
type BlockquoteChild = {
  type: "text" | "element";
  value: string;
  tag?: string;
  props?: Record<string, any>;
  children?: BlockquoteChild[];
};

type ProcessedObject = {
  q: string;
  a: string;
  tags?: string[];
};

function convertToQAFormat(input: any[]): ProcessedObject[] {
  const array = input
    .map((item, index) => {
      const [tag, __, content] = item;

      if (tag !== "h2") return;

      const question = content;

      if (!question) return;

      const nextQuestionIndex = input.slice(index + 1).findIndex(([tag]) => tag === "h2");

      const answer = input
        .slice(index + 1, nextQuestionIndex + index + 1)
        .filter(([tag]) => tag === "p")
        .map(([_,__, content]) => `<p>${content}</p>`).join('')

      if (!answer) return;

      const tags = input
        .slice(index + 1)
        .filter(([tag]) => tag === "blockquote")
        .map(([_, __, children]) => {
          const [childTag, childAttributes, childContent] = children;
          return childContent as string;
        });

      return {
        q: question,
        a: answer,
        tags: tags,
      };
    })
    .filter((e) => !!e);

  return array;
}

</script>
<template>
  <div>
    <NuxtLayout name="generic">
      <template #category>{{ data?.category }}</template>
      <template #title>{{ data?.title }}</template>
      <template #lead>{{ data?.lead }}</template>
      <div class="flex flex-col gap-5">
        <div class="flex justify-center">
          <FormKit
            type="text"
            :floatingLabel="false"
            :placeholder="t('faq.search')"
            prefix-icon="magnifying-glass"
            :suffix-icon="filter ? 'xmark' : ''"
            @suffix-icon-click="filter = ''"
            outer-class="py-12 w-full max-w-2xl"
            :modelValue="filter || ''"
            @update:modelValue="filter = $event"
          />
        </div>
        <h3 class="text-3xl font-bold mb-5">FAQ</h3>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-12 [&_em]:bg-primary-300 [&_em]:ring-2 [&_em]:ring-primary-300 [&_em]:rounded [&_em]:not-italic"
        >
          <Accordion
            :classes="{
              outer: 'lg:col-span-2',
            }"
            :items="qa"
            itemKey="name"
            :active="active"
            @setActive="active = $event"
            border
            arrow
            collapsible
          >
            <template #title="{ item }">
              <span v-html="wrapWithEmTags(filter, item.q)" />
            </template>
            <template #content="{ item }">
              <div v-html="wrapWithEmTags(filter, item.a)" class="markdown" />
              <div class="flex flex-wrap gap-1 mt-3" v-if="filter.length >= 2">
                <span
                  v-for="tag in (item.tags || []).filter((e: string) =>
                    e.toLowerCase().includes(filter.toLowerCase())
                  )"
                  v-html="tag"
                  class="text-sm py-1 px-2 leading-none rounded bg-orange-100 text-orange-700"
                />
              </div>
            </template>
          </Accordion>
          <div class="flex flex-col gap-5">
            <div class="sm:sticky sm:top-5 my-12 sm:my-0 flex flex-col gap-5">
              <p class="">
                {{ t("faq.not_found") }}
              </p>
              <div
                class="flex flex-col gap-2 p-5 rounded-lg font-medium bg-primary-300/20 w-full"
              >
                <span
                  class="text-sm uppercase tracking-wider font-bold text-neutral-500"
                >
                  {{ t("faq.contact") }}
                </span>
                <ul class="text-sm font-bold flex flex-col gap-2 items-start">
                  <li v-for="{ icon, text, link, name } in contact" :key="name">
                    <NuxtLink :to="link" class="flex items-center gap-2"
                      ><FontAwesomeIcon
                        :icon="icon"
                        class="text-primary-600"
                      />{{ text }}</NuxtLink
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
