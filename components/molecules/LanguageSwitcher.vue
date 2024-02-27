<template>
  <button
    @click="isOpen = true"
    class="flex gap-2 hover:bg-gray-700 p-3 pr-5 rounded-xl"
  >
      <span class="text-base min-w-[auto]">{{
        locale.split("-")[0].toLocaleUpperCase()
      }}</span>
    <span
      class="relative after:absolute after:inset-[1px] after:bg-white/60 after:rounded-full shrink-0"
    >
      <img
        :src="`/locales/${locale}.svg`"
        :alt="locale"
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
      <button
        v-for="l in availableLocales"
        @click="setLocale(l)"
        class="flex items-center gap-2 hover:bg-blue-100 p-4 rounded-lg"
        :class="{
          'bg-blue-100 hover:bg-blue-50': locale === l
        }"
      >
        <img
          :src="`/locales/${l}.svg`"
          :alt="locales[l as keyof typeof locales]"
          class="relative z-10 w-6 shrink-0"
        />
        <span class="text-base">{{ locales[l as keyof typeof locales] }}</span>
      </button>
    </div>
  </Popup>
</template>

<script setup lang="ts">
const { locale, availableLocales, t } = useI18n();
const isOpen = ref(false);
const locales = ref({
  de: "Deutsch",
  "de-CH": "Deutsch (Schweiz)",
  "de-AT": "Deutsch (Österreich)",
  en: "English",
  "en-GB": "English (UK)",
  fr: "Français",
  es: "Español",
  it: "Italiano"
});
const setLocale = (l: string) => {
  locale.value = l;
  setTimeout(() => (isOpen.value = false), 100);
};
</script>
