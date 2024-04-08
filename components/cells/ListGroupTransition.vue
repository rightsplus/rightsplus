<template>
  <div :style="{ height: `${height}px` }" class="wrapper">
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
const { default: defaultSlots } = useSlots();
const length = defaultSlots?.()[0]?.children?.length || 0;

</script>

<style lang="scss" scoped>
.wrapper {
  height: var(--height);
  transition: 1s;
}
</style>
