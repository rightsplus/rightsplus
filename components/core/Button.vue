<template>
  <component
    :is="to ? 'NuxtLink' : 'button'"
    :to="to"
    :title="label"
    :disabled="disabled"
    class="font-medium text-base flex items-center justify-center gap-2 leading-none px-5 rounded-xl h-14 cursor-pointer"
    :class="{
      'text-white bg-primary-500 hover:bg-primary-600': primary,
      'bg-neutral-200 hover:bg-neutral-300': secondary,
      'pointer-events-none opacity-50': disabled
    }"
    :aria-label="label"
    :bind="$attrs"
  >
    <FontAwesomeIcon v-if="prefixIcon" :icon="prefixIcon" class="text-xl shrink-0" />
    <span class="truncate leading-normal"><slot /></span>
    <FontAwesomeIcon v-if="suffixIcon" :icon="suffixIcon" class="text-xl shrink-0" />
  </component>
</template>
<script lang="ts" setup>
export type ButtonProps = {
  to?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  label?: string;
  disabled?: boolean;
  primary?: boolean;
  secondary?: boolean;
};
defineProps<ButtonProps>();
</script>
