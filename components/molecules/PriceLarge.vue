<template>
  <div
    class="flex flex-col bg-white lg:w-96 rounded-xl overflow-hidden lg:order-0"
    :class="{
      'lg:mt-12 w-full max-lg:order-1': !highlight,
      'bg-success-800 text-white w-full': highlight,
    }"
  >
    <div
      v-if="highlight"
      class="flex items-center w-full h-12 justify-center bg-success-400 text-white uppercase tracking-wider text-sm"
    >
      {{ highlight }}
    </div>
    <div class="flex flex-col gap-12 h-full p-5 sm:p-12 md:p-10 lg:p-12">
      <div class="flex flex-col items-center">
        <div class="text-xl">{{ title }}</div>
        <div class="text-4xl font-bold">{{ price }}</div>
        <div v-if="discount" class="text-sm mt-2 text-alert-500">
          {{ discount }}% Rabatt, vorher {{ originalPrice }}€
        </div>
      </div>
      <div class="markdown text-md flex flex-col gap-4">
        <div v-for="item in list" class="flex gap-3 leading-tight">
          <FontAwesomeIcon
            :icon="['fas', 'check']"
            fixed-width
            class="text-success-400 mt-1 shrink-0"
          />
          <div>{{ item }}</div>
        </div>
      </div>
      <div class="flex flex-col items-center mt-auto" v-if="mailTo">
        <Button :to="mailTo">{{ $t("register") }}</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Button from "../molecules/Button.vue";
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
