<template>
  <ol
    class="flex lg:flex-col w-full text-md font-medium text-center md:text-base gap-5 md:gap-8 md:py-2"
  >
    <Step
      v-for="({ label }, index) in steps"
      :key="label"
      :label="label"
      :step="step"
      :index="index"
      @setStep="$emit('setStep', index)"
    />
  </ol>
</template>

<script lang="ts" setup>
import Step from './Step.vue'
interface Step {
  label: string;
}
defineProps<{
  step: number;
  steps: Step[];
}>();
defineEmits<{
  (event: "setStep", step: number): void;
}>();
</script>
