<template>
  <section
    role="figure"
    :aria-labelledby="captionId"
    class="grid md:grid-cols-2 md:max-h-screen my-10 md:my-24 bg-stone-50 "
  >
    <Image
      :media="image"
      class="h-[80vh] md:h-auto max-h-screen"
      width="full"
    />
    <div class="flex items-center justify-center">
    <div
      :id="captionId"
      class="p-10 md:p-12 markdown"
      v-if="data.text"
      v-html="text"
    ></div>
  </div>
  </section>
</template>

<script lang="ts">
import Image from "~/components/molecules/Image.vue";
import { uuid } from "vue-uuid";
export default defineComponent({
  components: {
    Image,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data: () => ({ captionId: uuid.v4() }),
  computed: {
    image() {
      return this.data.image?.data.attributes;
    },
    text() {
      if (!this.data.text) return "";
      return useMarkdown(this.data.text);
    },
  },
});
</script>
<style lang="scss"></style>
