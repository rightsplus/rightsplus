<template>
  <div>
    <span class="text-sm font-medium"
      >{{ step + 1 }}. {{ steps[step].label }}</span
    >
    <ol
      class="flex w-full text-md font-medium text-center md:text-base gap-1 md:gap-2 py-2 -mx-3 px-3"
    >
      <div
        v-for="({ completed }, index) in steps"
        @click="$emit('setStep', index)"
        class="w-full max-w-[50px] h-2 rounded-full cursor-pointer"
        :class="{
          'bg-primary-400 hover:bg-primary-500': index <= step,
          'bg-neutral-200 hover:bg-neutral-300': index > step,
          'pointer-events-none opacity-50': claimProccess.completed < index - 2
        }"
      />
      <!-- <Step
      v-for="({ label }, index) in steps"
      :key="label"
      :label="label"
      :step="step"
      :index="index"
      @setStep="$emit('setStep', index)"
      class="min-w-[60px]"
    /> -->
    </ol>
  </div>
</template>

<script lang="ts" setup>
import type { Step } from "@/composables/steps";
defineProps<{
  step: number;
  steps: Step[];
}>();
defineEmits<{
  (event: "setStep", step: number): void;
}>();

const claimProccess = useProcessClaim()
</script>
