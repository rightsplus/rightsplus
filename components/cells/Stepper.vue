<template>
  <ol
    class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base gap-10"
  >
    <li
      v-for="(step, index) in steps"
      :key="step.label"
      class="flex items-center group"
      :class="{
        'text-primary-600 dark:text-primary-500': step.active,
        '': step.completed,
      }"
    >
      <div class="flex items-center leading-none text-left gap-3">
        <!-- <ClientOnly> -->
          <div v-if="step.completed || step.active">
            <FontAwesomeIcon icon="check-circle" />
          </div>
          <span v-else class="text-lg font-black">{{ index + 1 }}</span>
        <!-- </ClientOnly> -->
        <span v-html="step.label" class="leading-none text-sm" />
      </div>
    </li>
  </ol>
</template>

<script lang="ts">
import { defineComponent } from "vue";
interface Step {
  label: string;
  active: boolean;
  completed: boolean;
}
export default defineComponent({
  props: {
    steps: {
      type: Array as () => Step[],
      required: true,
    },
  },
});
</script>
