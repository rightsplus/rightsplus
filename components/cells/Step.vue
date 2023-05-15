<template>
	<ClientOnly>
    <li
      class="flex items-center group"
      :class="{
        'text-green-500': isDone,
        'text-green-600': isActive,
        'hover:text-green-600': isDone,
        'text-gray-500 hover:text-gray-600': isPending,
        'cursor-default': isActive,
        'cursor-pointer': isDone,
        'pointer-events-none': isPending,
      }"
      @click="$emit('setStep', index)"
    >
		
      <div class="flex items-center leading-none text-left gap-1 sm:gap-3 h-4">
        <div v-if="index < step">
          <FontAwesomeIcon icon="check-circle" />
        </div>
        <span v-else class="text-lg font-black leading-none w-4 text-center">{{
          index + 1
        }}</span>
        <span v-html="label" class="leading-none text-sm sr-only sm:!not-sr-only" />
			
      </div>
		
    </li></ClientOnly>
</template>

<script lang="ts" setup>
const props = defineProps<{
  step: number;
	index: number;
	label: string;
}>();
defineEmits<{
  (event: "setStep", step: number): void;
}>();
const isDone = computed(() => props.index < props.step)
const isActive = computed(() => props.index === props.step)
const isPending = computed(() => props.index > props.step)
</script>
