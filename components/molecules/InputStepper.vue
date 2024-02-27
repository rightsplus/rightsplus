<template>
  <div
    :class="outerClass"
    class="flex items-center bg-neutral-100 rounded-lg ring-1 ring-neutral-200 focus-within:ring-primary-500 shrink-0"
  >
    <button
      class="w-14 h-14 shrink-0 hover:bg-neutral-50 text-sm focus-visible:outline-0 focus-visible:ring-primary-500 rounded-l-lg z-10"
      :class="{
        'opacity-50 pointer-events-none': modelValue <= (min ?? -Infinity),
      }"
      @click="emit('update:modelValue', modelValue - 1)"
    >
      <FontAwesomeIcon icon="minus" />
    </button>
    <input
      type="number"
      class="!ring-primary-500 h-14 grow justify-center flex items-center bg-neutral-50 font-bold text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0 border-none z-20"
      :value="clamp(modelValue)"
      @input="emit('update:modelValue', clamp(+($event.target as HTMLInputElement).value))"
      :min="min"
      :max="max"
    />
    <button
      @click="emit('update:modelValue', modelValue + 1)"
      class="w-14 h-14 shrink-0 hover:bg-neutral-50 text-sm focus-visible:outline-0 focus-visible:ring-primary-500 rounded-r-lg z-10"
      :class="{
        'opacity-50 pointer-events-none': modelValue >= (max ?? Infinity),
      }"
    >
      <FontAwesomeIcon icon="plus" />
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: number;
  min?: number;
  max?: number;
  outerClass?: string;
}>();
const emit = defineEmits(["update:modelValue"]);
const clamp = (val: number) => Math.min(Math.max(props.min ?? -Infinity, val), props.max ?? Infinity);
</script>
