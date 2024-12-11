<template>
  <section
    class="py-12 md:py-36 bg-gradient-to-tr from-primary-700 to-primary-300 text-white relative"
  >
    <div
      class="grid gap-12 max-w-3xl mx-auto px-5 sm:px-12 h-full relative z-1"
    >
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-6">
          <h2 class="text-4xl font-bold">
            {{ t('cta.title') }}
          </h2>
          <h3 class="text-xl font-medium">
            {{ t('cta.subtitle') }}
          </h3>
        </div>
        <Button class="text-white bg-gray-800 hover:bg-gray-900 mr-auto" to="claim-new"
          >{{ t('checkCompensationNow')}}</Button
        >
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const { t } = useI18n()
</script>