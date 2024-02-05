<template>
  <div class="grid grid-cols-4 gap-12 p-12 page">
    <div class="col-span-3 flex flex-col gap-12">
      <h1 class="text-4xl font-bold">{{t('assignmentLetter.title')}}</h1>
      <p class="whitespace-pre-line hyphens-auto">
        {{
          t("assignmentLetter.main", {
            name,
            address,
            postalCode,
            city,
            flightNumber,
            flightDate,
            departure,
            arrival,
            payment
          })
        }}
      </p>

      <div class="grid grid-cols-2 gap-5">
        <div class="grid gap-2">
          <div class="bg-neutral-100 rounded h-12 w-full" />
          <span class="text-sm text-neutral-500"
            >{{ t("place") }}, {{ t("date") }}</span
          >
        </div>
        <div class="grid gap-2">
          <div class="bg-neutral-100 rounded h-12 w-full" />
          <span class="text-sm text-neutral-500">{{ t("signature") }}</span>
        </div>
      </div>
    </div>
    <div class="col-span-1 flex flex-col gap-5">
      <div class="flex items-center gap-2 text-base">
        <Icon :icon="Logo" />
        <span class="font-bold">RightsPlus</span>
      </div>

      <div class="flex flex-col" v-for="item in aside">
        <span class="text-xs text-neutral-500" v-if="item.label">{{
          t(item.label)
        }}</span>
        <span class="text-sm">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Logo from "~/assets/logo";
const { query } = useRoute();
const { t } = useI18n();
const {
  name,
  address,
  postalCode,
  city,
  flightNumber,
  flightDate,
  departure,
  arrival,
  payment,
  date
} = {
  name: "Max Mustermann",
  address: "Musterstraße 1",
  postalCode: "12345",
  city: "Musterstadt",
  flightNumber: "LH1234",
  flightDate: "01.01.2022",
  departure: "MUC",
  arrival: "FRA",
  payment: "€ 250",
  date: new Date().toLocaleDateString()
};
const aside = [
  { label: "date", value: date },
  { label: "claimNumber", value: "RP71223456" },
  { value: "RightsPlus GbR\nSandeldamm 24\n63450 Hanau" },
  { value: "info@rightsplus.de" }
];
// const {
//   name,
//   address,
//   postalCode,
//   city,
//   flightNumber,
//   flightDate,
//   departure,
//   arrival,
//   payment,
// } = query
</script>
<style lang="postcss">
.page {
  @media screen {
    width: 210mm;
    height: 297mm;
    @apply shadow-xl rounded mx-auto my-12;
  }
}
body {
  @apply bg-white
}
header,
footer {
  display: none;
}
</style>
