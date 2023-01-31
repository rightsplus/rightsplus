<template>
  <Transition name="page">
    <div
      v-if="show"
      class="absolute left-0 -top-36 w-full h-[200vh] overflow-hidden pointer-events-none"
    >
      <div
        v-for="(circle, i) in circles"
        :key="i"
        class="absolute rounded-full border border-gold-500"
        :style="{
          width: circle.size,
          height: circle.size,
          top: circle.top,
          right: circle.right,
          left: circle.left,
        }"
      ></div>
    </div>
  </Transition>
</template>

<script lang="ts">
export default defineComponent({
  mounted() {
    window.addEventListener("mousemove", this.onMouseMove);
    setTimeout(() => {
      this.show = true;
    }, 500);
  },
  methods: {
    onMouseMove(e: MouseEvent) {
      this.pointer = {
        x: Math.abs(e.clientX / window.innerWidth),
        y: Math.abs(e.clientY / window.innerHeight),
      };
    },
  },
  data() {
    return {
      show: false,
      pointer: {
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    circles() {
      return [
        {
          size: `${16}vw`,
          top: `${-4 * (this.pointer.y / 20 + 1)}vh`,
          left: `${-1 * (this.pointer.x / 5 + 1)}vw`,
        },
        {
          size: `${40}vw`,
          top: `${60 * (this.pointer.y / 20 + 1)}vh`,
          right: `${-5 * (this.pointer.x / 5 + 1)}vw`,
        },
        {
          size: `${20}vw`,
          top: `${150 * (this.pointer.y / 30 + 1)}vh`,
          left: `${10 * (this.pointer.x / 20 + 1)}vw`,
        },
      ];
    },
  },
});
</script>

<style scoped></style>
