<template>
  <div class="flex flex-col gap-5">
    <DisruptionNotice v-if="status" :status="status" :modelValue="modelValue" />
    <!-- first {{ firstSectionComplete }}<button @click="reset()">essers</button> -->
    <div class="relative z-10">
      <AccordionItem
        index="disruptionType"
        :modelValue="active"
        @update:modelValue="active = $event"
        headless
        :tag="{ outer: 'div', inner: 'div', title: 'h3' }"
        :collapsible="false"
      >
        <template #title>
          <SectionHeader
            label="Was ist schiefgelaufen?"
            :showValue="!!modelValue.disruption.type"
            >{{
              disruptions.find((e) => e.value === modelValue.disruption.type)
                ?.label
            }}</SectionHeader
          >
        </template>
        <template #content>
          <SelectDisruptionType :modelValue="modelValue" />
          <SelectDisruptionDetails :modelValue="modelValue" />
          <SelectDisruptionReplacement :modelValue="modelValue" />
          <SelectMissedConnection :modelValue="modelValue" />
        </template>
      </AccordionItem>
      <AccordionItem
        index="disruptionCause"
        :modelValue="active"
        @update:modelValue="active = $event"
        headless
        :tag="{ outer: 'div', inner: 'div', title: 'h3' }"
        :collapsible="false"
        v-if="
          modelValue.disruption.type &&
          !['>14'].includes(modelValue.disruption.details || '')
        "
      >
        <template #title>
          <SectionHeader
            label="Was war die Ursache?"
            :showValue="!!modelValue.disruption.reason"
            >{{
              [...noBoardingReasons, ...cancelledDelayedReasons].find(
                (e) => e.value === modelValue.disruption.reason
              )?.label
            }}</SectionHeader
          >
        </template>
        <template #content>
          <div class="flex flex-col gap-5">
            <!--  // mindestens 14 Tage // Ersatzbeförderung -->
            <SelectDisruptionReason
              v-if="
                modelValue.disruption.type &&
                ['cancelled', 'delayed', 'noBoarding'].includes(
                  modelValue.disruption.type
                )
              "
              modelValue="modelValue"
            />
          </div>
        </template>
      </AccordionItem>

      <!-- || ['>14'].includes(modelValue.disruption.details || '') -->
      <FormKit
        v-if="
          modelValue.disruption.type === 'other' ||
          modelValue.disruption.reason === 'other'
        "
        type="textarea"
        label="Deine Erläuterung hilft uns deinen Fall zu bearbeiten"
        name="reason"
        v-model="modelValue.disruption.other"
        select-icon="angle-down"
        inner-class="max-w-full"
      />
      <!-- <div
      v-if="modelValue.disruption.type"
      class="text-xs cursor-pointer hover:underline mr-auto"
      @click="reset"
    >
      reset reason
    </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import FlightList from "./FlightList.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import SectionHeader from "@/components/organisms/Calculator/SectionHeader.vue";
import SectionSubHeader from "@/components/organisms/Calculator/SectionSubHeader.vue";
import DisruptionNotice from "@/components/organisms/Calculator/DisruptionNotice.vue";
import DropdownButton from "@/components/molecules/DropdownButton.vue";
import type { ClaimsForm, Flight } from "@/types";
import AccordionItem from "../Accordion/AccordionItem.vue";
import SelectDisruptionType from "./Forms/SelectDisruptionType.vue";
import SelectDisruptionDetails from "./Forms/SelectDisruptionDetails.vue";
import SelectDisruptionReason from "./Forms/SelectDisruptionReason.vue";
import SelectDisruptionReplacement from "./Forms/SelectDisruptionReplacement.vue";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const active = ref<string[]>(["disruptionType"]);
const {
  delayedDetails,
  cancelledDetails,
  disruptions,
  noBoardingReasons,
  cancelledDelayedReasons,
} = useDisruption();

const processClaim = useProcessClaim();
const hasSwitched = ref(false);
watch(
  () => processClaim.value,
  () => {
    if (processClaim.value.sectionComplete === 1 && !hasSwitched.value) {
      active.value = ["disruptionCause"];
      hasSwitched.value = true;
    }
  },
  { deep: true }
);

const completed = computed(() => {
  if (!props.modelValue.disruption.type) return;
  if (props.modelValue.disruption.type === "other") return true;
  if (
    props.modelValue.disruption.type === "noBoarding" &&
    props.modelValue.disruption.reason
  )
    return true;
  if (props.modelValue.disruption.details && props.modelValue.disruption.reason)
    return true;
});

const arrivalCity = ref();
const { locale } = useI18n();
const firstSectionComplete = computed(() => {
  const { type, details, replacement, replacementFlight } =
    props.modelValue.disruption;
  if (!type) return false;
  if (
    !details ||
    (details === "<3" && (replacement === null || replacement === undefined))
  )
    return false;
  console.log("is detail", replacement);
  if (replacement && !replacementFlight) return false;
  return true;
});
const secondSectionComplete = () => {
  const { reason } = props.modelValue.disruption;
  if (!reason) return false;
  return true;
};
watch(
  () => props.modelValue.disruption,
  () => {
    const { type, details, replacement, replacementFlight, reason } =
      props.modelValue.disruption;
    if (firstSectionComplete) {
      // active.value = ["disruptionCause"]
    }
  },
  { immediate: true, deep: true }
);
const { getCities } = useGetCities()
watch(
  () => props.modelValue.flight,
  () => {
    if (props.modelValue.flight)
      getCities([props.modelValue.flight.arrival.iata], { locale: locale.value }).then(
        ([arrival]) => {
          arrivalCity.value = arrival;
        }
      );
  },
  { immediate: true, deep: true }
);

const status = ref(useFlightStatus(props.modelValue.flight));

watch(
  status,
  () => {
    const { cancelled, delayed } = status.value || {};
    if (cancelled.value) {
      props.modelValue.disruption.type = "cancelled";
    } else if (delayed.value > 0) {
      props.modelValue.disruption.type = "delayed";
      if (delayed.value < 180) {
        props.modelValue.disruption.details = delayedDetails[0].value;
      } else if (delayed.value >= 240) {
        props.modelValue.disruption.details = delayedDetails[2].value;
      } else {
        props.modelValue.disruption.details = delayedDetails[1].value;
      }
    } else {
      props.modelValue.disruption.type = null;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.modelValue.disruption.type,
  (current, old) => {
    props.modelValue.disruption.details = null;
    const similar = ["delayed", "cancelled"];
    if (!similar.includes(current || "") || !similar.includes(old || "")) {
      props.modelValue.disruption.reason = null;
    }
  }
);

</script>
