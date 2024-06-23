<template>
  <div class="grid gap-12 mt-5">
    <div
      v-for="(passenger, i) in modelValue.client.passengers"
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
          ><NuxtLink :to="localePath('privacy')" target="_blank">
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
            @click.prevent="generateAssignmentAgreement"
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
import type { ClaimsForm } from "~/types";
import SignaturePad from "~/components/molecules/SignaturePad.vue";
const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const localePath = useLocalePath();
const { generate } = useGeneratePDF();

const updateSignature = (val: string | undefined, i: number) => {
  props.modelValue.client.passengers[i].signature = val;
};

const generateAssignmentAgreement = async () => {
  const data = convertAssignmentAgreementData(props.modelValue);
  const { url } = await generate({ template: "assignmentLetter", data });
  window.open(url, "_blank");
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
