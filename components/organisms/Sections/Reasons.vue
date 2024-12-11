<template>
  <section class="py-24 bg-grey-200 relative">
    <div
      class="grid gap-12 max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1"
    >
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div v-for="(section, i) in sections" class="flex flex-col gap-4">
          <span
            class="text-xl sm:text-2xl text-primary-600 font-bold uppercase tracking-wide"
          >
            {{ String(i + 1).padStart(2, "0") }}
          </span>
          <h2 class="text-3xl sm:text-5xl font-bold">
            {{ t(section.titleKey) }}
          </h2>
          <p class="text-lg text-gray-600 font-medium">
            {{ t(section.descriptionKey) }}
          </p>
        </div>
        <Button
          class="text-white !bg-gray-800 hover:!bg-gray-900 mr-auto"
          to="claim-new"
          >{{ t('checkCompensationNow') }}</Button
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();

const sections = [
  {
    titleKey: t("reasonsSection.professionalExpertise.title"),
    descriptionKey: t("reasonsSection.professionalExpertise.description")
  },
  {
    titleKey: t("reasonsSection.completeProcess.title"),
    descriptionKey: t("reasonsSection.completeProcess.description")
  },
  {
    titleKey: t("reasonsSection.noRisk.title"),
    descriptionKey: t("reasonsSection.noRisk.description")
  }
];
</script>
