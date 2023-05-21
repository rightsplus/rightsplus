<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-3xl font-bold">Welches Problem ist aufgetreten?</h1>
    <div
      class="flex items-center gap-3 p-3 border border-blue-200 bg-blue-100 text-blue-600 rounded-lg text-sm"
    >
      <ClientOnly><FontAwesomeIcon icon="info-circle" /></ClientOnly>
      <span v-if="useFlightStatus($state.claims.flight).cancelled.value"
        >Laut unseren Informationen wurde dein Flug
        <span class="font-bold">gecancelled</span>.</span
      >
      <span v-else-if="useFlightStatus($state.claims.flight).delayed.value > 0"
        >Laut unseren Informationen ist dein Flug mit
        <span
          class="font-bold"
          v-html="getDuration(getDelay($state.claims.flight?.arrival))"
        />
        Verspätung in
        {{
          useAirports().value[$state.claims.flight?.arrival.iata_code || ""]
            ?.city
        }}
        gelandet.</span
      >
      <span v-else
        >Laut unseren Informationen ist dein Flug
        <span class="font-bold">ohne Verspätung</span> in
        {{
          useAirports().value[$state.claims.flight?.arrival.iata_code || ""]
            ?.city
        }}
        gelandet.</span
      >
    </div>
    <div class="flex flex-wrap lg:flex-row gap-4">
      <!-- <FormKit
        type="select"
        v-model="modelValue.reason"
        :options="disruptions"
        select-icon="angle-down"
        label="Gib den tatächlichen Flugstatus an"
      /> -->
      <DropdownButton
        label="Flugstatus wählen"
        name="reason"
        v-model="modelValue.reason"
        :options="disruptions"
        prefix-icon="exclamation-triangle"
      />
      <!-- <FormKit
        v-if="modelValue.reason === 'delayed'"
        type="datetime-local"
        v-model="modelValue.actualArrivalTime"
        label="Tatsächliche Ankunftszeit"
        help="Relevant ist hier, wann die Türen offiziell geöffnet wurden."
        validation="required"
        validation-visibility="live"
      /> -->
      <!--  // mindestens 14 Tage // Ersatzbeförderung -->
      <DropdownButton
        v-if="modelValue.reason === 'noBoarding'"
        label="Welchen Grund hat die  Airline angegeben?"
        name="actualArrivalTime"
        v-model="modelValue.reasonDetails.noBoarding"
        :options="noBoarding"
        prefix-icon="clock"
      />
    </div>

    <div class="flex flex-col gap-5" v-if="modelValue.reason === 'delayed'">
      <div class="grid sm:grid-cols-3 gap-3">
        <ButtonLarge
          v-for="c in delayed"
          :key="c.value"
          @click.prevent="$state.claims.reasonDetails = { delayed: c.value }"
          :selected="$state.claims.reasonDetails?.delayed === c.value"
          :name="c.value"
          :label="c.label"
        />
      </div>
    </div>
    <div class="flex flex-col gap-5" v-if="modelValue.reason === 'cancelled'">
      <div class="grid sm:grid-cols-3 gap-3">
        <ButtonLarge
          v-for="c in cancelled"
          :key="c.value"
          @click.prevent="$state.claims.reasonDetails = { cancelled: c.value }"
          :selected="$state.claims.reasonDetails?.cancelled === c.value"
          :name="c.value"
          :label="c.label"
        />
      </div>
    </div>
    <FormKit
      type="textarea"
      label="Gib den tatächlichen Flugstatus an"
      placeholder="Flugstatus wählen"
      name="reason"
      v-model="modelValue.reason"
      :options="reasons"
      select-icon="angle-down"
    />
    <NavigationButtons @previous="$emit('back')" @next="$emit('submit')" />
  </div>
</template>

<script setup lang="ts">
import NavigationButtons from "./NavigationButtons.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import Dropdown from "@/components/molecules/Dropdown.vue";
import DropdownButton from "@/components/molecules/DropdownButton.vue";
import Button from "@/components/molecules/Button.vue";
import { ClaimsForm } from "~~/types";

defineProps<{
  modelValue: ClaimsForm;
}>();
const emit = defineEmits(["submit", "back"]);
const value = ref(null);
const showNoBordingDropdown = ref(false);
const submitHandler = () => emit("submit");

const disruptions = [
  { value: "delayed", label: "Verspätet", icon: "clock" },
  { value: "cancelled", label: "Gestrichen / Umgebucht", icon: "times" },
  { value: "noBoarding", label: "Boarding untersagt / verpasst", icon: "ban" },
  { value: "other", label: "Sonstige", icon: "question" },
];
const delayed = [
  { value: "<=3", label: "Weniger als 3h" },
  { value: "3-4", label: "3 - 4h" }, // bei +3500 km: Vergütung 50%
  { value: ">4", label: "Mehr als 4h" },
];
const cancelled = [
  { value: "<72", label: "Weniger als 72h" },
  { value: "72-14", label: "72h - 14 Tage" },
  { value: ">14", label: "Mehr als 14 Tage" },
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
  { value: "dontRemember", label: "Ich kann mich nicht erinnern" },
  { value: "technicalIssues", label: "Technische Probleme" },
  { value: "weatherConditions", label: "Wetterbedingungen" },
  {
    value: "lateArrivalOfAircraft",
    label: "Verspätete Ankunft des Flugzeugs",
  },
  { value: "crewIssues", label: "Crew-Probleme" },
  { value: "airportCongestion", label: "Flughafenüberlastung" },
  { value: "securityIssues", label: "Sicherheitsprobleme" },
  { value: "airTrafficControl", label: "Flugverkehrskontrolle" },
  { value: "unexpectedIssues", label: "Unerwartete Probleme" },
];
</script>
