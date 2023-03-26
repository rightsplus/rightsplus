<template>
  <button
    class="flex text-left gap-5 items-center rounded-lg p-4 sm:p-5"
    :class="{
      'bg-gray-700 text-white': selected,
      'bg-neutral-100 hover:bg-neutral-200 text-gray-800 border border-neutral-200':
        !selected,
    }"
  >
    <span class="leading-none" v-if="icon"><FontAwesomeIcon :icon="icon" class="text-base" /></span>
    <div class="flex flex-col items-start gap-1" v-if="label || subLabel">
      <span class="text-lg font-bold leading-none" v-if="label">{{
        label
      }}</span>
      <span class="text-sm leading-none" v-if="subLabel">{{ subLabel }}</span>
    </div>
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    selected: {
      type: Boolean,
    },
    icon: {
      type: String,
    },
    name: {
      type: String,
    },
    label: {
      type: String,
    },
    subLabel: {
      type: String,
    },
  },
  data() {
    return {
      baseUrl: "https://serkowebtest.blob.core.windows.net/airline-logos",
    };
  },
});
</script>
