<template>
  <FormKit
    type="button"
    class="font-medium rounded-lg text-sm px-5 py-3 text-center items-center"
    input-class="bg-white hover:!bg-gray-700 hover:!border-gray-800 hover:!text-white [&>svg]:fill-black [&:hover_svg]:fill-white !text-black border border-1 border-blue"
    outer-class="!mb-0"
    :prefix-icon="prefixIcon"
    prefix-icon-class="[&>svg]:fill-gray-600 mr-3 w-5"
    ><span class="flex items-center gap-2"><img :src="img" v-if="img" class="w-5"/>{{ label }}</span></FormKit
  >
</template>

<script setup lang="ts">
const props = defineProps<{
  provider: "google" | "apple" | "github";
}>();
const label = computed(() => {
  const providerName = {
    github: "GitHub",
    google: "Google",
    apple: "Apple-ID",
  }[props.provider];
  return `Mit ${providerName} einloggen`;
})
const prefixIcon = computed(() => {
  if (props.provider === 'google') return 
  return `fab-${props.provider}`;
})
const img = computed(() => {
  if (props.provider === 'google') return `https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1176px-Google_%22G%22_Logo.svg.png?20230305195327`;
})
</script>

<style scoped></style>
