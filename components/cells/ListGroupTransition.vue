<template>
  <div :style="{ height: `${height}px` }" class="duration-300 ease-out">
    <TransitionGroup
      :name="name || 'list'"
      :tag="tag || 'div'"
      class="relative"
      ref="content"
      v-bind="$attrs"
    >
      <slot />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from "@vueuse/core";

defineProps<{
  tag?: string;
  name?: string;
}>();
const content = ref<HTMLElement>();
const { height } = useElementSize(content);
</script>
