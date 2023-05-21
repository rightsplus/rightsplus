<template>
  <div class="flex items-center justify-end">
    <button
      v-if="$attrs?.onPrevious"
      @click.prevent="$emit('previous')"
      :disabled="previousDisabled"
      class="text-base text-gray-500 hover:underline underline-offset-2 flex gap-2 items-center py-2 px-5 leading-none"
    >Zurück</button>
    <FormKit
      v-if="$attrs?.onNext"
      type="button"
      @click="$emit('next')"
      label="Weiter"
      :disabled="nextDisabled"
      outer-class="!mb-0"
      suffix-icon="arrow-right"
    />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  previousDisabled?: boolean;
  nextDisabled?: boolean;
}>();
</script>
