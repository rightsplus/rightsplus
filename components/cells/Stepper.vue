<template>
  <ol
    class="flex flex-col w-full text-sm font-medium text-center sm:text-base gap-8 p-5"
  >
    <li
      v-for="({ label, active }, index) in steps"
      :key="label"
      class="flex items-center group"
      :class="{
        'text-green-500': active <= step,
        'hover:text-green-600': active < step,
        'text-gray-500 hover:text-gray-600': active > step,
        'cursor-default text-green-600': active === step,
        'cursor-pointer': active !== step,
      }"
      @click="$emit('setStep', index)"
    >
      <div class="flex items-center leading-none text-left gap-3 h-4">
        <div v-if="active < step">
          <ClientOnly><FontAwesomeIcon icon="check-circle" /></ClientOnly>
        </div>
        <span v-else class="text-lg font-black leading-none w-4 text-center">{{
          index + 1
        }}</span>
        <span v-html="label" class="leading-none text-sm" />
      </div>
    </li>
  </ol>
</template>

<script lang="ts" setup>
interface Step {
  label: string;
  active: number;
}
defineProps<{
  step: number;
  steps: Step[];
}>();
defineEmits<{
  (event: "setStep", step: number): void;
}>();
</script>
