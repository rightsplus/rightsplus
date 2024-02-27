<template>
  <Page>
    <AddressBlock
      :to="{
        name,
        address,
        postalCode,
        city,
      }"
      :from="from"
    />
    <div class="col-span-3 flex flex-col gap-12">
      <h1 class="text-4xl font-bold text-balance">
        {{ t("demandLetter.title", { bookingNumber }) }}
      </h1>
      <div class="h-[25mm]" />
      <div
        class="flex flex-col gap-5 text-xs whitespace-pre-line [&_p]:leading-snug"
      >
        <p>{{ t("letter.salutation.formal") }}</p>
        <i18n-t keypath="demandLetter.introduction" tag="p">
          <template v-slot:iata
            ><strong>{{ iata }}</strong></template
          >
          <template v-slot:departure
            ><strong>{{ departure }}</strong></template
          >
          <template v-slot:arrival
            ><strong>{{ arrival }}</strong></template
          >
          <template v-slot:disruption
            ><strong>{{ disruption }}</strong></template
          >
        </i18n-t>

        <p>
          Geplante Flugdaten:<br />Abflug: 01.02.2024 10:00 GMT, Ankunft: 01.02.2024 12:00 GMT
        </p>
        <p>
          Tatsächliche Flugdaten:<br />
          Flug nicht angekommen
        </p>
        Flugstrecke: 378 km

        <i18n-t keypath="demandLetter.assignment" tag="p">
          <template v-slot:name
            ><strong>{{ name }}</strong></template
          >
        </i18n-t>
        <i18n-t keypath="demandLetter.claim" tag="p">
          <template v-slot:amount
            ><strong>{{ amount }}</strong></template
          >
          <template v-slot:due
            ><strong>{{ due }}</strong></template
          >
          <template v-slot:iban
            ><strong class="whitespace-nowrap">{{ iban }}</strong></template
          >
        </i18n-t>

        <i18n-t keypath="demandLetter.extraordinaryCircumstances" tag="p" />
        <i18n-t keypath="demandLetter.lawsuit" tag="p" />
        <i18n-t keypath="letter.regards.formal" tag="p" />
        Joachim Bawa
      </div>
    </div>
    <Aside :items="aside" />
    <Footer />
  </Page>
</template>
<script setup lang="ts">
const { t } = useI18n();
const { query } = useRoute();
import Aside from "~/components/pdf/Aside.vue";
import Page from "~/components/pdf/Page.vue";
import Footer from "~/components/pdf/Footer.vue";
import AddressBlock from "~/components/pdf/AddressBlock.vue";
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
  iata,
  departure,
  arrival,
  disruption,
  date,
  claimId,
  bookingNumber,
  amount,
  due,
  iban,
} = query as Record<string, string>;

const from = {
  name: "RightsPlus GbR",
  address: "Zülpicher Platz 18",
  postalCode: "50674",
  city: "Köln",
};

const aside = [
  { label: "date", value: new Date().toLocaleDateString() },
  { label: "claimId", value: formatClaimId(claimId as string) },
  { label: "Buchungsnummer", value: bookingNumber },
  { label: "Fluggast", value: name },
  { label: "Flugnummer", value: iata },
  { value: ["www.rightsplus.de", "info@rightsplus.de"].join("\n") },
  { label: "Seite 1 von 1" },

]
</script>