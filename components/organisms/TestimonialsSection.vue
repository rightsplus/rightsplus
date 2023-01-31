<template>
  <section class="grid grid-cols-1 md:grid-cols-6 justify-center py-24 px-6 duration-1000">
    <div class="hidden md:flex items-center justify-center">
      <Button class="w-12" @click="prev"
      v-if="data.testimonial.length > 1"
      :title="$t('prev.testimonial')"
        ><FontAwesomeIcon :icon="['fas', 'arrow-left']"
      /></Button>
    </div>
    <ListGroupTransition
      :watcher="current"
      transitionName="move"
      v-if="testimonials.length > 0"
      class="col-span-4 mx-auto"
    >
      <Testimonial
        v-for="testimonial in testimonials"
        :key="testimonial.id"
        :testimonial="testimonial"
      />
    </ListGroupTransition>
    <div class="hidden md:flex items-center justify-center">
      <Button class="w-12" @click="next"
      v-if="data.testimonial.length > 1"
      :title="$t('next.testimonial')"
        ><FontAwesomeIcon :icon="['fas', 'arrow-right']"
      /></Button>
    </div>
  </section>
</template>

<script lang="ts">
import Button from "~/components/molecules/Button.vue";
import Testimonial from "~/components/cells/Testimonial.vue";
import ListGroupTransition from "~/components/cells/ListGroupTransition.vue";
export default defineComponent({
  components: {
    Button,
    Testimonial,
    ListGroupTransition,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      current: Math.floor(Math.random() * this.data.testimonial.length),
      timeout: null,
    };
  },
  mounted() {
    const interval = () => {
      this.next();
      this.timeout = setTimeout(interval, this.duration);
    };
    this.timeout = setTimeout(interval, this.duration);
  },
  computed: {
    duration() {
      return this.data.testimonial[this.current].testimonial.length * 50 + 1500;
    },
    testimonials() {
      return this.data.testimonial.filter((e: any, i: number) => i === this.current);
    },
  },
  methods: {
    prev() {
      clearTimeout(this.timeout);
      if (this.current === 0) {
        this.current = this.data.testimonial.length - 1;
      } else {
        this.current--;
      }
    },
    next() {
      clearTimeout(this.timeout);
      if (this.current === this.data.testimonial.length - 1) {
        this.current = 0;
      } else {
        this.current++;
      }
    },
  },
});
</script>
<style lang="scss"></style>
