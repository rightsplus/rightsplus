<script setup lang="ts">
import StepWrapper from "@/components/organisms/Calculator/StepWrapper.vue";
import ButtonGroup from "@/components/organisms/Calculator/ButtonGroup.vue";
import ButtonBack from "@/components/organisms/Calculator/ButtonBack.vue";
import SelectItinerary from "@/components/organisms/Calculator/Forms/SelectItinerary.vue";
import SelectLeg from "~/components/organisms/Calculator/Forms/SelectLeg.vue";
import SelectFlightDate from "@/components/organisms/Calculator/Forms/SelectFlightDate.vue";
import SelectDisruptionType from "@/components/organisms/Calculator/Forms/SelectDisruptionType.vue";
import SelectDisruptionDetails from "@/components/organisms/Calculator/Forms/SelectDisruptionDetails.vue";
import SelectDisruptionReason from "@/components/organisms/Calculator/Forms/SelectDisruptionReason.vue";
import FlightDetails from "@/components/organisms/Calculator/Forms/FlightDetails.vue";
import FlightList from "@/components/organisms/Calculator/FlightList.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import ClaimCard from "@/components/cells/ClaimCard.vue";
import AddDisruptionComment from "@/components/organisms/Calculator/Forms/AddDisruptionComment.vue";

import claimMachine from "~/machines/claimSubmission";
import type { ClaimsForm, ClaimState, Airport, Flight } from "~/types";
import AddBookingNumber from "./Forms/AddBookingNumber.vue";
import StepPassengers from "./StepPassengers.vue";
import AssignmentAgreementPreflight from "./AssignmentAgreementPreflight.vue";
import { useElementSize } from "@vueuse/core";
const claimState = useClaim();
const { t } = useI18n();
const form = ref<HTMLElement>();
const { state, send, transition, subscribe, invoke } = useMachine<
  ClaimState,
  ClaimsForm
>(claimMachine, { context: claimState });
const { getFilteredFlights } = useFlights();
subscribe((e) => {
  window.scrollTo({ top: Math.min(window.scrollY, 200) });
  setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }));
});
const { eligible, ineligible } = useCompensation();
const eligibleDisruption = computed(() => {
  const cancelled = claimState.flight?.status === "cancelled";
  const props = (primary?: boolean) => ({
    event: () => send(primary ? "continue" : "next"),
    label: primary
      ? cancelled
        ? t("Anspruch aufgrund von Annullierung")
        : t("Anspruch aufgrund von Verspätung")
      : t("Anspruch aus anderem Grund"),
  });
  return {
    statement: eligible.value
      ? t("Anspruch auf Entschädigung")
      : t("Kein Anspruch auf Entschädigung"),
    title: t(cancelled ? "cancellation" : "delay"),
    description: cancelled
      ? t("disruptionDetected.cancelled.description")
      : t("disruptionDetected.delayed.description", {
          delay: getDuration(claimState.flight?.arrival.delay || 0),
          arrival: city.value.arrival,
        }),
    primary: {
      event: props(!ineligible.value).event,
      label: props(!ineligible.value).label,
    },
    secondary: {
      event: props(!!ineligible.value).event,
      label: props(!!ineligible.value).label,
    },
  };
});

const eligibleCompensation = computed(() => {
  return {
    title: t(eligible.value ? "eligible.title" : "ineligible.title"),
    description: t(
      eligible.value ? "eligible.description" : "ineligible.description"
    ),
    primary: eligible.value
      ? {
          event: () => send("next"),
          label: t("next"),
        }
      : undefined,
    secondary: eligible.value
      ? undefined
      : {
          event: () => invoke("reset"),
          label: t("checkOtherFlight"),
        },
  };
});
const handleSelectConnection = (flight: Flight) => {
  claimState.connection.flight = flight;
  send("next");
};
const handleSelectReplacement = (flight: Flight) => {
  claimState.replacement.flight = flight;
  send("next");
};
// off('next', subscription)
const filteredFlights = computed(() => {
  if (!claimState.leg) return [];
  const { departure, arrival } = claimState.airport;

  const filtered = getFilteredFlights({
    departure: departure?.iata,
    arrival: arrival?.iata,
    date: claimState.date!,
  });

  return filtered;
});

