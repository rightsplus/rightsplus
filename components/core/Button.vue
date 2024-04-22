<template>
  <component
    :is="component"
    :to="path"
    :title="tooltip"
    :disabled="disabled"
    class="font-medium text-base flex items-center justify-center gap-2 leading-none px-5 rounded-xl h-14 cursor-pointer"
    :class="{
      'text-white': primary,
      'bg-primary-500 hover:bg-primary-600': primary && !success && !alert,
      'text-primary-500 bg-transparent hover:text-primary-600 hover:bg-primary-100':
        secondary && !success && !alert,
      'bg-green-500 hover:bg-green-600': primary && success,
      'text-green-500 bg-transparent hover:text-green-600 hover:bg-green-100':
        secondary && success,
      'bg-green-100 text-green-500 hover:text-green-600 hover:bg-green-200':
        tertiary && success,
      'bg-red-500 hover:bg-red-600': primary && alert,
      'text-red-500 bg-transparent hover:text-red-600 hover:bg-red-100':
      secondary && alert,
      'bg-red-100 text-red-500 hover:text-red-600 hover:bg-red-200':
        tertiary && alert,
      'bg-neutral-200 hover:bg-neutral-300': tertiary,
      'pointer-events-none opacity-50': disabled,
    }"
    :aria-label="label"
    :bind="$attrs"
  >
    <FontAwesomeIcon v-if="prefixIcon" :icon="prefixIcon" class="shrink-0" />
    <span class="truncate leading-normal" v-if="$slots?.default"><slot /></span>
    <span class="truncate leading-normal" v-else-if="label">{{ label }}</span>
    <FontAwesomeIcon v-if="suffixIcon" :icon="suffixIcon" class="shrink-0" />
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
  tertiary?: boolean;
  tooltip?: string;
  alert?: boolean;
  success?: boolean;
};
const props = defineProps<ButtonProps>();
const localePath = useLocalePath();
const component = computed(() => {
  if (props.to) return resolveComponent("NuxtLink");
  return "button";
});
const path = computed(() => {
  if (props.to) return localePath(props.to);
});
</script>
