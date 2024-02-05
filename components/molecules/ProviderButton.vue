<template>
  <FormKit
    type="button"
    class="font-medium rounded-lg text-sm px-5 py-3 text-center items-center"
    input-class="!bg-neutral-100 hover:!bg-gray-700 hover:!border-gray-800 hover:!text-white [&_svg]:fill-black [&:hover_svg]:fill-white [&:hover_img]:brightness-[100] !text-black border border-1 border-neutral-200 items-center"
    outer-class="!mb-0"
    :prefix-icon="loading ? 'spinner' : prefixIcon"
    prefix-icon-class="mr-3 w-5"
    ><span class="flex items-center gap-2"
      ><img :src="img" v-if="img && !loading" class="w-5" />{{ label }}</span
    ></FormKit
  >
</template>

<script setup lang="ts">
import type { Provider } from "@supabase/supabase-js";

const { t } = useI18n();
const props = defineProps<{
  provider: Provider;
  mode: "signIn" | "signUp";
  loading?: boolean;
}>();
const label = computed(() => {
  const provider = (
    {
      github: "GitHub",
      google: "Google",
      apple: "Apple-ID",
    } as Record<Provider, string>
  )[props.provider];

  return t(props.mode === "signIn" ? "signInWith" : "signUpWith", { provider });
});
const prefixIcon = computed(() => {
  if (props.provider === "google") return;
  return `fab-${props.provider}`;
});
const img = computed(() => {
  if (props.provider === "google")
    return `https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg`;
});
</script>

<style scoped></style>
