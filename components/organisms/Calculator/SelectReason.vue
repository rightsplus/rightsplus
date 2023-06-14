<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-3xl font-bold">Welches Problem ist aufgetreten?</h1>
    <DisruptionAssumption :status="status" :modelValue="modelValue" />
    {{modelValue.disruption}}
    <div class="flex flex-col gap-5">
      <DropdownButton
        :label="`Was ist schiefgelaufen?`"
        name="disruptionType"
        v-model="modelValue.disruption.type"
        :options="disruptions"
        prefix-icon="exclamation-triangle"
      />
      <div v-if="modelValue.disruption.type === 'delayed'" class="grid sm:grid-cols-3 gap-3">
        <ButtonLarge
          v-for="c in delayedDetails"
          :key="c.value"
          @click.prevent="modelValue.disruption.details = c.value"
          :selected="modelValue.disruption.details === c.value"
          :name="c.value"
          :label="c.label"
          :preLabel="c.preLabel"
        />
      </div>
    </div>

      <!--  // mindestens 14 Tage // Ersatzbeförderung -->
      <DropdownButton
        v-if="modelValue.disruption.type === 'noBoarding'"
        label="Welchen Grund hat die Airline angegeben?"
        name="actualArrivalTime"
        v-model="modelValue.disruption.reason"
        :options="noBoarding"
        prefix-icon="clock"
      />
    <div class="flex flex-col gap-5" v-if="modelValue.disruption === 'cancelled'">
      <span class="text-sm"
        >Wieviel Zeit vor dem Abflug wurdest du über die Streichung / Umbuchung
        informiert?</span
      >
      <div class="grid sm:grid-cols-3 gap-3">
        <ButtonLarge
          v-for="c in cancelled"
          :key="c.value"
          @click.prevent="modelValue.reason = c.value"
          :selected="modelValue.reason === c.value"
          :name="c.value"
          :label="c.label"
          :preLabel="c.preLabel"
        />
      </div>
    </div>
    <DropdownButton
      v-if="modelValue.disruption === 'cancelled'"
      label="Welchen Grund hat die Airline angegeben?"
      name="actualArrivalTime"
      v-model="modelValue.reasonDetails.cancelled"
      :options="reasons"
      prefix-icon="clock"
    />
    <DropdownButton
      v-if="modelValue.disruption === 'delayed'"
      label="Welchen Grund hat die Airline angegeben?"
      name="actualArrivalTime"
      v-model="modelValue.reasonDetails.delayed"
      :options="reasons"
      prefix-icon="clock"
    />
    <FormKit
      v-if="modelValue.disruption === 'other'"
      type="textarea"
      label="Welchen Grund hat die Airline angegeben?"
      name="reason"
      v-model="modelValue.reasonDetails.other"
      select-icon="angle-down"
    />
    <div
      v-if="modelValue.reason"
      class="text-xs cursor-pointer hover:underline"
      @click="{modelValue.reason = null; modelValue.disruption = null}"
    >
      reset reason
    </div>
    <NavigationButtons
      @previous="$emit('back')"
      @next="$emit('submit')"
      :nextDisabled="!modelValue.reason"
    />
  </div>
</template>

<script setup lang="ts">
import NavigationButtons from "./NavigationButtons.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import DisruptionAssumption from "@/components/organisms/Calculator/DisruptionAssumption.vue";
import Dropdown from "@/components/molecules/Dropdown.vue";
import DropdownButton from "@/components/molecules/DropdownButton.vue";
import Button from "@/components/molecules/Button.vue";
import { ClaimsForm } from "~~/types";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const emit = defineEmits(["submit", "back"]);
const value = ref(null);
const status = ref(null as null | ReturnType<typeof useFlightStatus>);
const showNoBordingDropdown = ref(false);

onMounted(() => {
  status.value = useFlightStatus(props.modelValue.flight);
  if (status.value?.cancelled.value) {
    props.modelValue.disruption = "cancelled";
  } else if (status.value?.delayed.value > 0) {
    props.modelValue.disruption = "delayed";
    if (status.value?.delayed.value < 180) {
      props.modelValue.reason = delayed[0].value;
    } else if (status.value?.delayed.value >= 240) {
      props.modelValue.reason = delayed[2].value;
    } else {
      props.modelValue.reason = delayed[1].value;
    }
  }
})

const submitHandler = () => emit("submit");
const departureAirport = computed(() =>
  useAirports()[props.modelValue.flight?.departure.iata_code || ""]
);
const arrivalAirport = computed(() =>
  useAirports()[props.modelValue.flight?.arrival.iata_code || ""]
);
const disruptions = [
  {
    value: "delayed",
    label: "Verspätet",
    sublabel: `Dein Flug hat ${arrivalAirport.value?.city || 'sein Ziel'} später als geplant erreicht`,
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
const noBoarding = [
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
];
const reasons = [
  { value: "dontRemember", label: "Ich kann mich nicht erinnern", icon: "question" },
  { value: "technicalIssues", label: "Technische Probleme", icon: "cogs" },
  { value: "weatherConditions", label: "Wetterbedingungen", icon: "cloud-sun" },
  { value: "lateArrivalOfAircraft", label: "Verspätete Ankunft des Flugzeugs", icon: "plane-arrival" },
  { value: "crewIssues", label: "Crew-Probleme", icon: "users" },
  { value: "airportCongestion", label: "Flughafenüberlastung", icon: "road" },
  { value: "securityIssues", label: "Sicherheitsprobleme", icon: "shield-alt" },
  { value: "airTrafficControl", label: "Flugverkehrskontrolle", icon: "plane-departure" },
  { value: "unexpectedIssues", label: "Unerwartete Probleme", icon: "exclamation-triangle" },
];

</script>
