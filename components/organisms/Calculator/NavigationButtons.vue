<template>
  <div class="flex items-center justify-end gap-3">
    <ButtonBack
      v-if="$attrs?.onPrevious"
      @click.prevent="$emit('previous')"
      :disabled="previousDisabled"
    />
    <FormKit
      v-if="$attrs?.onNext"
      type="button"
      @click="$emit('next')"
      label="Weiter"
      :disabled="nextDisabled"
      outer-class="!mb-0"
    />
  </div>
</template>
<script setup lang="ts">
import ButtonBack from "@/components/molecules/ButtonBack.vue";
defineProps<{
  previousDisabled?: boolean;
  nextDisabled?: boolean;
}>();
</script>
