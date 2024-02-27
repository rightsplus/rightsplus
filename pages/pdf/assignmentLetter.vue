<template>
  <div class="grid grid-cols-4 gap-12 p-12 page">
    <div class="col-span-3 flex flex-col gap-12">
      <h1 class="text-4xl font-bold">{{ t("assignmentLetter.title") }}</h1>
      <div class="flex flex-col gap-5 text-base">
        <i18n-t
          keypath="assignmentLetter.main"
          tag="p"
          class="whitespace-pre-line leading-snug"
        >
          <template v-slot:addressBlock
            ><span class="block m-5 font-bold">
              {{ [name, address, [postalCode, city].join(" ")].join("\n") }}
            </span></template
          >
          <template v-slot:flight
            ><span class="block m-5 mb-0">
              <strong>{{ flightNumber }}</strong> {{ t("am") }}
              <strong>{{
                new Date(flightDate as string).toLocaleDateString()
              }}</strong>
            </span></template
          >
          <template v-slot:airports
            ><span class="block m-5 mt-0">
              {{ t("from") }}
              <strong>{{ departure }}</strong> {{ t("to") }}
              <strong>{{ arrival }}</strong>
            </span></template
          >
          <template v-slot:rightsPlus><strong>RightsPlus GbR</strong></template>
        </i18n-t>
        <p>{{ t("assignmentLetter.reimbursement") }}</p>
        <p>{{ t("assignmentLetter.claimant") }}</p>
        <p>
          {{
            t("assignmentLetter.declaration", {
              rightsPlus: "RightsPlus GbR",
              partner: "Joachim Bawa",
            })
          }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <div class="grid gap-2">
          <div
            class="bg-neutral-100 rounded h-12 w-full px-3 items-center flex font-semibold text-base"
          >
            {{ new Date().toLocaleDateString() }}
          </div>
          <span class="text-sm text-neutral-500">{{ t("date") }}</span>
        </div>
        <div class="grid gap-2">
          <div
            class="relative bg-neutral-100 rounded h-12 w-full flex items-center"
          >
            <!-- <div
              v-if="data?.signature"
              v-html="data?.signature"
              class="h-[170%] mt-[10%] [&>svg]:w-[initial] [&>svg]:h-full"
            /> -->
            <img
              :src="`https://mtunwdgfmuekdjdecgdc.supabase.co/storage/v1/object/public/client-files//${formatClaimId(
                claimId as string,
                false
              )}/signature.svg`"
              class="h-[170%] mt-[10%]"
            />
            <!-- <img v-if="data?.signature" :src="data.signature" class="h-[170%] mt-[10%]" /> -->
            <!-- <img :src="`https://mtunwdgfmuekdjdecgdc.supabase.co/storage/v1/object/sign/client-files/${claimId}/signature.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjbGllbnQtZmlsZXMvMDAwMDAzOC9zaWduYXR1cmUuc3ZnIiwiaWF0IjoxNzA4MzY1MjIzLCJleHAiOjE3MDg5NzAwMjN9.yKqLziYYz3yFsvFfY0SJtjb7941MxybPqoUH7lHKtng&t=2024-02-19T17%3A53%3A43.261Z`" class="h-[170%] mt-[10%]"/> -->
          </div>
          <span class="text-sm text-neutral-500">{{ t("signature") }}</span>
        </div>
      </div>
    </div>
    <div class="col-span-1 flex flex-col gap-5">
      <div class="flex items-center gap-2 text-base">
        <Icon :icon="Logo" class="[&>svg]:w-8" />
        <span class="font-bold">RightsPlus</span>
      </div>

      <div class="flex flex-col" v-for="item in aside">
        <span class="text-xs text-neutral-500" v-if="item.label">{{
          t(item.label)
        }}</span>
        <span class="text-sm whitespace-pre-line">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Logo from "~/assets/logo";
import { claim } from "~/store";
const { t } = useI18n();
const { query } = useRoute();
const client = useSupabaseClient();
definePageMeta({
  layout: "pdf",
});

const {
  name,
  address,
  postalCode,
  city,
  flightNumber,
  flightDate,
  departure,
  arrival,
  date,
  claimId,
  bookingNumber,
} = query;
const { data } = await useAsyncData(async () => {
  try {
    const { data, error } = await client.storage
      .from("client-files")
      .getPublicUrl(`/${formatClaimId(claimId, false)}/signature.svg`);
    // .download(`/${formatClaimId(claimId, false)}/signature.svg`);
    if (!data) return;
    // Create a FileReader to read the Blob
    const signature = data.publicUrl;
    // const reader = new FileReader();
    // const signature = await new Promise((resolve) => {
    //   reader.onload = (event) => resolve(event.target?.result as string);
    //   reader.readAsText(data);
    // });

    console.log(data, signature);
    return { signature };
  } catch (error) {
    console.error(error);
  }
});

const aside = [
  { label: "date", value: new Date(date as string).toLocaleDateString() },
  { label: "claimId", value: formatClaimId(claimId as string) },
  { value: "RightsPlus GbR\nZülpicher Platz 18\n50674 Köln" },
  { value: "info@rightsplus.de" },
];
</script>
<style lang="postcss">
.page {
  @media screen {
    width: 210mm;
    height: 297mm;
    @apply shadow-xl rounded mx-auto my-12 bg-white;
  }
}
@media print {
  body {
    background: white !important;
  }
}
</style>
