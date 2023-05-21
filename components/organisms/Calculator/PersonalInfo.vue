<template>
  <div class="flex flex-col gap-5" v-if="$state">
    <h1 class="text-3xl font-bold">Personal</h1>
    <form class="flex flex-col" v-if="modelValue.client" autocomplete="on">
      <div class="grid grid-cols-2 gap-5">
        <FormKit
          v-model="modelValue.client.firstName"
          label="Vorname"
          autocomplete="given-name"
          name="firstName"
          :floatingLabel="true"
          :required="true"
        />
        <FormKit
          v-model="modelValue.client.lastName"
          label="Nachname"
          autocomplete="family-name"
          :floatingLabel="true"
          :required="true"
        />
      </div>
      <FormKit
        v-model="modelValue.client.email"
        label="Email"
        autocomplete="email"
        name="email"
        :floatingLabel="true"
        type="email"
        :required="true"
      />
      <InputIBAN
        v-model="modelValue.client.iban"
        label="IBAN"
        name="iban"
        :floatingLabel="true"
        :required="true"
      />
      <FormKit
        v-model="modelValue.client.agreedToTerms"
        label="I have read and agree to the <a href='#'>terms and conditions</a>"
        type="checkbox"
        decorator-icon="check"
        :required="true"
      >
        <template #label
          ><span class="text-sm leading-none">
            Ich habe die
            <a href="/faq" class="text-primary-600 hover:underline"
              target="_blank">Nutzungsbedingungen</a
            >
            gelesen und stimme diesen zu.</span
          ></template
        >
      </FormKit>
    </form>
    <NavigationButtons
      @previous="$emit('back')"
      @next="createAccount"
      :nextDisabled="false"
    />
  </div>
</template>

<script lang="ts" setup>
import InputIBAN from "~~/components/molecules/InputIBAN.vue";
import { ClaimsForm } from "~~/types";
import NavigationButtons from "./NavigationButtons.vue";
import { uuid } from "vue-uuid";
const client = useSupabaseClient();
const user = useSupabaseUser();
const emit = defineEmits(["submit"]);

const { modelValue } = defineProps<{
  modelValue: ClaimsForm;
}>();

if (!modelValue.client)
  modelValue.client = {
    firstName: "",
    lastName: "",
    email: "",
    iban: "",
    agreedToTerms: false,
  };

const createAccount = async () => {
  try {
    // const { data: signUpData, error: signUpError} = await client.auth.signInWithOtp({
    //   email: modelValue.client.email,
    //   options: {
    //     data: {
    //       first_name: modelValue.client.firstName,
    //       last_name: modelValue.client.lastName,
    //     },
    //   },
    // });
    // const { data: signUpData, error: signUpError} =  await client.auth.signUp({
    //   email: modelValue.client.email,
    //   password: 'abcdefg1234',
    //   options: {
    //     data: {
    //       first_name: modelValue.client.firstName,
    //       last_name: modelValue.client.lastName,
    //     },
    //   },
    // })
    // const { data: userData, error: userError } = await client
    //   .from("users")
    //   .insert([
    //     {
    //       first_name: modelValue.client.firstName,
    //       last_name: modelValue.client.lastName,
    //       email: modelValue.client.email,
    //       id: uuid.v4(),
    //     },
    //   ]);
    // console.log(userData, userError);
    // console.log(fileCaseData, fileCaseError);
    // if (signUpData.user) {
      const { data: fileCaseData, error: fileCaseError } = await client
        .from("cases")
        .insert([
          {
            email: modelValue.client.email,
            data: useAppState().claims,
          },
        ]);
      console.log(fileCaseData, fileCaseError);
    // }

    // if (signUpError) throw signUpError;
    // console.log("Check your email for the login link!");
    emit("submit");
  } catch (error) {
    console.log(error);
  } finally {
    console.log("done!");
  }
};
</script>

<style lang="scss" scoped></style>
