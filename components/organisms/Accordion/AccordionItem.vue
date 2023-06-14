<template>
  <li
    class="border-b last:border-none border-gray-100 py-5 [&_em]:bg-primary-300 [&_em]:ring-2 [&_em]:ring-primary-300 [&_em]:rounded [&_em]:not-italic"
  >
    <div
      class="flex gap-5 justify-between text-xl font-bold cursor-pointer"
      @click="open"
    >
      <slot name="title" />
      <div
        class="flex items-center justify-center text-neutral-500 bg-neutral-500/5 rounded-full w-8 h-8 text-base shrink-0"
      >
        <ClientOnly
          ><FontAwesomeIcon
            class="duration-300"
            :class="active ? 'rotate-180' : ''"
            icon="arrow-down"
        /></ClientOnly>
      </div>
    </div>

    <TransitionExpand
      :show="modelValue?.includes(index)"
      scale="1"
      :duration="300"
    >
      <div class="text-lg"><slot name="content" /></div>
    </TransitionExpand>
  </li>
</template>

<script setup lang="ts">
import TransitionExpand from "@/components/molecules/TransitionExpand.vue";

const props = defineProps<{
  modelValue: number[];
  index: number;
}>();
const emit = defineEmits(["update:modelValue"]);
const active = computed(() => props.modelValue.includes(props.index));
const open = () => {
  if (props.modelValue.length === 1 && active.value) {
    emit("update:modelValue", []);
  } else {
    emit("update:modelValue", [props.index]);
  }
};
</script>
