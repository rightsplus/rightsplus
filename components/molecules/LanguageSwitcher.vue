<script setup lang="ts">
import type { LocaleObject } from "~/config/i18n";
const switchLocalePath = useSwitchLocalePath();

const { locale, locales, localeProperties, t } = useI18n();
const isOpen = ref(false);
</script>

<template>
  <button
    @click="isOpen = true"
    class="flex gap-2 p-3 rounded-lg"
    v-bind="$attrs"
  >
    <span class="text-base min-w-[auto] whitespace-nowrap">{{
      localeProperties.code.toUpperCase()
    }}</span>
    <span
      class="relative after:absolute after:inset-[1px] after:bg-white/60 after:rounded-full shrink-0"
    >
      <img
        :src="`/locales/${localeProperties.language}.svg`"
        :alt="localeProperties.name"
        class="relative z-10 w-6 shrink-0"
      />
    </span>
  </button>
  <Popup
    :open="isOpen"
    @closeOutside="isOpen = false"
    @close="isOpen = false"
    class="p-5 sm:p-8 @container"
    :title="t('selectLanguage')"
    titleClass="!text-xl"
  >
    <div class="grid grid-cols-1 @sm:grid-cols-2 gap-4">
      <NuxtLink
        v-for="{ language, name, code } in (locales as LocaleObject[])"
        :key="code"
        :to="switchLocalePath(code)"
        @click="isOpen = false"
        class="flex items-center gap-2 hover:bg-blue-100 p-4 rounded-lg"
        :class="{
          'bg-blue-100 hover:bg-blue-50': locale === code,
        }"
      >
      <span class="relative after:absolute after:inset-[1px] after:bg-white/60 after:rounded-full">
        <img
          :src="`/locales/${language}.svg`"
          :alt="name"
          class="relative z-10 w-6 shrink-0"
        />
      </span>
        <span class="text-base">{{ name }}</span>
      </NuxtLink>
    </div>
  </Popup>
</template>
