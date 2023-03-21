<template>
  <div class="flex flex-col gap-5" v-if="$state">
    <h1 class="text-3xl font-bold">Personal</h1>
    <!-- {{ user }} -->
    <div class="flex flex-col gap-3" v-if="modelValue.client">
      <div class="grid grid-cols-2 gap-3">
        <FormKit
          v-model="modelValue.client.firstName"
          label="Vorname"
          :floatingLabel="true"
          :required="true"
        />
        <FormKit
          v-model="modelValue.client.lastName"
          label="Nachname"
          :floatingLabel="true"
          :required="true"
        />
      </div>
      <FormKit
        v-model="modelValue.client.email"
        label="Email"
        :floatingLabel="true"
        type="email"
        :required="true"
      />
      <FormKit
        v-model="modelValue.client.agreedToTerms"
        label="I have read and agree to the terms and conditions."
        type="checkbox"
        :required="true"
      />
    </div>
    <NavigationButtons
      @previous="$emit('back')"
      @next="createAccount"
      :nextDisabled="false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ClaimsForm } from "~~/types";
import NavigationButtons from "./NavigationButtons.vue";
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
    agreedToTerms: false,
  };

const createAccount = async () => {
  try {
    const response = await client.auth.signInWithOtp({
      email: modelValue.client.email,
      options: {
        data: {
          first_name: modelValue.client.firstName,
          last_name: modelValue.client.lastName,
        },
      },
    });
    console.log(response);
    if (response.error) throw response.error;
    console.log("Check your email for the login link!");
    emit("submit");
  } catch (error) {
    console.log(error);
  } finally {
    console.log("done!");
  }
};
</script>

<style lang="scss" scoped></style>
