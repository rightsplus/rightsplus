<template>
  <div class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div
      class="flex flex-col gap-5 max-w-sm mx-auto px-12 h-full relative z-1 bg-white p-12 rounded-2xl text-center"
    >
      <h1 class="text-2xl font-bold">Login</h1>
      <div class="flex flex-col gap-3">
        <ProviderButton provider="google" @click="login('google')" />
        <!-- <ProviderButton provider="apple" @click="login('apple')" /> -->
      </div>
      <span class="text-sm text-neutral-500">oder</span>
      <FormKit
        type="form"
        v-model="form"
        form-class="flex flex-col gap-3"
        @submit="login()"
        submit-label="Einloggen"
      >
        <FormKit
          field="email"
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          label-class="hidden"
        />
        <!-- <FormKit
          field="password"
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          label-class="hidden"
        /> -->
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProviderButton from "@/components/molecules/ProviderButton.vue";
import { Provider } from "@supabase/supabase-js";

export default defineComponent({
  setup() {
    definePageMeta({
      middleware: ["auth"],
    });
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    return { client, user };
  },
  components: {
    ProviderButton,
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async login(provider?: Provider) {
      if (provider) {
        const { error } = await this.client.auth.signInWithOAuth({
          provider,
        });
        return;
      }
      const { data, error } = await this.client.auth.signInWithOtp({
        email: this.form.email
      });
    },
    async signup() {
      const { data, error } = await this.client.auth.signUp({
        email: this.form.email,
        password: this.form.password,
      });
    },
  },
  watch: {
    user: {
      handler(value) {
        if (value) {
          navigateTo("/status");
        }
      },
      immediate: true,
    },
  },
});
</script>

<style scoped></style>
