<template>
  <section class="sm:py-24 bg-gray-200 relative">
    <NuxtImg
      src="/images/mkjr_-8QsqXeJMvOU-unsplash.jpg"
      class="object-cover w-full h-full absolute inset-0 opacity-100 brightness-80 saturate-50"
      quality="50"
      width="1920"
      loading="lazy"
      format="webp"
    />
    <div class="max-w-full sm:max-w-xl mx-auto p-5 sm:p-12 h-full relative z-1 bg-white sm:rounded-xl grid gap-8">
      <div class="flex flex-col justify-around gap-4 leading-0 h-full">
        <h2 class="text-2xl sm:text-3xl font-bold my-0">
          {{ t('feeCalculator.title') }}
        </h2>
        <p class="text-sm">
          {{ t('feeCalculator.description') }}
        </p>
      </div>
      <OrganismsPricesAndServicesCalculator
        class="text-base"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
