<template>
  <Teleport to="body">
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed flex items-center justify-center inset-0 w-screen h-screen bg-black/60 z-50"
      @click.self="{$emit('close'); $emit('closeOutside')}"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-[640px] max-w-screen min-h-[160px] max-h-[90vh] overflow-auto flex flex-col justify-between m-5"
        v-bind="$attrs"
      >
        <div class="flex justify-between gap-12" v-if="$attrs.onClose || title">
          <div class="flex flex-col gap-1">
            <div class="z-10 relative"><slot name="pretitle"></slot></div>
            <h3
              class="text-2xl md:text-3xl -top-8 -mt-8 pt-8 sm:-top-12 sm:-mt-12 sm:pt-12 pb-6 font-bold sticky bg-white"
            >
              {{ title }}
            </h3>
          </div>
          <button
            v-if="$attrs.onClose"
            class="h-12 w-12 min-w-[48px] md:h-16 md:w-16 md:min-w-[48px] items-center justify-center -m-3 md:-m-5 text-stone-400 hover:text-primary-500 rounded-xl"
            @click="$emit('close')"
          >
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        <p class="markdown" v-html="content" v-if="content" />
        <slot />
      </div>
    </div>
  </Transition>
</Teleport>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{
  title?: string;
  content?: string;
  open?: boolean;
}>();

watch(
  () => props.open,
  (value) => document.body.style.overflow = value ? "hidden" : "auto"
);
</script>
