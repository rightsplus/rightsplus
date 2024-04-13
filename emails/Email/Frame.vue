<template>
  <EmailBase>
    <EContainer class="max-w-3xl -mb-3">
      <EImg
        width="24"
        height="24"
        src="/rights-plus-logo.png"
        alt="RightsPlus"
        class="inline-block align-middle"
      />
      <EText class="text-gray-800 text-sm inline-block align-middle ml-2">
        <span class="font-bold">RightsPlus</span> <span>Flights</span>
      </EText>
    </EContainer>
    <slot />
    <EContainer
      class="bg-gray-800 text-gray-400 text-xs rounded-xl py-1 px-5 sm:py-8 sm:px-12 max-w-3xl mb-12 leading-none"
    >
      <EText class="mb-0 sm:mb-5"
        ><span class="font-bold">{{ company }}</span
        ><br />{{ address }}<br />{{ moreDetails }}</EText
      >
      <EText>© {{ new Date().getFullYear() }} RightsPlus</EText>
    </EContainer>
  </EmailBase>
</template>
<script setup lang="ts">
const company = "RightsPlus GbR";
const address = ["Zülpicher Platz 18", "50674 Köln"].join(" · ");
const moreDetails = [
  "Geschäftsführer: Joachim Bawa",
  "Amtsgericht Köln",
].join(" · ");
</script>
