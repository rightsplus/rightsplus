<script setup lang="ts">
import type { ClaimsForm, RowClaimExtended, SignatureData } from "~/types";
import SignaturePad from "~/components/molecules/SignaturePad.vue";
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf";
import assignmentAgreement from "~/pdf/templates/assignmentAgreement";
import letterHead from "~/plugins/pdfmake/pdf/documents/letterHead";
import { useFormatClaim } from "~/composables/claim";
import FlightCard from "~/components/cells/FlightCard.vue";
import DisruptionCard from "~/components/cells/DisruptionCard.vue";
import PassengerCard from "~/components/cells/PassengerCard.vue";

const { localePath } = useLocaleContent();
const claim = useClaim();
const i18n = useI18n();
const { t } = i18n;
const { generatePDF } = useCreatePdf();

const { queryLocaleContent } = useI18nContent("pdf");
const { format } = useFormatClaim();
const downloadAssignmentAgreement = async (
  claim: ClaimsForm,
  passengerIndex: number
) => {
  if (!claim.flight) return;
  const pseudoRowClaim = await format({ claim, passengerIndex });
  if (!pseudoRowClaim) {
    throw new Error("claim could not be formatted");
  }
  console.log(pseudoRowClaim.lang);
  const markdown = await queryLocaleContent(
    `/${pseudoRowClaim.lang || "de"}/assignment-agreement`
  ).first();

  const document = letterHead({
    claim: pseudoRowClaim,
    i18n,
    content: (props) => [
      assignmentAgreement({
        ...props,
        preview: true,
        content: markdownBodyToPdfMake(markdown.body.value, pseudoRowClaim),
      }),
    ],
    info: {
      title: i18n.t("assignmentAgreement"),
      // subtitle: i18n.t("compensationClaim.subtitle"),
      author: "Joachim Bawa",
    },
  });
  generatePDF(document, { open: true });
};
</script>
<template>
  <div class="grid gap-5 mt-5">
    <div class="flex flex-col gap-3">
      <h2 class="text-xl font-bold">{{ t("flight") }}</h2>

      <FlightCard v-if="claim.flight" :flight="claim.flight" />
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-xl font-bold">{{ t("disruptionDetected.title") }}</h2>
      <DisruptionCard v-if="claim.disruption" :disruption="claim.disruption" />
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-xl font-bold">{{ t("passenger", 2) }}</h2>
      <PassengerCard
        v-for="passenger in claim.client.passengers"
        :passenger="passenger"
      />
    </div>
  </div>
</template>
