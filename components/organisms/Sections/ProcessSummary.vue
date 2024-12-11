<template>
  <section class="bg-neutral-100">
    <div
      class="grid gap-12 lg:grid-cols-2 max-w-7xl mx-auto p-5 sm:p-12 md:py-36 h-full relative z-1"
    >
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-6">
          <h2 class="text-3xl sm:text-5xl font-bold">
            {{ t("process.summary.mainTitle") }}
          </h2>
          <h3 class="text-xl sm:text-2xl text-gray-500 font-medium">
            {{ t("process.summary.subtitle") }}
          </h3>
        </div>
      </div>
      <div class="bg-white p-5 sm:p-12 rounded-2xl">
        <ol class="flex flex-col gap-8">
          <li
            v-for="item in process"
            :key="item.title"
            class="flex gap-5 items-center"
            :class="item.color"
          >
            <FontAwesomeIcon :icon="item.icon" />
            <div class="flex flex-col gap-1 leading-none">
              <span class="text-base leading-none text-gray-500">{{
                item.description
              }}</span>
              <span class="font-bold text-gray-800">{{ item.title }}</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const localePath = useLocalePath();
const { t } = useI18n();
const process = [
  {
    icon: "plane",
    color: "text-orange-500",
    title: t("process.summary.steps.check.title"),
    description: t("process.summary.steps.check.description"),
  },
  {
    icon: "file-pen",
    color: "text-blue-500",
    title: t("process.summary.steps.contact.title"),
    description: t("process.summary.steps.contact.description"),
  },
  {
    icon: "money-bill-1-wave",
    color: "text-green-500",
    title: t("process.summary.steps.receive.title"),
    description: t("process.summary.steps.receive.description"),
  },
];
</script>
