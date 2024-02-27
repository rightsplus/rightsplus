<template>
  <div class="w-full max-w-3xl mx-auto grid gap-5 mb-12">
    <div class="flex justify-center items-center gap-2">
      <CheckList
        class="flex justify-center"
        :items="['professionalExpertise', 'completeProcess', 'noRisk']"
      />

      <button
        @click="useClaim().reset()"
        class="text-sm text-neutral-500 hover:text-neutral-800 underline underline-offset-2 flex gap-2 items-center py-2 px-5 leading-none"
      >
        reset
      </button>
    </div>

    <div
      class="w-full max-w-3xl mx-auto bg-white rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-12 grid gap-5"
    >
      <ClientOnly>
        <component
          v-model="useClaim().value"
          :is="step?.component"
          :title="step?.title" />
        <ClaimsNavigation @submit="submit"
      /></ClientOnly>
    </div>
  </div>

  <Popup
    :open="signatureOpen"
    @closeOutside="signatureOpen = false"
    class="max-h-[90vh] p-12"
    title="Unterschrift"
  >
    <SignaturePad
      @update="updateSignature"
      :name="
        [
          claim.client.passengers[0].firstName,
          claim.client.passengers[0].lastName,
        ].join(' ')
      "
    />

    <div class="flex gap-2 items-center mt-5">
      <i18n-t
        keypath="accountAcceptTerms.assignmentAgreement"
        tag="label"
        for="terms"
        class="text-sm mb-1 [&>a]:text-primary-500 [&>a:hover]:underline"
      >
        <NuxtLink class="font-medium" to="terms-and-conditions">{{
          $t("privacyPolicy")
        }}</NuxtLink>
        <NuxtLink class="font-medium" to="pricelist">{{
          $t("pricelist")
        }}</NuxtLink>
        <NuxtLink class="font-medium" to="assignment-agreement">{{
          $t("assignmentAgreement")
        }}</NuxtLink>
      </i18n-t>
    </div>
    <div class="flex gap-5 justify-end text-base mt-12">
      <button
        type="button"
        class="text-gray-500 hover:text-gray-800 underline underline-offset-2 flex gap-2 items-center py-2 px-5 leading-none min-w-[auto]"
        @click="
          signatureOpen = false;
          signature = undefined;
        "
      >
        Abbrechen
      </button>
      <FormKit
        type="button"
        :disabled="!signature"
        @click="confirmSignature"
        label="Unterschreiben"
      />
    </div>
  </Popup>
  <Popup
    :open="authOpen"
    @closeOutside="authOpen = false"
    class="max-h-[90vh] w-[initial]"
  >
    <Authentication
      inPopup
      @close="authOpen = false"
      @success="successfulSignUp"
      @changeMode="signUpMode = $event"
      :initialMode="passengerHasAccount ? 'signIn' : 'signUp'"
      :initialEmail="claim.client.passengers[0]?.email"
    />
  </Popup>
</template>

<script setup lang="ts">
import ClaimsNavigation from "@/components/organisms/Calculator/ClaimsNavigation.vue";
import SignaturePad from "@/components/molecules/SignaturePad.vue";
import { watchDebounced } from "@vueuse/core";
import { next } from "@/composables/steps";
const user = useSupabaseUser();
const client = useSupabaseClient();
const { auth } = useSupabaseAuthClient();
const { userExists, submitFlight, submitClaim, handleUploadFile } =
  useSupabaseFunctions();
const { steps, index, step } = useSteps();
const { value: claim, reset: resetClaim } = useClaim();
const { send } = useSendMail();
const { t } = useI18n();
const router = useRouter();

const authOpen = ref(false);
const signatureOpen = ref(false);
const signature = ref<string>();
const signUpMode = ref<"signIn" | "signUp">();

const passengerHasAccount = ref(false);

const updateSignature = (val?: string) => {
  signature.value = val;
};
const confirmSignature = async () => {
  if (!signature.value) return;
  signatureOpen.value = false;
  submit();
};
const submit = async () => {
  try {
    if (!claim.flight) return;
    if (!signature.value) {
      signatureOpen.value = true;
      return;
    }
    try {
      const response = await submitFlight(claim.flight);
      console.log(response);
    } catch (error) {
      console.log(error);
      return;
    }

    // if (!user.value) {
    //   console.log("User not logged in");
    //   if (passengerHasAccount.value) {
    //     const session = await auth.signInWithOtp({
    //       email: passenger.email,
    //     });
    //     console.log(session);
    //   } else {
    //     const session = await auth.signUp({
    //       email: passenger.email,
    //       password: uuid.v4(),
    //     });
    //     console.log(session);
    //   }
    // }
    let claimResponse;
    try {
      claimResponse = await submitClaim(claim);
      // const [passenger] = claim.client.passengers;
      // const data = {
      //   name: [passenger.firstName, passenger.lastName].join(" "),
      //   firstName: passenger.firstName,
      //   address: passenger.address.street,
      //   postalCode: passenger.address.postalCode,
      //   city: passenger.address.city,
      //   flightNumber: claim.flight.flight.iata,
      //   flightDate: claim.flight.flight_date,
      //   departure: claim.flight.departure.iata,
      //   arrival: claim.flight.arrival.iata,
      //   date: new Date().toISOString(),
      // };
      // const email = send({
      //   to: claim.client.passengers[0].email,
      //   subject: "Deine Anfrage wurde erfolgreich eingereicht",
      //   template: "AssignmentLetter.vue",
      //   pdf: {
      //     template: "assignment-letter",
      //     fileName: [
      //       t("assignmentLetter"),
      //       claim.client.passengers[0].lastName,
      //     ].join("-"),
      //   },
      //   data,
      // });
    } catch (error) {
      console.log(error);
      return;
    }

    if (!claimResponse?.id) return;
    claim.id = claimResponse.id;
    const storageFolderClaim = formatClaimId(claimResponse.id, false);
    try {
      claim.client.passengers.forEach((e) => {
        const { file } = e.boardingPass?.[0] || {};
        if (file) {
          handleUploadFile(
            file,
            [storageFolderClaim, "boarding-pass", e.lastName].join("/")
          );
        }
      });
    } catch (error) {
      console.log(error);
      return;
    }
    // const fileName = `${uuid.v4()}.svg`;
    try {
      if (!signature.value) {
        console.log(signature);
        return;
      }
      const signatureSVG = new Blob([signature.value], {
        type: "image/svg+xml",
      });
      const filePath = [storageFolderClaim, "signature.svg"].join("/");
      const { data, error } = await client.storage
        .from("client-files")
        .upload(filePath, signatureSVG, {
          cacheControl: "3600",
          upsert: false,
        });
      console.log(data);
    } catch (error) {
      console.log(error);
      return;
    }
    // next();
    useRouter().push(
      `/claim/${storageFolderClaim}?b=${claim.client.bookingNumber}`
    );
  } catch (error) {
    console.log(error);
  } finally {
    signature.value = undefined;
  }
};
const successfulSignUp = () => {
  authOpen.value = false;
  router.push("/claim");
  resetClaim();
};
watchDebounced(
  () => claim.client.passengers[0]?.email,
  (email) => {
    if (!email) return;
    userExists({ email }).then((exists) => {
      passengerHasAccount.value = exists;
    });
  },
  {
    debounce: 300,
    immediate: true,
  }
);
</script>
