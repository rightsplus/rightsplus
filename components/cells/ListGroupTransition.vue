<template>
  <div
    class="relative"
    :class="{
      [`${name}-container`]: name,
      activeTransition
    }"
    :style="`--height: ${containerHeight}`"
  >
    <TransitionGroup
      :name="name"
      @before-enter="activate"
      @after-enter="deactivate"
      @before-leave="activate"
      @after-leave="deactivate"
    >
      <slot />
    </TransitionGroup>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    watcher: {
      type: [Object, Boolean, String, Array, Number],
    },
    tag: {
      type: String,
      default: "div",
    },
    name: {
      type: String,
      default: "list",
    },
  },
  data() {
    return {
      containerHeight: null,
      activeTransition: false,
      duration: 300,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.adjustHeight();
    });
  },
  watch: {
    watcher: {
      handler() {
        this.adjustHeight();
      },
      deep: true,
    },
  },
  methods: {
    adjustHeight(timeout: number = this.duration) {
      if (!this.$el.children) return;
      setTimeout(() => {
        let children = [];
        for (let item of this.$el.children) {
          if (!item.classList.contains(`${this.name}-leave-active`))
            children.push(item);
        }
        this.containerHeight =
          [...children].reduce((acc, curr) => acc + curr.clientHeight, 0) +
          "px";
      }, timeout);
    },
    activate() {
      (this.activeTransition = true), this.adjustHeight(0);
    },
    deactivate() {
      setTimeout(() => {
        this.activeTransition = false;
      }, this.duration);
    },
  },
};
</script>
<style lang="scss" scoped>
.activeTransition {
  height: var(--height);
}
</style>
