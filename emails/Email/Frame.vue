<script setup lang="ts">
import { Container, Text, Img } from "@vue-email/components";
defineProps<{ preview?: string }>();
const company = "RightsPlus";
const name = "Joachim Bawa";
const address = ["Zülpicher Platz 18", "50674 Köln"].join(
  "&ensp;&middot;&ensp;"
);
const moreDetails = [
  "UstID: DE295514098",
  "Eingetragener Inkassodienstleister nach § 10 Abs. 1 Nr. 1 RDG",
  "OLG Köln, Az. 3712-1104(7)",
  "Vermögensschadenhaftpflichtversicherung: ERGO Versicherung AG",
].join("&ensp;&middot;&ensp;");
</script>
<template>
  <EmailBase :preview="preview">
    <Container class="max-w-3xl mb-5 sm:mb-8 mt-3 sm:mt-5">
      <Img
        width="32"
        height="32"
        src="https://home-5015946253.app-ionos.space/rights-plus-logo.png"
        alt="RightsPlus"
        class="inline-block align-middle"
      />
      <Text class="text-gray-800 text-base inline-block align-middle ml-2 my-0">
        <span class="font-bold">RightsPlus</span> <span>Flights</span>
      </Text>
    </Container>
    <slot />
    <Container
      class="bg-gray-700 text-gray-300 text-xs rounded-xl py-1 px-5 sm:py-8 sm:px-12 max-w-3xl mt-5 sm:mt-8 mb-12 leading-none"
    >
      <Img
        width="80"
        height="80"
        src="https://home-5015946253.app-ionos.space/rights-plus-logo-large.png"
        alt="RightsPlus"
        class="w-20 h-20 mt-5"
      />
      <Text class="mb-0 sm:mb-5"
        ><span class="font-bold">{{ company }}</span
        ><br />{{ name }}<br />{{ address }}</Text
      >
      <Text class="mb-0 sm:mb-5 text-base">{{
        `Copyright © ${new Date().getFullYear()} Rights Plus. All rights reserved.`
      }}</Text>
      <Text class="mb-2 text-gray-500 text-base">{{ moreDetails }}</Text>
    </Container>
  </EmailBase>
</template>
