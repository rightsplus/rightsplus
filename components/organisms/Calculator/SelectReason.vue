<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-3xl font-bold">Welches Problem ist aufgetreten?</h1>
    <DisruptionNotice v-if="status" :status="status" :modelValue="modelValue" />
    <!-- <pre class="text-xs">{{ modelValue.disruption }}</pre> -->
    <DropdownButton
      :label="`Was ist schiefgelaufen?`"
      name="disruptionType"
      v-model="modelValue.disruption.type"
      :options="disruptions"
      prefix-icon="exclamation-triangle"
    />

    <div
      class="flex flex-col gap-5"
      v-if="
        modelValue.disruption.type === 'cancelled' ||
        modelValue.disruption.type === 'delayed'
      "
    >
      <span class="text-sm"
      v-if="modelValue.disruption.type === 'cancelled'"
        >Wieviel Zeit vor dem Abflug wurdest du über die Streichung / Umbuchung
        informiert?</span
      >
      <div class="grid sm:grid-cols-3 gap-3">
        <ButtonLarge
          v-for="c in (modelValue.disruption.type === 'cancelled' ? cancelledDetails : delayedDetails)"
          :key="c.value"
          @click.prevent="modelValue.disruption.details = c.value"
          :selected="modelValue.disruption.details === c.value"
          :name="c.value"
          :label="c.label"
          :preLabel="c.preLabel"
        />
      </div>
    </div>
    <DropdownButton
      v-if="
        modelValue.disruption.type === 'cancelled' ||
        modelValue.disruption.type === 'delayed'
      "
      label="Welchen Grund hat die Airline angegeben?"
      name="actualArrivalTime"
      v-model="modelValue.disruption.reason"
      :options="cancelledDelayedReasons"
      prefix-icon="clock"
    />
    <!--  // mindestens 14 Tage // Ersatzbeförderung -->
    <DropdownButton
      v-if="modelValue.disruption.type === 'noBoarding'"
      label="Welchen Grund hat die Airline angegeben?"
      name="actualArrivalTime"
      v-model="modelValue.disruption.reason"
      :options="noBoardingReasons"
      prefix-icon="clock"
    />
    <FormKit
      v-if="modelValue.disruption.type === 'other' || modelValue.disruption.reason === 'other' "
      type="textarea"
      label="Welchen Grund hat die Airline angegeben?"
      name="reason"
      v-model="modelValue.disruption.other"
      select-icon="angle-down"
      inner-class="max-w-full"
    />
    <div
      v-if="modelValue.disruption.type"
      class="text-xs cursor-pointer hover:underline mr-auto"
      @click="reset"
    >
      reset reason
    </div>
    <NavigationButtons
      @previous="$emit('back')"
      @next="$emit('submit')"
      :nextDisabled="!modelValue.disruption.type"
    />
  </div>
</template>

<script setup lang="ts">
import NavigationButtons from "./NavigationButtons.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import DisruptionNotice from "@/components/organisms/Calculator/DisruptionNotice.vue";
import DropdownButton from "@/components/molecules/DropdownButton.vue";
import { ClaimsForm } from "~~/types";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const emit = defineEmits(["submit", "back"]);

const status = ref(null as null | ReturnType<typeof useFlightStatus>);
const arrivalAirport = computed(
  () => useAirports()[props.modelValue.flight?.arrival.iata_code || ""]
);
const submitHandler = () => emit("submit");
const reset = () => {
  props.modelValue.disruption = {
    type: null,
    details: null,
    reason: null,
    other: null,
  };
};

onMounted(() => {
  status.value = useFlightStatus(props.modelValue.flight);
  if (status.value?.cancelled.value) {
    props.modelValue.disruption.type = "cancelled";
  } else if (status.value?.delayed.value > 0) {
    props.modelValue.disruption.type = "delayed";
    if (status.value?.delayed.value < 180) {
      props.modelValue.disruption.details = delayedDetails[0].value;
    } else if (status.value?.delayed.value >= 240) {
      props.modelValue.disruption.details = delayedDetails[2].value;
    } else {
      props.modelValue.disruption.details = delayedDetails[1].value;
    }
  }
});

