<template>
  <footer
    class="w-full text-3xs leading-tight fixed bottom-0 bg-neutral-100 text-neutral-500 z-50 p-12 py-3 text-center flex items-center justify-center flex-col"
  >
    <span class="text-neutral-500 max-h-[10mm]">{{
      [from.name, from.address, [from.postalCode, from.city].join(" ")]
        .filter(Boolean)
        .join(" · ")
    }}</span>
    <span>{{
      [
        "UStID.: DE 295514098",
        "DE81 5019 0000 6401 5089 19",
        "Commerzbank AG",
      ].join(" · ")
    }}</span>
    <span>
      Eingetragener Inkassodienstleister nach § 10 Abs. 1 Nr. 1 RDG, OLG Köln,
      3712-1104(7)</span
    >
  </footer>
</template>

<script setup lang="ts">
const from = {
  name: "RightsPlus GbR",
  address: "Zülpicher Platz 18",
  postalCode: "50674",
  city: "Köln",
};
</script>
<style lang="postcss" scoped>
footer {
  @media screen {
    @apply absolute;
  }
}
</style>
