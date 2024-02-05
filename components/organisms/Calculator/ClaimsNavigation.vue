<template>
  <Callout
    type="error"
    icon="exclamation-triangle"
    key=""
    v-if="index >= claimProccess.completed && claimProccess.eligible === false"
    >{{ claimProccess.message }}
  </Callout>
  <div
    ref="stickyElement"
    class="sticky rounded-b-3xl bg-white flex items-center justify-end ease-out bottom-0 mt-12 -m-5 p-5 -z-1"
    :class="{
      'shadow-2xl !rounded-b-none md:!rounded-3xl -mx-10 sm:-mx-20 md:-mx-20 lg:-mx-20 md:bottom-4 z-40': isStickyRelative,
      'duration-150': ready
    }"
  >
    <div class="flex flex-col w-full">
      <Stepper :steps="steps" :step="index" @setStep="index = $event" />
      <CellsClaimableAmount class="font-bold"/>
    </div>

    <span class="text-base text-gray-500 py-2 px-5 leading-none"> </span>

    <button
      v-if="index > 0"
      @click.prevent="handlePrevious"
      :disabled="previousDisabled"
      class="text-base text-gray-500 hover:text-gray-800 underline underline-offset-2 flex gap-2 items-center py-2 px-5 leading-none"
    >
      Zurück
    </button>
    <FormKit
      type="button"
      @click="handleNext"
      :label="nextLabel || 'Weiter'"
      :disabled="claimProccess.completed < index"
      :title="claimProccess.message"
      outer-class="!mb-0 [&>*]:!mb-0 whitespace-nowrap"
      suffix-icon="arrow-right"
    />
  </div>
</template>
<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
import Stepper from "~/components/cells/Stepper.vue";
import { next, prev } from "@/composables/steps";
import Callout from "@/components/molecules/Callout.vue";
const { steps, index } = useSteps();
defineProps<{
  previousDisabled?: boolean;
  nextLabel?: string;
}>();

const emit = defineEmits();
const claimProccess = useProcessClaim();
const handlePrevious = () => {
  prev();
  window.scrollTo({ top: 0, behavior: "smooth" });
};
const handleNext = () => {
  if (index.value === steps.value.length - 1) return emit("submit");
  next();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const isStickyRelative = ref(true);
const ready = ref(false);
const stickyElement = ref(null as HTMLElement | null);

const handleScroll = () => {
  const rect = stickyElement.value?.getBoundingClientRect();
  const threshold =
    window.innerWidth < 768 ? window.innerHeight : window.innerHeight - 24;
  isStickyRelative.value = (rect?.bottom || 0) >= threshold;
};
const { height } = useElementSize(document?.body);
watch(height, handleScroll);

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
  setTimeout(handleScroll);
  setTimeout(() => (ready.value = true));
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
});
</script>
<style lang="postcss" scoped></style>
