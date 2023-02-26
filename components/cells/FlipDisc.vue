<template>
  <component :is="tag"><span v-html="converted"></span></component>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    tag: {
      type: String,
      default: "div",
    },
    text: {
      type: String,
      default: "FlipDisc",
    },
  },
  computed: {
    converted() {
      return this.text
        .split("")
        .map((char) => `<i>${char}</i>`)
        .join("");
    },
  },
});
</script>

<style scoped lang="scss">
span {
	text-transform: uppercase;
  &::v-deep(i) {
		font-style: normal;
		position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      height: 3px;
      width: 110%;
      background: rgb(229,229,229);
			z-index: 1;
    }
  }
}
</style>
