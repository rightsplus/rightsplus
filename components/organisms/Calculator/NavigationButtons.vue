<template>
  <div
    ref="stickyElement"
    class="sticky rounded-b-3xl bg-white flex items-center justify-end ease-out bottom-0 mt-12 -m-4 p-4"
    :class="{ 'shadow-2xl !rounded-b-none md:!rounded-3xl -mx-8 sm:-mx-16 md:-mx-20 lg:-mx-20 md:bottom-4 z-40': isStickyRelative, 'duration-150': ready }"
  >
    <Stepper
      :steps="useSteps()"
      :step="useClaim().value.step"
      @setStep="useClaim().value.step = $event"
    />
    <button
      v-if="$attrs?.onPrevious"
      @click.prevent="$emit('previous')"
      :disabled="previousDisabled"
      class="text-base text-gray-500 hover:underline underline-offset-2 flex gap-2 items-center py-2 px-5 leading-none"
    >
      Zurück
    </button>
    <FormKit
      v-if="$attrs?.onNext"
      type="button"
      @click="$emit('next')"
      :label="nextLabel || 'Weiter'"
      :disabled="nextDisabled"
      outer-class="!mb-0 [&>*]:!mb-0"

      suffix-icon="arrow-right"
    />
  </div>
</template>
<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import Stepper from '~/components/cells/Stepper.vue';

defineProps<{
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
}>();

const isStickyRelative = ref(true);
const ready = ref(false);
const stickyElement = ref(null as HTMLElement | null);

const handleScroll = () => {
  const rect = stickyElement.value?.getBoundingClientRect();
  const threshold = window.innerWidth < 768 ? window.innerHeight : window.innerHeight - 24;
  isStickyRelative.value = (rect?.bottom || 0) >= threshold;
};
const { height } = useElementSize(document.body)
watch(height, handleScroll)

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
  setTimeout(handleScroll);
  setTimeout(() => ready.value = true);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
});
</script>
<style lang="postcss" scoped>
</style>