<template>
  <div
    class="flex flex-col gap-5 items-center bg-stone-50 rounded-2xl p-6 sm:p-12 w-full max-w-2xl"
  >
    <div class="w-24 h-24 -translate-y-20 -mb-20 sm:-translate-y-24 sm:-mb-24" v-if="testimonial.image.data">
      <Image
        class="h-full rounded-full"
        :media="testimonial.image.data.attributes"
        width="160"
      />
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-12 w-full">
      <Stars
        :n="5"
        class="hidden sm:flex justify-center items-center"
        :class="{ '-mt-10': testimonial.image.data }"
      />
      <div class="col-span-2 flex flex-col items-center gap-2 text-center">
        <div class="text-3xl font-bold">{{ testimonial.name }}</div>
        <div class="text-xl text-stone-500 font-medium leading-none">
          {{ testimonial.position }}
        </div>
      </div>
      <div
        class="hidden sm:flex justify-center items-center text-primary-500 text-5xl leading-none text-center"
        :class="{ '-mt-10': testimonial.image.data }"
      >
        <FontAwesomeIcon :icon="['fas', 'quote-right']" />
      </div>
    </div>
    <div v-html="content" class="markdown" />
  </div>
</template>

<script lang="ts">
import Image from "~/components/molecules/Image.vue";
import Stars from "~/components/molecules/Stars.vue";
export default defineComponent({
  components: {
    Image,
    Stars,
  },
  props: {
    testimonial: {
      type: Object,
    },
  },
  computed: {
    content() {
      return useMarkdown(this.testimonial.testimonial)
      // return this.data.image?.data.attributes
    },
  },
});
</script>
<style lang="scss"></style>
