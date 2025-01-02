<script setup lang="ts">
import type { ClaimsForm, RowClaimExtended, SignatureData } from "~/types";
import SignaturePad from "~/components/molecules/SignaturePad.vue";
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf";
import assignmentAgreement from "~/pdf/templates/assignmentAgreement";
import letterHead from "~/plugins/pdfmake/pdf/documents/letterHead";
import { useFormatClaim } from "~/composables/claim";

const { localePath } = useLocaleContent();
const claim = useClaim();
const i18n = useI18n();
const { generatePDF } = useCreatePdf();

const { queryLocaleContent } = useI18nContent("pdf");
const { format } = useFormatClaim()
const downloadAssignmentAgreement = async (
  claim: ClaimsForm,
  passengerIndex: number
) => {
  if (!claim.flight) return;
  const pseudoRowClaim = await format({ claim, passengerIndex })
  if (!pseudoRowClaim) {
    throw new Error('claim could not be formatted')
  }
  console.log(pseudoRowClaim.lang)
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

const updateSignature = (val: SignatureData | undefined, i: number) => {
  claim.client.passengers[i].signature = val;
  console.log(claim);
};

const passengerName = (
  passenger: ClaimsForm["client"]["passengers"][number]
) => {
  if (passenger.isMinor) {
    return `${[
      passenger.guardian?.firstName,
      passenger.guardian?.lastName,
    ].join(" ")}, (Erziehungsberechtigte/r von ${[
      passenger.firstName,
      passenger.lastName,
    ].join(" ")})`;
  }
  return [passenger.firstName, passenger.lastName].join(" ");
};
</script>
<template>
  <div class="grid gap-12 mt-5">
    <div
      v-for="(passenger, i) in claim.client.passengers"
      class="text-xs grid gap-5"
    >
      <SignaturePad
        :modelValue="passenger.signature"
        @update:modelValue="(e) => updateSignature(e, i)"
        :name="passengerName(passenger)"
      />
      <i18n-t
        keypath="assignmentLetter.signatureConfirmation"
        tag="p"
        class="whitespace-pre-line [&_a]:text-blue-500 [&_a]:underline"
      >
        <template v-slot:terms
          ><NuxtLink :to="localePath('terms-and-conditions')" target="_blank">
            {{ $t("termsAndConditions") }}
          </NuxtLink></template
        >
        <template v-slot:privacy
          ><NuxtLink :to="localePath('privacy-policy')" target="_blank">
            {{ $t("privacyPolicy") }}
          </NuxtLink></template
        >
        <template v-slot:pricelist
          ><NuxtLink :to="localePath('prices-and-services')" target="_blank">
            {{ $t("pricelist") }}
          </NuxtLink></template
        >
        <template v-slot:assignmentAgreement
          ><NuxtLink
            @click.prevent="() => downloadAssignmentAgreement(claim, i)"
            target="_blank"
          >
            {{ $t("assignmentAgreement") }}
          </NuxtLink></template
        >
      </i18n-t>
    </div>
  </div>
</template>
