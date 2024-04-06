<template>
  <div class="grid gap-8">
    <h2 class="text-2xl font-bold">
      {{
        mode === "signIn"
          ? $t("signInAt", { platform: "RightsPlus" })
          : $t("signUpAt", { platform: "RightsPlus" })
      }}
    </h2>
    <div class="flex flex-col gap-5 relative">
      <div class="flex flex-col gap-5 relative">
        <div class="flex flex-col gap-3">
          <ProviderButton
            v-for="provider in providers"
            :provider="provider"
            @click="() => submitProvider(provider)"
            :mode="mode"
            :loading="loading[provider]"
          />
        </div>
        <Separator>{{ $t("or") }}</Separator>
      </div>
      <div class="flex flex-col justify-center">
        <FormKit
          type="form"
          ref="formRef"
          v-model="form"
          form-class="flex flex-col gap-4"
          :actions="false"
        >
          <FormKit name="email" label="Email" type="email" required />
          <FormKit
            name="password"
            label="Password"
            type="password"
            required
            placeholder="8+ characters"
            suffix-icon="eye-slash"
            @suffix-icon-click="handleTogglePassword"
          />
          <div class="flex gap-2" v-if="false">
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
              <template v-slot:terms
                ><NuxtLinkLocale to="/terms-and-conditions">{{
                  $t("termsAndConditions")
                }}</NuxtLinkLocale></template
              >
              <template v-slot:privacyPolicy
                ><NuxtLinkLocale to="/privacy">{{
                  $t("privacyPolicy")
                }}</NuxtLinkLocale></template
              >
              <template v-slot:partner>RightsPlus</template>
            </i18n-t>
          </div>
          <FormKit
            ref="submitButton"
            type="button"
            @click="submitForm"
            :suffix-icon="loading.email ? 'circle-notch' : ' '"
            :classes="{
              outer: loading.email ? '[&_.formkit-icon_svg]:animate-spin' : '',
            }"
            >{{ $t(mode) }}</FormKit
          >
        </FormKit>

        <button
          @click="emit('resetPassword', form)"
          class="link text-sm mt-5"
          v-if="mode === 'signIn'"
        >
          {{ $t("forgotPassword") }}
        </button>
      </div>
      <div class="flex flex-col gap-5 mt-10">
        <span
          class="text-xs flex gap-1 justify-center w-full"
          v-if="mode === 'signUp'"
        >
          <i18n-t keypath="accountAcceptTerms.notice" tag="span">
            <template v-slot:terms
              ><NuxtLinkLocale to="/terms-and-conditions">{{
                $t("termsAndConditions")
              }}</NuxtLinkLocale></template
            >
            <template v-slot:privacyPolicy
              ><NuxtLinkLocale to="/privacy">{{
                $t("privacyPolicy")
              }}</NuxtLinkLocale></template
            >
          </i18n-t>
        </span>
        <span class="text-sm [&>*:not(:last-child)]:mr-1 justify-center w-full">
          <span v-if="mode === 'signIn'">{{ $t("dontHaveAccount") }}</span>
          <span v-else>{{ $t("alreadyHaveAccount") }}</span>
          <button
            @click="emit('changeMode', mode === 'signIn' ? 'signUp' : 'signIn')"
            class="link"
          >
            {{ $t(mode === "signIn" ? "signUp" : "signIn") }}
          </button></span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProviderButton from "@/components/molecules/ProviderButton.vue";
import type { Provider } from "@supabase/supabase-js";
import Separator from "@/components/core/Separator.vue";

const props = defineProps<{
  mode: "signIn" | "signUp";
  initialEmail?: string;
}>();
const emit = defineEmits(["submit", "resetPassword", "changeMode"]);
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
const formRef = ref(null);
const submitButton = ref(null);
const route = useRoute();

const submitForm = () => {
  emit("submit", {
    form: form.value,
    redirectTo: route.query.redirect,
  });
};
const submitProvider = async (provider?: Provider) => {
  emit("submit", {
    provider,
    redirectTo: route.query.redirect,
  });
};
</script>
<style scoped lang="postcss">
a,
.link {
  @apply underline underline-offset-2 text-gray-600 hover:text-gray-900 cursor-pointer;
}
</style>
