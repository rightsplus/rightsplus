<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :title="title"
    :disabled="disabled"
    class="button items-center justify-center"
  >

    <span class="flex items-center justify-center gap-2">
      <slot></slot>
    </span>
  </NuxtLink>
  <button
    v-else
    :title="title"
    :disabled="disabled"
    class="button items-center justify-center"
    :aria-label="title"
  >

    <span class="flex items-center justify-center gap-2">
      <slot></slot>
    </span>
  </button>
</template>
<script lang="ts">
export default defineComponent({
  name: "Button",
  setup() {
    // const NuxtLink = resolveComponent("NuxtLink");
    // return {
    //   NuxtLink,
    // };
  },
  props: {
    name: String,
    title: String,
    vertical: Boolean,
    disabled: Boolean,
    to: {
      type: String,
    },
    icon: {
      type: [String, Boolean],
    },
  },
});
</script>
<style lang="scss" scoped>
@media (hover: hover) {
  .button:hover {
    & > :deep(*),
    :deep(svg),
    :deep(path) {
      fill: currentColor !important;
    }
    .move-right > :deep(svg) {
      transform: translateX(0.25em)
    }
    .move-left > :deep(svg) {
      transform: translateX(-0.25em)
    }
  }
}
$colors: primary, secondary, info, beige, success, warning, alert;
:global(:where(.button)) {
  display: flex;
  margin: 0 calc(var(--border-default) * -2);
  border: none;
  font-size: 1em;
}
.button {
  --size: var(--h-12);
  --padding: var(--p-2) var(--p-5);
  --bg-opacity: 1;
  --border-radius: var(--rounded-full);
  --color: white;
  --background: var(--color-primary-400);
  --hover: var(--color-primary-500);
  height: var(--size);
  border-radius: var(--border-radius);
  position: relative;
  padding: var(--padding);
  line-height: 1.1;
  box-shadow: inset 0 0 0 var(--border-default) var(--border-color);
  text-align: center;
  transition: all var(--transition-duration-default) ease-in-out;
  z-index: 1;
  white-space: nowrap;
  background-color: var(--background);
  span {
    color: var(--color);
  }
  &:hover {
    background-color: var(--hover);
  }
  &.fill {
    --background: white;
    --color: currentColor;
    &:hover {
      --background: transparent;
      --color: white;
      --border-color: white;
      box-shadow: inset 0 0 0 var(--border-default) var(--border-color);
    }
  }
  &.xxs {
    font-size: var(--text-xs);
    --size: var(--h-5);
    --padding: var(--p-0) var(--p-1);
  }
  &.xs {
    // font-size: var(--text-lg);
    --size: var(--h-6);
    --padding: var(--p-0) var(--p-1);
  }
  &.sm {
    --size: var(--h-8);
    --padding: var(--p-1) var(--p-3);
  }
  &.lg {
    --size: var(--h-12);
    --padding: var(--p-4) var(--p-5);
  }
  &.xl {
    font-size: var(--text-lg);
    --size: var(--h-16);
    --padding: var(--p-6) var(--p-7);
  }
}
</style>