<template>
  <transition
    name="expand"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    :style="`--duration: ${duration}ms; --timing: ${timing}; --scale: ${scale};--opacity: ${opacity};`"
  >
    <div v-if="show && !keepAlive">
      <slot />
    </div>
    <div v-else v-show="show && keepAlive">
      <slot />
    </div>
  </transition>
</template>
<script setup lang="ts">

interface Props {
  show: boolean;
  opacity?: string;
  scale?: string;
  duration?: number;
  timing?: string;
  keepAlive?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  opacity: "0",
  scale: "0.9",
  duration: 500,
  timing: "cubic-bezier(0.47, 0, 0.175, 1)",
  show: false,
});
const margin = ref("0");
const padding = ref("0");
const afterEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "auto";
};
const beforeEnter = (el: Element) => {
  const element = el as HTMLElement;
  margin.value = getComputedStyle(element).getPropertyValue("margin");
  margin.value = getComputedStyle(element).getPropertyValue("padding");
  element.style.margin = "0";
  element.style.marginBottom = "0";
  element.style.marginLeft = margin.value;
  element.style.marginRight = margin.value;
  element.style.padding = "0";
  element.style.paddingBottom = "0";
  element.style.paddingLeft = padding.value;
  element.style.paddingRight = padding.value;
  element.style.opacity = props.opacity;
  element.style.transform = `scale(${props.scale})`;
};
const enter = (el: Element) => {
  const element = el as HTMLElement;
  const { width } = getComputedStyle(element);
  /* eslint-disable no-param-reassign */
  element.style.width = width;
  element.style.position = "absolute";
  element.style.visibility = "hidden";
  element.style.height = "auto";
  /* eslint-enable */
  const { height } = getComputedStyle(element);
  /* eslint-disable no-param-reassign */
  element.style.width = "";
  element.style.position = "";
  element.style.visibility = "";
  element.style.height = "0";

  element.style.marginTop = margin.value;
  element.style.marginBottom = margin.value;
  element.style.marginLeft = margin.value;
  element.style.marginRight = margin.value;

  element.style.paddingTop = padding.value;
  element.style.paddingBottom = padding.value;
  element.style.paddingLeft = padding.value;
  element.style.paddingRight = padding.value;

  element.style.opacity = "1";
  element.style.transform = "scale(1)";
  /* eslint-enable */
  // Force repaint to make sure the
  // animation is triggered correctly.
  // eslint-disable-next-line no-unused-expressions
  getComputedStyle(element).height;
  requestAnimationFrame(() => {
    // eslint-disable-next-line no-param-reassign
    element.style.height = height;
  });
};
const leave = (el: Element) => {
  const element = el as HTMLElement;
  const { height } = getComputedStyle(element);
  // eslint-disable-next-line no-param-reassign
  element.style.height = height;

  element.style.marginTop = margin.value;
  element.style.marginBottom = margin.value;
  element.style.marginLeft = margin.value;
  element.style.marginRight = margin.value;

  element.style.paddingTop = padding.value;
  element.style.paddingBottom = padding.value;
  element.style.paddingLeft = padding.value;
  element.style.paddingRight = padding.value;

  element.style.opacity = props.opacity;
  element.style.transform = `scale(${props.scale})`;
  // Force repaint to make sure the
  // animation is triggered correctly.
  // eslint-disable-next-line no-unused-expressions
  getComputedStyle(element).height;
  requestAnimationFrame(() => {
    // eslint-disable-next-line no-param-reassign
    element.style.height = "0";

    element.style.marginTop = "0";
    element.style.marginBottom = "0";
    element.style.marginLeft = margin.value;
    element.style.marginRight = margin.value;

    element.style.paddingTop = "0";
    element.style.paddingBottom = "0";
    element.style.paddingLeft = padding.value;
    element.style.paddingRight = padding.value;

    element.style.opacity = props.opacity;
    element.style.transform = `scale(${props.scale})`;
  });
};
</script>

<style scoped>
* {
  will-change: height, margin, padding, transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
.expand-enter-active,
.expand-leave-active {
  transition: all var(--duration) var(--timing);
  overflow: hidden;
}
.expand-enter,
.expand-leave-to {
  height: 0;
  opacity: var(--opacity);
  transform: scale(--scale);
  padding: 0;
  margin: 0;
}
</style>
