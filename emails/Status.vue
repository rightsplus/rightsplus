<template>
  <ETailwind>
    <EHtml>
      <EHead>
        <EFont
          font-family="Inter"
          fallback-font-family="Verdana"
          :web-font="{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCo3FwrK3iLTcviYwYZ8UA3.woff2',
            format: 'woff2',
          }"
          font-weight="normal"
          font-style="normal"
        />
      </EHead>
      <EBody class="text-gray-500 bg-neutral-100">
        <EContainer class="bg-white rounded-t-lg p-12 max-w-3xl text-lg">
          <EImg
            width="32"
            height="32"
            src="/rights-plus-logo.png"
            alt="RightsPlus"
          />
          <EText class="text-6xl">
            {{ preTitle }}
          </EText>
          <EText class="text-3xl font-bold text-gray-800">
            {{ title }}
          </EText>
          <EText
            v-for="paragraph in paragraphs"
            :key="paragraph"
            class="text-xl leading-relaxed"
            >{{ paragraph }}</EText
          >
        </EContainer>
        <EContainer
          class="bg-gray-800 text-primary-300 text-xs rounded-b-lg p-12 max-w-3xl flex flex-col mb-12"
        >
          <EText class="mb-12">{{ address }}<br />{{ moreDetails }}</EText>
          <EText>© {{ new Date().getFullYear() }} RightsPlus</EText>
        </EContainer>
      </EBody>
    </EHtml>
  </ETailwind>
</template>
<script setup lang="ts">

const props = defineProps<{
  firstName?: string;
  paragraphs: string[];
  preview: string;
  title: string;
  preTitle: string;
}>();

const address = ["RightsPlus GbR", "Zülpicher Platz 18", "50674 Köln"].join(
  " · "
);
const moreDetails = [
  "Geschäftsführer: Joachim Bawa",
  "Büro: Köln",
  "Amtsgericht Köln",
].join(" · ");
</script>
