<template>
  <div class="grid sm:grid-cols-2 max-w-full md:max-w-3xl w-full" v-if="user">
    Welcome {{ user.user_metadata.full_name }}
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
      class="top-0 sm:absolute m-3 p-2 aspect-square rounded-full sm:text-white hover:text-black hover:bg-white"
    />
    <img
      class="object-cover h-full hidden sm:block"
      :class="{ 'rounded-2xl': !inPopup }"
      src="https://images.unsplash.com/photo-1598873304074-71bf55c49572?q=80&w=2235&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />

    <Transition name="fade" mode="out-in">
      <AuthenticationForm
        v-if="mode !== 'signUp'"
        :class="inPopup && 'p-5 md:p-10'"
        :mode="mode"
        @changeMode="mode = $event"
        @submit="submit"
        @resetPassword="resetPassword"
      />
      <AuthenticationForm
        v-else
        :class="inPopup && 'p-5 md:p-10'"
        :mode="mode"
        @changeMode="mode = $event"
        @submit="submit"
        @resetPassword="resetPassword"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Provider } from "@supabase/supabase-js";

const props = defineProps<{
  initialMode?: "signIn" | "signUp";
  initialEmail?: string;
  inPopup?: boolean;
}>();
const emit = defineEmits(["close", "success"]);
const client = useSupabaseClient();
const user = useSupabaseUser();
const mode = ref<"signUp" | "signIn">(props.initialMode || "signUp");
const loading = ref({} as Record<Provider | "email", boolean>);

const setLoading = (val: boolean, provider?: Provider) =>
  Object.assign(loading.value, { [provider || "email"]: val });
const signIn = async ({
  form,
  provider
}: {
  form: { email: string; password: string };
  provider?: Provider;
}) => {
  setLoading(true, provider);

  const { email, password } = form || {};
  let res;
  if (provider) {
    res = await client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "/faq" }
    });
  } else if (password) {
    res = await client.auth.signInWithPassword({
      email,
      password
    });
  } else {
    res = await client.auth.signInWithOtp({ email });
  }
  setLoading(false, provider);
  console.log(user.value, res);
  if (user.value) emit("success", provider);
  else console.log("no user");
};
const signUp = async ({
  form,
  provider
}: {
  form: { email: string; password: string };
  provider?: Provider;
}) => {
  const { email, password } = form || {};
  setLoading(true, provider);
  let res;
  try {
    if (provider) {
      res = await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: "/" }
      });
    } else if (email && password) {
      res = await client.auth.signUp({
        email,
        password
      });
    }
    setLoading(false, provider);

    if (user.value) emit("success", provider);
    else console.log("no user");
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async ({
  email
}: {
  email: string
}) => {
  const { data, error } = await client.auth.resetPasswordForEmail(email);
};

const submit = mode.value === "signIn" ? signIn : signUp;
</script>
<style scoped lang="postcss">
a,
.link {
  @apply underline underline-offset-2 text-gray-600 hover:text-gray-900 cursor-pointer;
}
</style>
