<template>
  <div
    class="grid sm:grid-cols-2 max-w-full md:max-w-3xl w-full mx-auto"
    v-if="user"
  >
    Welcome {{ user.user_metadata.full_name }}
  </div>
  <div
    class="grid sm:grid-cols-2 max-w-full md:max-w-3xl w-full items-center mx-auto"
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
        @submit="signIn"
        @resetPassword="resetPassword"
      />
      <AuthenticationForm
        v-else
        :class="inPopup && 'p-5 md:p-10'"
        :mode="mode"
        @changeMode="mode = $event"
        @submit="signIn"
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
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const mode = ref<"signUp" | "signIn">(props.initialMode || "signUp");
const loading = ref({} as Record<Provider | "email", boolean>);

const setLoading = (val: boolean, provider?: Provider) =>
  Object.assign(loading.value, { [provider || "email"]: val });
const signIn = async ({
  form,
  provider,
  redirectTo,
}: {
  form: { email: string; password: string };
  provider?: Provider;
  redirectTo?: string;
}) => {
  setLoading(true, provider);
  const { email, password } = form || {};
  let res;
  if (provider) {
    res = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
  } else if (password) {
    if (mode.value === "signIn") {
      res = await supabase.auth.signInWithPassword({ email, password });
    } else {
      res = await supabase.auth.signUp({ email, password });
    }
  } else {
    res = await supabase.auth.signInWithOtp({ email });
  }
  console.log(res);
  setLoading(false, provider);
  console.log(user.value, res);
  navigateTo(redirectTo);
  if (user.value) emit("success", provider);
  else console.log("no user", res);
};

const resetPassword = async ({ email }: { email: string }) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
};
</script>
<style scoped lang="postcss">
a,
.link {
  @apply underline underline-offset-2 text-gray-600 hover:text-gray-900 cursor-pointer;
}
</style>
