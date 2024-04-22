<template>
  <span
    class="rounded-full px-2.5 py-1.5 text-sm leading-none font-medium flex gap-2 items-center ring-1 ring-white"
    v-if="status"
    :class="{
      'bg-orange-100 text-orange-700':
        !props.status.includes('await') &&
        !['rejected', 'caseWithdrawn', 'caseLost', 'completed'].includes(
          props.status
        ),
      'bg-blue-100 text-blue-700': props.status.includes('await'),
      'bg-green-100 text-green-700': [
        'completed',
      ].includes(props.status),

      'bg-red-100 text-red-700':
        ['rejected', 'caseWithdrawn', 'caseLost'].includes(
          props.status
        ),
    }"
    ><FontAwesomeIcon :icon="icon" /><span>{{
      $t(`status.${status}`)
    }}</span></span
  >
</template>

<script setup lang="ts">
import type { CaseStatus } from "@/types";

const props = defineProps<{ status: CaseStatus }>();
const icon = computed(() => {
  if (props.status.includes("await")) return "clock";
  if (
    ["completed"].includes(
      props.status
    )
  )
    return "circle-check";
  if (
    ["rejected", "caseWithdrawn", "caseLost"].includes(
      props.status
    )
  )
    return "circle-xmark";
  return "bolt";
});
</script>
