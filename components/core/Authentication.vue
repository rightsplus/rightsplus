<template>
  <div class="grid sm:grid-cols-2 max-w-full md:max-w-3xl w-full" v-if="user">
    Welcome {{ user }}
  </div>
  <div
    class="grid sm:grid-cols-2 max-w-full md:max-w-3xl w-full items-center"
    :class="!inPopup && 'gap-5 md:gap-10'"
    v-else
  >
    <FontAwesomeIcon
      v-if="inPopup"
      icon="xmark"
      role="button"
      @click="emit('close')"
      class="sm:absolute m-3 p-2 aspect-square rounded-full sm:text-white hover:text-black hover:bg-white"
    />
    <img
      class="object-cover h-full hidden sm:block"
      :class="{ 'rounded-2xl': !inPopup }"
      src="https://images.unsplash.com/photo-1598873304074-71bf55c49572?q=80&w=2235&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />
    <div class="grid gap-8" :class="inPopup && 'p-5 md:p-10'">
      <h2 class="text-2xl font-bold">
        {{
          mode === "signIn"
            ? $t("signInAt", { platform: "RightsPlus" })
            : $t("signUpAt", { platform: "RightsPlus" })
        }}
      </h2>
      <div class="flex flex-col gap-5 relative">
        <div class="flex flex-col gap-3">
          <ProviderButton
            v-for="provider in providers"
            :provider="provider"
            @click="mode === 'signIn' ? signIn(provider) : signUp(provider)"
            :mode="mode"
            :loading="loading[provider]"
          />
        </div>
        <Separator>{{ $t("or") }}</Separator>
        <div
          class="flex flex-col justify-center"
          v-if="mode === 'signUp' && !signUpView"
        >
          <Button @click="signUpView = true" class="text-base">{{
            $t("continueWithEmail")
          }}</Button>
        </div>
        <div
          class="flex flex-col justify-center"
          v-if="mode === 'signIn' || signUpView"
        >
          <FormKit
            type="form"
            v-model="form"
            form-class="flex flex-col gap-4"
            @submit="submit"
            :loading="loading.email"
            :submit-label="$t(mode)"
          >
            <FormKit name="email" label="Email" type="email" required />
            <FormKit
              name="password"
              label="Password"
              type="password"
              required
              suffix-icon="eye-slash"
              @suffix-icon-click="handleTogglePassword"
            />
            <div class="flex gap-2" v-if="mode === 'signUp' && signUpView">
              <FormKit
                type="checkbox"
                name="terms"
                decorator-icon="check"
                id="terms"
                required
              />
              <i18n-t
                keypath="accountAcceptTerms.agreement"
                tag="label"
                for="terms"
                class="text-xs"
              >
                <NuxtLink to="privacy">{{ $t("termsAndConditions") }}</NuxtLink>
                <NuxtLink to="terms-and-conditions">{{
                  $t("privacyPolicy")
                }}</NuxtLink>
                RightsPlus
              </i18n-t>
            </div>
          </FormKit>

          <button
            @click="resetPassword"
            class="link text-sm mt-5"
            v-if="mode === 'signIn'"
          >
            {{ $t("forgotPassword") }}
          </button>
        </div>
        <div class="flex flex-col gap-5 mt-10">
          <span
            class="text-xs flex gap-1 justify-center w-full"
            v-if="mode === 'signUp' && !signUpView"
          >
            <i18n-t keypath="accountAcceptTerms.notice" tag="span">
              <NuxtLink to="privacy">{{ $t("termsAndConditions") }}</NuxtLink>
              <NuxtLink to="terms-and-conditions">{{
                $t("privacyPolicy")
              }}</NuxtLink>
            </i18n-t>
          </span>
          <span
            class="text-sm [&>*:not(:last-child)]:mr-1 justify-center w-full"
          >
            <span v-if="mode === 'signIn'">{{ $t("dontHaveAccount") }}</span>
            <span v-else>{{ $t("alreadyHaveAccount") }}</span>
            <button
              @click="mode = mode === 'signIn' ? 'signUp' : 'signIn'"
              class="link"
            >
              {{ $t(mode === "signIn" ? "signUp" : "signIn") }}
            </button></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProviderButton from "@/components/molecules/ProviderButton.vue";
import { Provider } from "@supabase/supabase-js";
import Separator from "@/components/core/Separator.vue";

const props = defineProps<{
  initialMode?: "signIn" | "signUp";
  initialEmail?: string;
  inPopup?: boolean;
}>();
const emit = defineEmits(["close", "success"]);
const client = useSupabaseClient();
const user = useSupabaseUser();
const mode = ref<"signUp" | "signIn">(props.initialMode || "signUp");
const signUpView = ref(false);
const providers = ["google"] as Provider[];
const loading = ref({} as Record<Provider | "email", boolean>);

const form = ref({
  email: props.initialEmail || "",
  password: "",
  terms: false,
});

const handleTogglePassword = (node, e) => {
  node.props.suffixIcon = node.props.suffixIcon === "eye" ? "eye-slash" : "eye";
  node.props.type = node.props.type === "password" ? "text" : "password";
};
const setLoading = (val: boolean, provider?: Provider) =>
  Object.assign(loading.value, { [provider || "email"]: val });
const submit = async (e: Event) => {
  console.log("submitting", mode.value);
  if (mode.value === "signIn") {
    signIn();
  } else {
    signUp();
  }
};
const signIn = async (provider?: Provider) => {
  setLoading(true, provider);

  const { email, password } = form.value;
  console.log(email, password, provider);

  if (provider) {
    await client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "/faq" },
    });
  } else if (password) {
    await client.auth.signInWithPassword({
      email,
      password,
    });
  } else {
    await client.auth.signInWithOtp({ email });
  }
  setLoading(false, provider);
  emit("success", provider);
};
const resetPassword = async () => {
  const { data, error } = await client.auth.resetPasswordForEmail(
    form.value.email
  );
};
const signUp = async (provider?: Provider) => {
  const { email, password } = form.value;
  console.log("signin up", provider, email, password);
  try {
    if (provider) {
      await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: "/" },
      });
    } else if (email && password) {
      await client.auth.signUp({
        email,
        password,
      });
    }
    setLoading(false, provider);
    emit("success", provider);
  } catch (error) {
    console.log(error);
  }
};
</script>
<style scoped lang="postcss">
a,
.link {
  @apply underline underline-offset-2 text-gray-600 hover:text-gray-900 cursor-pointer;
}
</style>
