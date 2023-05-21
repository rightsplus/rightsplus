<template>
  <button
    class="flex text-left gap-5 items-center rounded-lg p-4 sm:p-5"
    :class="{
      'bg-gray-700 text-white': selected,
      'bg-neutral-100 hover:bg-neutral-50 text-gray-800 border border-neutral-200':
        !selected,
    }"
  >
    <span class="leading-none" v-if="icon"><FontAwesomeIcon :icon="icon" class="text-sm" /></span>
    <div class="flex flex-col items-start gap-1" v-if="label || subLabel">
      <span class="text-xs leading-none" v-if="preLabel">{{ preLabel }}</span>
      <span class="text-sm font-bold leading-none" v-if="label">{{
        label
      }}</span>
      <span class="text-xs leading-none" v-if="subLabel">{{ subLabel }}</span>
    </div>
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  selected: boolean
  icon: string
  name: string
  label: string
  preLabel?: string
  subLabel?: string
}>()
const baseUrl = "https://serkowebtest.blob.core.windows.net/airline-logos"

</script>