const city = useCities(claimState.airport.trip);

const { prepareClaimSubmission } = usePrepareClaimSubmission();
const submit = async () => {
  console.log("submitting");
  try {
    console.log("claimState", claimState);
    const submission = await prepareClaimSubmission(claimState);
    console.log("submission", submission);
    // send("next");
  } catch (error) {
    console.error(error);
  }
};
const { width } = useElementSize(form);

const stackButtons = (w: number) => width.value < w;

const addLayover = () => {
  claimState.airport.trip.layover?.push({} as Airport);
};
const localePath = useLocalePath();
const handleClose = () => {
  invoke("reset");
  navigateTo(localePath("index"));
};
</script>
<template>
  <div class="w-full max-w-3xl mx-auto grid gap-5 mb-12">
    <form
      class="w-full max-w-3xl mx-auto min-h-full bg-white sm:rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-12 flex flex-col gap-2 justify-items-start"
      @submit.prevent
      ref="form"
    >
      <!-- {{claimState.disruption}} -->
      <ButtonBack
        :showClose="
          !!state.matches(state.initial) || !!state.matches('success')
        "
        @back="invoke('back')"
        @close="handleClose"
      />
      <Transition
        :name="transition === 'forward' ? 'step-next' : 'step-prev'"
        class="w-full"
        mode="out-in"
      >
        <StepWrapper v-if="state?.matches('itinerary')">
          <SelectItinerary :modelValue="claimState" />
          <ButtonGroup
            :stack="
              claimState.airport.trip.layover?.some(Boolean) &&
              stackButtons(640)
            "
            @secondary="addLayover"
            :secondary="{
              prefixIcon: 'plus',
              label: t('stopover'),
              disabled: claimState.airport.trip.layover?.some((e) => !e.iata),
            }"
            @primary="send('next')"
            :primary="{
              label: !claimState.airport.trip.layover?.some((e) => e.iata)
                ? t('continueWithoutStopover')
                : t('next'),
              disabled: !state.can('next'),
              tooltip: state.can('next')
                ? t(state.can('next') + '.title')
                : undefined,
              suffixIcon: 'angle-right',
            }"
          />
        </StepWrapper>

        <!-- <StepWrapper v-else-if="state?.matches('stopover')">
          <SelectLayover :modelValue="claimState" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: t('next'),
            }"
            @secondary="claimState.airport.trip.layover?.push({} as Airport)"
            :secondary="{
              prefixIcon: 'plus',
              label: t('stopover'),
              disabled: claimState.airport.trip.layover?.some((e) => !e.iata),
            }"
          />
        </StepWrapper> -->
        <StepWrapper v-else-if="state?.matches('chooseLeg')">
          <SelectLeg v-model="claimState" @select="send('next')" />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('flightDate')">
          <SelectFlightDate :modelValue="claimState" @select="send('next')" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: t('next'),
              disabled: !state.can('next'),
            }"
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('flight')">
          <FlightList
            :departure="claimState.airport.departure?.iata"
            :arrival="claimState.airport.arrival?.iata"
            :date="claimState.date"
            :modelValue="claimState.flight"
            @update:modelValue="claimState.flight = $event"
            @select="send('next')"
            :flight-card="{
              is: 'button',
            }"
            showFilter
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('disruptionDetected')"
          :title="eligibleDisruption.title"
          :description="eligibleDisruption.description"
        >
          <div v-if="claimState.flight">
            <ClaimCard :claim="claimState" />
          </div>
          <ButtonGroup
            :stack="stackButtons(640)"
            @primary="eligibleDisruption.primary.event"
            :primary="eligibleDisruption.primary"
            @secondary="eligibleDisruption.secondary.event"
            :secondary="eligibleDisruption.secondary"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('disruptionType')"
          :description="
            t(`disruptionType.description`, { arrival: city.arrival })
          "
        >
          <SelectDisruptionType
            :modelValue="claimState"
            @select="send('next')"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('disruptionReason')"
          :title="t(`disruptionReason.${claimState.disruption.type}.title`)"
          :description="
            t(`disruptionReason.${claimState.disruption.type}.description`, {
              arrival: city.arrival,
            })
          "
        >
          <div class="grid gap-3 mt-5">
            <Callout icon="triangle-exclamation" type="warning"
              >Es ist wichtig, dass die Angaben vollständig, ordnungsgemäß und
              wahrheitsgemäß sind</Callout
            >
            <div class="grid gap-3">
              <SelectDisruptionReason
                :modelValue="claimState"
                @select="send('next')"
              />
              <AddDisruptionComment v-model="claimState" />
            </div>
          </div>
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: t('next'),
              disabled: !state.can('next'),
            }"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('delayDetails')"
          :title="t('delay')"
          :description="
            t('delayDetails.description', { arrival: city.arrival })
          "
        >
          <SelectDisruptionDetails
            :modelValue="claimState"
            type="delayed"
            @select="send('next')"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('cancellationDetails')"
          :title="t('cancellation')"
        >
          <SelectDisruptionDetails
            :modelValue="claimState"
            type="cancelled"
            @select="send('next')"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('replacementFlightYN')"
          :title="t('replacementFlight.title')"
        >
          <div class="flex flex-col gap-3">
            <ButtonLarge @click="send('yes')" :label="t('yes')" proceed />
            <ButtonLarge @click="send('no')" :label="t('no')" proceed />
          </div>
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('connectionFlightYN')"
          :title="t('connectionFlight.title')"
        >
          <div class="flex flex-col gap-3">
            <ButtonLarge @click="send('yes')" :label="t('yes')" proceed />
            <ButtonLarge @click="send('no')" :label="t('no')" proceed />
          </div>
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('connectionFlightDetails')"
          :title="t('connectionFlight.title')"
        >
          <FlightDetails :modelValue="claimState.connection" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: t('next'),
              disabled:
                !claimState.connection.date || !claimState.connection.departure,
            }"
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('connectionFlight')">
          <FlightList
            :departure="claimState.connection.departure.iata"
            :arrival="claimState.connection.arrival.iata"
            :date="claimState.connection.date"
            :number="claimState.connection.number"
            :modelValue="claimState.connection.flight"
            @select="handleSelectConnection"
            :flight-card="{
              is: 'button',
            }"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('replacementFlightDetails')"
          :title="t('replacementFlight.title')"
        >
          <FlightDetails :modelValue="claimState.replacement" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: t('next'),
              disabled:
                !claimState.replacement.date ||
                !claimState.replacement.departure,
            }"
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('replacementFlight')">
          <FlightList
            :departure="claimState.replacement.departure.iata"
            :arrival="claimState.airport.arrival.iata"
            :date="claimState.replacement.date"
            :number="claimState.replacement.number"
            :modelValue="claimState.replacement.flight"
            @select="handleSelectReplacement"
            :flight-card="{
              is: 'button',
            }"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('eligibility')"
          :title="eligibleCompensation.title"
          :description="eligibleCompensation.description"
        >
          <ClaimCard :claim="claimState" />
          <ButtonGroup
            @primary="eligibleCompensation.primary?.event"
            :primary="
              eligibleCompensation.primary && {
                label: eligibleCompensation.primary.label,
              }
            "
            @secondary="eligibleCompensation.secondary?.event"
            :secondary="
              eligibleCompensation.secondary && {
                label: eligibleCompensation.secondary.label,
              }
            "
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('bookingNumber')">
          <AddBookingNumber :modelValue="claimState" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: t('next'),
              disabled: !claimState.client.bookingNumber,
            }"
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('passengers')">
          <StepPassengers :modelValue="claimState" ref="passengers" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: t('next'),
              disabled: !state.can('next'),
            }"
            @secondary="
              ($refs.passengers as typeof StepPassengers)?.addPassenger()
            "
            :secondary="{
              prefixIcon: 'plus',
              label: t('passenger'),
            }"
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('assignmentAgreement')">
          <AssignmentAgreementPreflight :modelValue="claimState" />
          <ButtonGroup
            @primary="submit"
            :primary="{
              label: t('next'),
              disabled: !state.can('next'),
            }"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('success')"
          title="Deine Anfrage wurde erfolgreich eingereicht!"
          description="Wir prüfen jetzt einen möglichen Entschädigungsanspruch aufgrund deiner Angaben und melden uns nach Abschluss der Prüfung bei dir."
        >
        </StepWrapper>
      </Transition>
    </form>
  </div>
</template>
