<template>
  <div class="relative grid grid-cols-4 gap-12 p-12 page overflow-hidden"><slot /></div>
</template>
<style lang="postcss" scoped>
.page {
  @media screen {
    width: 210mm;
    min-height: 297mm;
    @apply shadow-xl rounded mx-auto my-12 bg-white;
  }
}
</style>
<style lang="postcss">
@media print {
  body {
    background: white !important;
  }
}
</style>