watch(() => props.modelValue.disruption.type, (current, old) => {
  props.modelValue.disruption.details = null
  const similar = ['delayed', 'cancelled']
  if (!similar.includes(current || '') || !similar.includes(old || '')) props.modelValue.disruption.reason = null
})
const disruptions = [
  {
    value: "delayed",
    label: "Verspätet",
    sublabel: `Dein Flug hat ${
      arrivalAirport.value?.city || "sein Ziel"
    } später als geplant erreicht`,
    icon: "clock",
  },
  {
    value: "cancelled",
    label: "Annulliert / Umgebucht",
    sublabel:
      "Dein Flug wurde annulliert oder deine Abflugzeiten haben sich geändert",
    icon: "arrow-right-arrow-left",
  },
  {
    value: "noBoarding",
    label: "Boarding untersagt / verpasst",
    sublabel: "Du warst pünktlich am Gate, aber sie haben dich abgewiesen",
    icon: "ban",
  },
  { value: "other", label: "Sonstige", icon: "question" },
];
const delayedDetails = [
  { value: "<=3", preLabel: "Weniger als", label: "3 Stunden" },
  { value: "3-4", label: "3 – 4 Stunden" }, // bei +3500 km: Vergütung 50%
  { value: ">4", preLabel: "Mehr als", label: "4 Stunden" },
];
const cancelledDetails = [
  { value: "<72", preLabel: "Weniger als", label: "72 Stunden" },
  { value: "72-14", label: "3 – 14 Tage" },
  { value: ">14", preLabel: "Mehr als", label: "14 Tage" },
];
const noBoardingReasons = [
  {
    value: "missingOrInvalidTravelDocuments",
    label: "Missing or Invalid Travel Documents",
    icon: "passport",
  },
  {
    value: "lateArrival",
    label: "Late Arrival",
    icon: "clock",
  },
  {
    value: "overbooking",
    label: "Overbooking",
    icon: "users",
  },
  {
    value: "healthIssues",
    label: "Health Issues",
    icon: "heartbeat",
  },
  {
    value: "intoxication",
    label: "Intoxication",
    icon: "beer",
  },
  {
    value: "securityConcerns",
    label: "Security Concerns",
    icon: "shield-alt",
  },
  {
    value: "behaviouralIssues",
    label: "Behavioural Issues",
    icon: "smoking",
  },
  {
    value: "technicalIssues",
    label: "Technical Issues",
    icon: "wrench",
  },
  {
    value: "restrictedItems",
    label: "Restricted Items",
    icon: "gun",
  },
  {
    value: "restrictedDestinations",
    label: "Restricted Destinations",
    icon: "map-marker-alt",
  },
  {
    value: "other",
    label: "Sonstige",
    icon: "question",
  },
];
const cancelledDelayedReasons = [
  {
    value: "dontRemember",
    label: "Ich kann mich nicht erinnern",
    icon: "question",
  },
  { value: "technicalIssues", label: "Technische Probleme", icon: "cogs" },
  { value: "weatherConditions", label: "Wetterbedingungen", icon: "cloud-sun" },
  {
    value: "lateArrivalOfAircraft",
    label: "Verspätete Ankunft des Flugzeugs",
    icon: "plane-arrival",
  },
  { value: "crewIssues", label: "Crew-Probleme", icon: "users" },
  { value: "airportCongestion", label: "Flughafenüberlastung", icon: "road" },
  { value: "securityIssues", label: "Sicherheitsprobleme", icon: "shield-alt" },
  {
    value: "airTrafficControl",
    label: "Flugverkehrskontrolle",
    icon: "plane-departure",
  },
  {
    value: "unexpectedIssues",
    label: "Unerwartete Probleme",
    icon: "exclamation-triangle",
  },
  {
    value: "other",
    label: "Sonstige",
    icon: "question",
  },
];

</script>
