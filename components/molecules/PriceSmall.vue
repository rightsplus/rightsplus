<template>
  <div
    class="flex flex-col bg-white w-48 h-36 rounded-xl overflow-hidden"
    :class="{
      'bg-success-800 text-white w-full': highlight,
    }"
  >
    <div class="flex flex-col gap-12 h-full p-5">
      <div class="flex flex-col items-start h-full">
        <div class="text-sm leading-none">{{ title }}</div>
        <div class="text-2xl font-bold">
          <span>{{ price }}</span
          ><span v-if="true" class="text-sm font-normal">/Std.</span>
        </div>
        <div
          v-if="highlight"
          class="flex items-center py-1 px-2 -mx-1 mt-auto justify-center bg-success-400 text-white uppercase tracking-wider text-xs rounded-full"
        >
          {{ highlight }}
        </div>
        <div v-if="discount" class="text-sm mt-auto text-alert-500">
          <span class="line-through">{{ originalPrice }}€</span>, {{ discount }}% Rabatt
        </div>
        <!-- <div v-if="discount" class="text-sm mt-auto text-alert-500">
          {{ discount }}% Rabatt, vorher {{ originalPrice }}€
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Button from "./Button.vue";
export default defineComponent({
  components: {
    Event,
    Button,
    FontAwesomeIcon,
  },
  props: {
    highlight: {
      type: String,
    },
    discount: {
      type: [Boolean, Number],
    },
    title: {
      type: String,
    },
    price: {
      type: String,
    },
    originalPrice: {
      type: Number,
    },
    unit: {
      type: String,
    },
    list: {
      type: Array,
    },
    mailTo: {
      type: String,
    },
  },
});
</script>
<style lang="scss"></style>
