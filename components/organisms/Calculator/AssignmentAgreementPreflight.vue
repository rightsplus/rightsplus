<template>
  <div class="grid gap-5">
    <div
      v-for="(passenger, i) in modelValue.client.passengers"
      class="text-xs border border-gray-200 rounded-xl p-5 grid gap-5"
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
        @update="(e) => updateSignature(e, i)"
        :name="[passenger.firstName, passenger.lastName].join(' ')"
      />
      <i18n-t
        keypath="assignmentLetter.signatureConfirmation"
        tag="p"
        class="whitespace-pre-line [&_a]:text-blue-500 [&_a]:underline"
      >
        <template v-slot:terms
          ><NuxtLink to="/terms">
            {{ $t("termsAndConditions") }}
          </NuxtLink></template
        >
        <template v-slot:privacy
          ><NuxtLink to="/privacy">
            {{ $t("privacyPolicy") }}
          </NuxtLink></template
        >
        <template v-slot:pricelist
          ><NuxtLink to="/pricelist">
            {{ $t("pricelist") }}
          </NuxtLink></template
        >
        <template v-slot:assignmentAgreement
          ><NuxtLink @click.prevent="generateAssignmentAgreement">
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

const { generate } = useGeneratePDF()
const signatures = ref<(string | undefined)[]>([]);

const updateSignature = (val: string | undefined, i: number) => {
  signatures.value[i] = val;
};

const generateAssignmentAgreement = async () => {
  const data = convertAssignmentAgreementData(props.modelValue)
  console.log(data)
  const { url } = await generate({template: 'assignmentLetter', data})

	window.open(url, '_blank');
}
</script>

<style scoped></style>
