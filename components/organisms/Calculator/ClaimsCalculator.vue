<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
    <ClientOnly
      ><Transition mode="out-in" name="fade">
        <div
          v-if="useClaim().value"
          class="lg:col-span-3 lg:col-start-2 bg-white rounded-2xl md:rounded-3xl p-4 md:p-12 w-full"
          :style="`--height: ${containerHeight}px`"
          ref="container"
        >
          <component
            v-model="useClaim().value"
            :is="activeStep?.component"
            :title="activeStep?.title"
            @submit="next"
            @back="back"
            @reset="reset"
          /></div
      ></Transition>
    </ClientOnly>

    <!-- <div class="flex flex-col gap-3">
      <Transition mode="out-in" name="fade">
        <div
          v-if="useClaim().value.flight && useClaim().value.step > 1"
          class="flex flex-col gap-2 bg-neutral-100 rounded-xl w-full p-4 px-5"
          v-bind="$attrs"
        >
          <PotentialClaims />
        </div>
      </Transition>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const containerHeight = ref(100);
const activeStep = computed(() => useSteps()[useClaim().value?.step || 0]);

const next = (e?: number) => {
  useClaim().value.step = e ?? useClaim().value.step + 1;
};
const back = (e?: number) => {
  useClaim().value.step = e ?? useClaim().value.step - 1;
};
const reset = (e?: number) => {
  useClaim().value.step = e ?? 0;
};

// watch(
//   () => useClaim().value?.step,
//   () => setTimeout(setHeight, 0)
// );
// const setHeight = () => {
//   const childrenHeight = Math.min(
//     window.innerHeight - 120,
//     Math.max(
//       100,
//       ((this.$refs.container as HTMLElement)?.children[0]?.offsetHeight ||
//         0) + 80
//     )
//   );
//   this.containerHeight = (
//     this.$refs.container as HTMLElement
//   )?.children[0]?.offsetHeight;
// }
</script>
<style scoped></style>
