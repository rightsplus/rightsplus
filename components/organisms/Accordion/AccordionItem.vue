<template>
  <component
    :is="tag?.inner || 'li'"
    class="py-4 first:-mt-5 last:-mb-5"
    :class="{
      'border-b last:border-none border-gray-100': border,
      [classes?.inner || '']: classes?.inner
    }"
    ref="item"
  >
    <component
      :is="tag?.title || 'div'"
      class="flex gap-5 py-4 -my-4 justify-between"
      :class="{
        'text-xl font-bold': !classes?.title,
        [classes?.title || '']: classes?.title,
        'group cursor-pointer': !active || collapsible
      }"
      @click="open"
      @keydown.prevent.space="open"
      tabindex="0"
    >
      <slot name="title" />
      <div
        v-if="arrow"
        class="flex items-center justify-center text-neutral-500 bg-neutral-500/5 rounded-full w-8 h-8 text-base shrink-0"
      >
        <FontAwesomeIcon
          class="duration-300"
          :class="active ? 'rotate-180' : ''"
          icon="angle-down"
        />
      </div>
    </component>
    <div class="-mx-1">
      <TransitionExpand
        :show="active"
        scale="1"
        :duration="300"
        keep-alive
      >
        <component
          :is="tag?.content || 'div'"
          :class="{
            'text-lg mt-3 px-1': !classes?.content,
            [classes?.content || '']: classes?.content
          }"
          ><slot name="content"
        /></component>
      </TransitionExpand>
    </div>
  </component>
</template>

<script setup lang="ts">
import TransitionExpand from "@/components/molecules/TransitionExpand.vue";
import type { AccordionStructure } from "./types";
const props = defineProps<{
  modelValue: (string | number)[];
  index: string | number;
  headless?: boolean;
  tag?: AccordionStructure;
  classes?: AccordionStructure;
  collapsible?: boolean;
  border?: boolean;
  arrow?: boolean;
}>();
const item = ref<HTMLElement | null>(null);
const emit = defineEmits(["update:modelValue"]);
const active = computed(() => props.modelValue.includes(props.index));
const open = () => {
  if (props.modelValue.length === 1 && active.value && props.collapsible) {
    emit("update:modelValue", []);
  } else {
    emit("update:modelValue", [props.index]);
  }
};
// watch(active, async (value) => {
//   if (value) {
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     const el = item.value;
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   }
// })
</script>
