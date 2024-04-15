<template>
  <span
    class="rounded-full px-2.5 py-1.5 textsm leading-none font-medium"
    v-if="status"
    :class="{
      'bg-red-100 text-red-700': actionRequired,
      'bg-blue-100 text-blue-700': !actionRequired,
    }"
    >{{ $t(`status.${status}`) }}</span
  >
</template>

<script setup lang="ts">
import type { CaseStatus } from "@/types"

const props = defineProps<{ status: CaseStatus }>()
const actionRequired = computed(() => {
	switch (props.status) {
		case "compensationClaimChecked":
		case "lawFirmEngaged":
		case "paymentProcessed":
			return false
		case "dataReceived":
		case "compensationClaimSecured":
		case "legalDisputeLost":
		default:
			return true
	}
})
</script>
