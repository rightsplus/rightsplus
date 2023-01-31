<template>
  <section
    ref="tiles"
    class="bg-stone-100 p-5 md:p-12 grid grid-cols-1 auto-rows-fr grid-flow-row gap-5 md:gap-12 max-w-7xl mx-auto md:grid-cols-2 "
    :class="{
      'lg:grid-cols-3 min-h-[30vh] ': data.size === 'sm',
      'min-h-[50vh] ': data.size !== 'sm'
    }"
    :style="`--total: ${data.tile.length}`"
    v-if="data.tile.length"
  >
    <Tile v-for="t, i in data.tile" class="flex" :class="{
      'transition-show': inView,
      'transition-hide': !inView,
      '!delay-[0ms] !duration-75': hasTransitioned
       }" :style="`--i: ${data.tile.length - i}`" v-bind="t" />
  </section>
</template>

<script lang="ts">
import Tile from "./Tile.vue";
export default defineComponent({
  components: {
    Tile,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      observer: new IntersectionObserver((e) => this.checkView(e[0])),
      inView: false,
      hasTransitioned: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.tiles) this.observer.observe(this.$refs.tiles);
    });
  },
  methods: {
    checkView({ isIntersecting }) {
      if (isIntersecting) {
        setTimeout(() => {
          this.inView = true;
          setTimeout(() => {
            this.hasTransitioned = true;
          }, this.data.tile.length * 250);
        }, 500);
      }
    },
  },
  computed: {
    content() {
      return useMarkdown(this.data);
    },
  },
});
</script>
<style lang="scss"></style>
