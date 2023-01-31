<template>
  <Transition name="page" style="--total: 1; --i: 1">
    <div
      v-if="open"
      class="fixed flex items-center justify-center inset-0 w-screen h-screen bg-black/60 z-50"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white rounded-2xl p-5 m-3 sm:p-12 shadow-2xl w-[960px] max-w-screen max-h-[90vh] overflow-auto flex flex-col justify-between"
      >
        <div class="flex justify-between gap-12">
          <div class="flex flex-col">
            <div class="z-10 relative"><slot name="pretitle"></slot></div>
            <h3
              class="text-2xl md:text-3xl -top-8 -mt-8 pt-8 sm:-top-12 sm:-mt-12 sm:pt-12 pb-6 font-bold sticky bg-white"
            >
              {{ title }}
            </h3>
          </div>
          <button
            class="font-normal text-4xl md:text-6xl h-12 w-12 min-w-[48px] md:h-16 md:w-16 md:min-w-[48px] items-center justify-center -m-3 md:-m-5 text-stone-400 hover:text-primary-500 rounded-xl"
            @click="$emit('close')"
          >
            &times;
          </button>
        </div>
        <p class="markdown" v-html="content" v-if="content" />
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
