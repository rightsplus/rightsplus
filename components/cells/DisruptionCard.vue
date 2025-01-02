<script setup lang="ts">
import type { Flight, ClaimsForm } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlaneSlash,
  faClock,
  faExclamationTriangle,
  faExchangeAlt,
  faPlaneDeparture,
  faPlaneArrival,
} from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "vue-i18n";

export type DisruptionCardProps = {
  disruption: ClaimsForm["disruption"];
};
const props = defineProps<DisruptionCardProps>();
const { t } = useI18n();
const {
  delayedDetails,
  cancelledDetails,
  disruptions,
  noBoardingReasons,
  cancelledDelayedReasons,
} = useDisruption();
const type = computed(
  () =>
    (props.disruption.type &&
      disruptions.find((e) => e.value === props.disruption.type)) ||
    ({} as (typeof disruptions)[0])
);
const detail = computed(() => {
  const d =
    props.disruption.type === "delayed"
      ? delayedDetails
      : (props.disruption.type === "cancelled" && cancelledDetails) || [];
  return (
    d.find((e) => e.value === props.disruption.details) || ({} as (typeof d)[0])
  );
});
const reason = computed(() => {
  const r =
    props.disruption.type === "noBoarding"
      ? noBoardingReasons
      : cancelledDelayedReasons;
  return (
    r.find((e) => e.value === props.disruption.reason) || ({} as (typeof r)[0])
  );
});
</script>
<template>
  <div
    v-if="props.disruption"
    class="rounded-lg py-3 px-3 @container border border-transparent flex flex-col gap-3 bg-neutral-100 text-gray-800"
  >
    <div v-if="disruption.details" class="flex gap-2">
      <FontAwesomeIcon
        :icon="type.icon"
        class="mt-1 text-gray-400 shrink-0"
        fixed-width
      />
      <div class="flex flex-col">
        <span class="font-bold">{{ type.label }}</span>
        <span class="text-sm">{{ detail.sublabel }}</span>
      </div>
    </div>
    <div class="flex gap-2">
      <FontAwesomeIcon
        :icon="reason.icon"
        class="mt-1 text-gray-400 shrink-0"
        fixed-width
      />
      <div class="flex flex-col">
        <span class="font-bold">{{ t("reason") }}</span>
        <span class="text-sm">{{ reason.label }}</span>
      </div>
    </div>
    <div class="flex gap-2">
      <FontAwesomeIcon
        :icon="'message'"
        class="mt-1 text-gray-400 shrink-0"
        fixed-width
      />
      <div class="flex flex-col">
        <span class="">{{ props.disruption.comment }}</span>
      </div>
    </div>
  </div>
</template>
