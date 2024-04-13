<template>
  <component
    :is="component"
    :to="path"
    :title="tooltip"
    :disabled="disabled"
    class="font-medium text-base flex items-center justify-center gap-2 leading-none px-5 rounded-xl h-14 cursor-pointer"
    :class="{
      'text-white bg-primary-500 hover:bg-primary-600': primary,
      'bg-neutral-200 hover:bg-neutral-300': secondary,
      'text-primary-500 bg-transparent hover:text-primary-600 hover:bg-primary-100': tertiary,
      'pointer-events-none opacity-50': disabled
    }"
    :aria-label="label"
    :bind="$attrs"
  >
    <FontAwesomeIcon v-if="prefixIcon" :icon="prefixIcon" class="shrink-0" />
    <span class="truncate leading-normal" v-if="$slots?.default"><slot /></span>
    <span class="truncate leading-normal" v-else>{{label}}</span>
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
};
const props = defineProps<ButtonProps>();
const localePath = useLocalePath()
const component = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  return 'button'
})
const path = computed(() => {
  if (props.to) return localePath(props.to)
})
</script>
