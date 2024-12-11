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
import type { ClaimsForm, SignatureData } from "~/types";
import SignaturePad from "~/components/molecules/SignaturePad.vue";
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf";
import assignmentAgreement from "~/plugins/pdfmake/pdf/documents/assignmentAgreement";
const localePath = useLocalePath();
const claim = useClaim()
const i18n = useI18n()
const {
  generatePDF
} = useCreatePdf()

const downloadAssignmentAgreement = (passenger: ClaimsForm["client"]["passengers"][number]) => {
  generatePDF(assignmentAgreement(passenger, claim, i18n), { download: `assignment-agreement-${passenger.lastName}`})
}

const updateSignature = (val: SignatureData | undefined, i: number) => {
  claim.client.passengers[i].signature = val;
  console.log(claim)
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
