<template>
  <ol
    class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base gap-10"
  >
    <li
      v-for="({label, active}, index) in steps"
      :key="label"
      class="flex items-center group"
      :class="{
        'text-primary-600 dark:text-primary-500': active <= step && ((steps[index + 1]?.active || Infinity) > step),
        '': active < step,
      }"
    >
      <div class="flex items-center leading-none text-left gap-3">
        <!-- <ClientOnly> -->
          <div v-if="active <= step">
            <FontAwesomeIcon icon="check-circle" />
          </div>
          <span v-else class="text-lg font-black leading-none w-4 text-center">{{ index + 1 }}</span>
        <!-- </ClientOnly> -->
        <span v-html="label" class="leading-none text-sm" />
      </div>
    </li>
  </ol>
</template>

<script lang="ts">
import { defineComponent } from "vue";
interface Step {
  label: string;
  active: number;
}
export default defineComponent({
  props: {
    step: {
      type: Number,
      required: true,
      default: () => 0,
    },
    steps: {
      type: Array as () => Step[],
      required: true,
    },
  },
});
</script>
