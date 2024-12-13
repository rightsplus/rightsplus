<template>
  <div class="grid gap-12 mt-5">
    <div
      v-for="(passenger, i) in claim.client.passengers"
      class="text-xs grid gap-5"
    >
      <!-- <AssignmentAgreementLetter
        :name="[passenger.firstName, passenger.lastName].join(' ')"
        :address="passenger.address.street"
        :postalCode="passenger.address.postalCode"
        :city="passenger.address.city"
        :country="passenger.address.country"
        :arrival="modelValue.flight?.arrival.iata"
        :departure="modelValue.flight?.departure.iata"
        :flightDate="modelValue.flight?.departure.scheduledTime"
        :flightNumber="modelValue.flight?.flight.iata"
      />
      <hr /> -->
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
            @click.prevent="() => downloadAssignmentAgreement(passenger)"
            target="_blank"
          >
            {{ $t("assignmentAgreement") }}
          </NuxtLink></template
        >
      </i18n-t>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClaimsForm, RowClaimExtended, SignatureData } from "~/types";
import SignaturePad from "~/components/molecules/SignaturePad.vue";
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf";
import assignmentAgreement from "~/pdf/templates/assignmentAgreement";
import letterHead from "~/plugins/pdfmake/pdf/documents/letterHead";

const localePath = useLocalePath();
const claim = useClaim();
const i18n = useI18n();
const { generatePDF } = useCreatePdf();

const { queryLocaleContent } = useI18nContent("pdf");

const downloadAssignmentAgreement = async (
  passenger: ClaimsForm["client"]["passengers"][number]
) => {
  if (!claim.flight) return;
  const pseudoRowClaim: RowClaimExtended = {
    id: 0,
    lang: i18n.locale.value,
    client: passenger,
    booking: {
      flight: {
        iata: claim.flight.flight.iata,
        scheduledDeparture: claim.flight.departure.scheduledTime,
        airportDeparture: claim.flight.departure.iata,
        airportArrival: claim.flight.airline.iata,
      },
    },
  };

  const markdown = await queryLocaleContent(
    `/${pseudoRowClaim.lang || "de"}/assignment-agreement`
  ).first();
  // const markdown = await queryLocaleContent(
  //   `/${pseudoRowClaim.lang || "de"}/compensation-claim`
  // ).first();

  console.log(markdown);
  console.log(
    markdownBodyToPdfMake(markdown.body.value, {
      ...pseudoRowClaim,
      id: formatClaimId(pseudoRowClaim.id),
    })
  );
  const document = letterHead({
    claim: pseudoRowClaim,
    i18n,
    content: (props) => [
      assignmentAgreement({
        ...props,
        preview: false,
        content: markdownBodyToPdfMake(markdown.body.value, {
          ...pseudoRowClaim,
          id: formatClaimId(pseudoRowClaim.id),
        }),
      }),
    ],
    info: {
      title: i18n.t("assignmentAgreement"),
      author: "Joachim Bawa",
    },
  });
  generatePDF(document, {
    download: `assignment-agreement-${passenger.lastName}`,
  });
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
