<template>
  <component :is="hasChangeListener ? Dropdown : 'div'">
    <span
      class="rounded-full px-2.5 py-1.5 text-sm leading-none font-medium flex gap-2 items-center ring-1 ring-white"
      v-bind="$attrs"
      v-if="status"
      :title="$t(`status.${status}`)"
      :class="[
        statusProps(status).class,
        hasChangeListener && statusProps(status).hoverClass,
        hasChangeListener && 'cursor-pointer',
      ]"
      ><FontAwesomeIcon :icon="statusProps(status).icon" class="shrink-0"/><span
        class="truncate -my-2 py-2"
        >{{ $t(`status.${status}`) }}</span
      ><FontAwesomeIcon
        v-if="hasChangeListener"
        icon="angle-down"
        class="ml-2 shrink-0"
    /></span>
    <template #popper
      ><ul class="p-1 flex flex-col gap-1 text-xs">
        <li
          v-for="item in statusOptions"
          :key="item"
          class="rounded px-2 py-1 cursor-pointer flex items-center gap-2"
          :class="[
            {
              [statusProps(item).class]: item === status,
              [statusProps(item).hoverClass]: item === status,
              ['hover:bg-gray-100']: item !== status,
            },
          ]"
          @click="$emit('change', item)"
        >
          <FontAwesomeIcon :icon="statusProps(item).icon" /><span
            class="truncate -my-2 py-2"
            >{{ $t(`status.${item}`) }}</span
          >
        </li>
      </ul></template
    >
  </component>
</template>

<script setup lang="ts">
import { Dropdown } from "floating-vue";
import "floating-vue/dist/style.css";
import type { CaseStatus } from "@/types";

const props = defineProps<{ status: CaseStatus }>();
const instance = getCurrentInstance();
const hasChangeListener = ref(false);
onMounted(() => {
  if (instance?.vnode.props?.onChange) {
    hasChangeListener.value = true;
  }
});
const statusProps = (status: string) => {
  if (status.includes("await")) {
    return {
      icon: "clock",
      class: "bg-blue-100 text-blue-700",
      hoverClass: "hover:bg-blue-200",
    };
  }
  if (["completed"].includes(status)) {
    return {
      icon: "circle-check",
      class: "bg-green-100 text-green-700",
      hoverClass: "hover:bg-green-200",
    };
  }
  if (["rejected", "caseWithdrawn", "caseLost"].includes(status)) {
    return {
      icon: "circle-xmark",
      class: "bg-red-100 text-red-700",
      hoverClass: "hover:bg-red-200",
    };
  }
  return {
    icon: "bolt",
    class: "bg-orange-100 text-orange-700",
    hoverClass: "hover:bg-orange-200",
  };
};
const statusOptions = computed(() => {
  return [
    "dataReceived",
    "awaitInitialAirlineResponse",
    "airlineRejected",
    "awaitLawyerResponse",
    "airlineRejectedAfterLawyer",
    "awaitCourtDecision",
    "awaitAirlinePayment",
    "receivePayment",
    "rejected",
    "caseWithdrawn",
    "caseLost",
    "completed",
  ];
});
</script>
