<template>
  <FormKit
    type="button"
    class="font-medium rounded-lg text-sm px-5 py-3 text-center items-center"
    input-class="bg-white hover:!bg-gray-700 hover:!border-gray-800 hover:!text-white [&:hover_svg]:fill-white !text-black border border-1 border-blue"
    outer-class="!mb-0"
    :prefix-icon="prefixIcon"
    prefix-icon-class="fill-current mr-3"
    >{{ label }}</FormKit
  >
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
  props: {
    provider: {
      type: String,
      required: true,
      validator: (value: string) => {
        return ["google", "apple"].includes(value);
      },
    },
  },
  computed: {
    label() {
      const providerName = {
        google: "Google",
        apple: "Apple-ID",
      }[this.provider];
      return `Mit ${providerName} einloggen`;
    },
    prefixIcon() {
      return `fab-${this.provider}`;
    },
  },
});
</script>

<style scoped></style>
