<script setup lang="ts">
const gray = {
  "50": "hsl(200deg 60% 98%)",
  "100": "hsl(200deg 44% 94%)",
  "200": "hsl(200deg 32% 88%)",
  "300": "hsl(200deg 25% 80%)",
  "400": "hsl(200deg 20% 64%)",
  "500": "hsl(200deg 16% 48%)",
  "600": "hsl(200deg 16% 32%)",
  "700": "hsl(200deg 17% 24%)",
  "800": "hsl(200deg 35% 16%)",
  "900": "hsl(200deg 45% 8%)",
  "950": "hsl(217deg 63% 5%)",
};
import {
  Preview,
  Tailwind,
  Html,
  Head,
  Body,
  Font,
} from "@vue-email/components";
defineProps<{ preview?: string }>();
</script>
<template>
  <Tailwind
    :config="{
      theme: {
        extend: {
          colors: {
            gray,
          },
        },
      },
    }"
  >
    <Html>
      <Head>
        <Font
          font-family="Inter"
          fallback-font-family="Verdana"
          :web-font="{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCo3FwrK3iLTcviYwYZ8UA3.woff2',
            format: 'woff2',
          }"
          font-weight="normal"
          font-style="normal"
        />
        <Font
          font-family="Inter"
          fallback-font-family="Verdana"
          :web-font="{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2',
            format: 'woff2',
          }"
          font-weight="bold"
          font-style="normal"
        />
      </Head>
      <Body
        class="text-base sm:text-lg text-gray-500 bg-neutral-200 flex flex-col gap-5 p-3 sm:p-5"
      >
        <Preview class="absolute text-[0.1px] opacity-0">{{ preview }}</Preview>
        <slot />
      </Body>
    </Html>
  </Tailwind>
</template>
