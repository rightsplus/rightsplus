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
          :title="step?.title"/>
        <ClaimsNavigation :nextLabel="nextLabel" @submit="submit"
      /></ClientOnly>
    </div>
  </div>

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
      :initialEmail="modelValue.client.passengers[0]?.email"
    />
  </Popup>
</template>

<script setup lang="ts">
import { next, prev, reset } from "@/composables/steps";
import ClaimsNavigation from "@/components/organisms/Calculator/ClaimsNavigation.vue";
const user = useSupabaseUser();
const { userExists, submitFlight, submitClaim } = useSupabaseFunctions();
const { steps, index, step } = useSteps();
const authOpen = ref(false);
const nextLabel = computed(() => {
  if (index.value === steps.value.length - 1) return "Absenden";
  return "Weiter";
});

const { value: claim } = useClaim();
const { send } = useSendMail()

const submit = async () => {
  try {
    if (!claim.flight) return;
    // const result = await Promise.all(
    //   claim.client.passengers.map(async e => {
    //     // return await handleUploadFile(e.boardingPass?.[0].file);
    //   })
    // );
    // if (!user.value) {
    //   authOpen.value = true;
    //   console.warn("User not logged in");
    //   return;
    // }
    try {
      const response = await submitFlight(claim.flight);
      console.log(response);
    } catch (error) {
      console.log(error);
      return;
    }
    try {
      const response = await submitClaim(claim);
      const email = send({
        to: claim.client.passengers[0].email,
        subject: "Deine Anfrage wurde erfolgreich eingereicht",
        text: "Deine Anfrage wurde erfolgreich eingereicht"
      })
      console.log(response, email);
    } catch (error) {
      console.log(error);
      return;
    }
    useRouter().push("/status");
  } catch (error) {
    console.log(error);
  } finally {
    // console.log("done!");
  }
};
</script>
