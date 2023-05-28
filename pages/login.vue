<template>
  <div class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div
      class="flex flex-col gap-5 max-w-sm mx-auto px-12 h-full relative z-1 bg-white p-12 rounded-2xl"
    >
      <h1 class="text-2xl font-bold text-center">Login</h1>
      <div class="flex flex-col gap-3">
        <ProviderButton provider="google" @click="login('google')" />
        <ProviderButton provider="github" @click="login('github')" />
        <!-- <ProviderButton provider="apple" @click="login('apple')" /> -->
      </div>
      <span class="text-sm text-neutral-500 text-center">oder</span>
      <FormKit
        type="form"
        v-model="form"
        form-class="flex flex-col"
        @submit="login()"
        submit-label="Einloggen"
      >
        <FormKit
          name="email"
          label="Email"
          type="email"
          floatingLabel
          required
        />
        <FormKit
          name="password"
          label="Password"
          type="password"
          floatingLabel
          required
        />
      </FormKit>
      <button @click="resetPassword" class="text-sm underline underline-offset-2 text-gray-600 hover:text-gray-900">Passwort vergessen?</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProviderButton from "@/components/molecules/ProviderButton.vue";
import { Provider } from "@supabase/supabase-js";

definePageMeta({
  middleware: ["auth"],
});
const client = useSupabaseClient();
const user = useSupabaseUser();

const form = ref({
  email: "",
  password: "",
})
const login = async (provider?: Provider) => {
  if (provider) {
    const { error } = await client.auth.signInWithOAuth({
      provider,
    });
    return;
  }
  if (form.value.password) {
    const { data, error } = await client.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password
    });
  }
  const { data, error } = await client.auth.signInWithOtp({
    email: form.value.email
  });
}
const resetPassword = async () => {
  const { data, error } = await client.auth.resetPasswordForEmail(
    form.value.email
  );
  console.log(data, error)
}
const signup = async () => {
  const { data, error } = await client.auth.signUp({
    email: form.value.email,
    password: form.value.password,
  });
}
</script>

<style scoped></style>
