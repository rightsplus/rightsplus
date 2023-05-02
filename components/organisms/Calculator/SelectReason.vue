<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-3xl font-bold">Welches Problem ist aufgetreten?</h1>
    <div
      class="flex flex-col sm:flex-row sm:gap-4 [&>.formkit-outer]:w-full [&_.formkit-inner]:max-w-full"
    >
      <FormKit
        type="select"
        label="Gib den tatächlichen Flugstatus an"
        placeholder="Flugstatus wählen"
        name="reason"
        v-model="modelValue.reason"
        :options="disruptions"
        select-icon="angle-down"
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

      <div
        class="relative w-full mt-4"
        v-if="modelValue.reason === 'noBoarding'"
      >
        <button
          @click.prevent="showNoBordingDropdown = !showNoBordingDropdown"
          :name="'c.value'"
          class="w-full bg-neutral-100 hover:bg-neutral-200 border-neutral-200 border text-base p-3 rounded-lg"
          :class="{
            'rounded-b-none': showNoBordingDropdown,
          }"
        >
          {{
            noBoarding.find(
              (e) => e.value === $state.claims.reasonDetails?.noBoarding
            )?.label || "Bitte wählen"
          }}
        </button>
        <div class="top-0 left-0" v-if="showNoBordingDropdown">
          <Dropdown
            :active="
              noBoarding.findIndex(
                (e) => e.value === $state.claims.reasonDetails?.noBoarding
              )
            "
            :options="noBoarding"
            @input="
              (e) => {
                ($state.claims.reasonDetails = { noBoarding: e.value }),
                  (showNoBordingDropdown = false);
              }
            "
          />
        </div>
      </div>
    </div>

    <div
      class="grid sm:grid-cols-3 gap-3"
      v-if="modelValue.reason === 'delayed'"
    >
      <ButtonLarge
        v-for="c in delayed"
        :key="c.value"
        @click.prevent="$state.claims.reasonDetails = { delayed: c.value }"
        :selected="$state.claims.reasonDetails?.delayed === c.value"
        :name="c.value"
        :label="c.label"
      />
    </div>
    <div
      class="grid sm:grid-cols-3 gap-3"
      v-if="modelValue.reason === 'cancelled'"
    >
      <ButtonLarge
        v-for="c in cancelled"
        :key="c.value"
        @click.prevent="$state.claims.reasonDetails = { cancelled: c.value }"
        :selected="$state.claims.reasonDetails?.cancelled === c.value"
        :name="c.value"
        :label="c.label"
      />
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
    <FormKit
      type="select"
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

<script lang="ts">
import { defineComponent } from "vue";
import NavigationButtons from "./NavigationButtons.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import Dropdown from "@/components/molecules/Dropdown.vue";
import Button from "@/components/molecules/Button.vue";
export default defineComponent({
  components: {
    NavigationButtons,
    ButtonLarge,
    Dropdown,
    Button,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: null,
      showNoBordingDropdown: false,
      disruptions: [
        { value: "delayed", label: "Verspätet" },
        { value: "cancelled", label: "Gestrichen / Umgebucht" },
        { value: "noBoarding", label: "Boarding untersagt / verpasst" },
        { value: "other", label: "Sonstige" },
      ],
      delayed: [
        { value: "<=3", label: "Weniger als 3h" },
        { value: "3-4", label: "3 - 4h" }, // bei +3500 km: Vergütung 50%
        { value: ">4", label: "Mehr als 4h" },
      ],
      cancelled: [
        { value: "<7", label: "0 - 7 Tage" },
        { value: "7-14", label: "8 - 14 Tage" },
        { value: ">14", label: "Mehr als 14 Tage" },
      ],
      noBoarding: [
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
      ],
      reasons: [
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
      ],
    };
  },
  methods: {
    submitHandler() {
      this.$emit("submit");
      return;
    },
  },
});
</script>
<style scoped>
.double {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.triple {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
