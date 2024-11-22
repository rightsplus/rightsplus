<template>
  <ClientOnly>
    <OrganismsPricesAndServicesCalculator class="my-8 bg-yellow-700/5 rounded-xl p-5 sm:p-8" />
    <template #fallback><slot /></template>
  </ClientOnly>
</template>
