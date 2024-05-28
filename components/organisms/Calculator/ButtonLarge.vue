<template>
  <button
    class="flex text-left gap-5 items-center rounded-lg p-4 sm:p-5 border border-transparent focus-visible:outline-none focus-visible:ring-1 ring-offset-2 ring-primary-500"
    :class="{
      'bg-gray-700 text-white': selected,
      'bg-neutral-100 hover:bg-neutral-50 text-gray-800 hover:border-neutral-100':
        !selected,
    }"
  >
    <span class="leading-none" v-if="icon"><FontAwesomeIcon :icon="icon" class="text-sm" /></span>
    <div class="flex flex-col items-start gap-1" v-if="label || subLabel">
      <span class="text-xs leading-none" v-if="preLabel">{{ preLabel }}</span>
      <span class="text-base font-medium leading-none" v-if="label">{{
        label
      }}</span>
      <span class="text-xs leading-none" v-if="subLabel">{{ subLabel }}</span>
    </div>
    <slot />
    <FontAwesomeIcon v-if="proceed" icon="angle-right" class="ml-auto text-neutral-400 text-base" />
  </button>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps<{
  selected?: boolean
  name?: string
  label?: string
  icon?: string
  preLabel?: string
  subLabel?: string
  proceed?: boolean
}>()
</script>
