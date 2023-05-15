<template>
  <div class="flex items-center justify-end gap-3">
    <ButtonBack @click.prevent="$emit('previous')" :disabled="previousDisabled" />
    <FormKit
      type="button"
      @click="$emit('next')"
      label="Weiter"
      :disabled="nextDisabled"
      outer-class="!mb-0"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import ButtonBack from "@/components/molecules/ButtonBack.vue";
export default defineComponent({
	components: {
		FormKit,
		ButtonBack,
	},
  props: {
    previousDisabled: {
      type: Boolean,
      default: false,
    },
    nextDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["previous", "next"],
});
</script>