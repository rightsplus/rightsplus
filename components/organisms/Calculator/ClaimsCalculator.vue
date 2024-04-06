<template>
  <div class="w-full max-w-3xl mx-auto grid gap-5 mb-12">
    <div
      v-if="state.matches('loading')"
      class="w-full max-w-3xl mx-auto min-h-full bg-white sm:rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-12 grid gap-2 justify-items-start"
    >
      Loading
    </div>
    <form
      v-else
      class="w-full max-w-3xl mx-auto min-h-full bg-white sm:rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-12 flex flex-col gap-2 justify-items-start"
      @submit.prevent
      ref="form"
    >
      <button
        @click.prevent="
          () => {
            if (state.matches(state.initial)) {
            invoke('reset');
            navigateTo(localePath('/'));
            } else {
            invoke('back');

            }
          }
        "
        class="leading-none text-2xl self-start"
      >
        <FontAwesomeIcon v-show="state.matches(state.initial)" icon="times" />
        <FontAwesomeIcon
          v-show="!state.matches(state.initial)"
          icon="arrow-left"
        />
      </button>
      <!-- {{ state.value }} -->
      <Transition
        :name="transition === 'forward' ? 'step-next' : 'step-prev'"
        class="w-full"
        mode="out-in"
      >
        <StepWrapper v-if="state?.matches('itinerary')">
          <SelectItinerary :modelValue="claimState" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('next'),
              disabled: !state.can('next'),
            }"
          />
        </StepWrapper>

        <StepWrapper v-else-if="state?.matches('stopover')">
          <SelectLayover :modelValue="claimState" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('next'),
            }"
            @secondary="claimState.airport.trip.layover?.push({} as Airport)"
            :secondary="{
              prefixIcon: 'plus',
              label: $t('stopover'),
              disabled: claimState.airport.trip.layover?.some((e) => !e.iata),
            }"
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('chooseRoute')">
          <SelectRoute :modelValue="claimState" @select="send('next')" />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('flightDate')">
          <SelectFlightDate :modelValue="claimState" @select="send('next')" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('next'),
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
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('disruptionDetected')"
          :description="
            claimState.flight?.status === 'cancelled'
              ? $t('disruptionDetected.cancelled.description')
              : $t('disruptionDetected.delayed.description', {
                  delay: getDuration(claimState.flight?.arrival.delay || 0),
                  arrival: city.arrival,
                })
          "
        >
          <div v-if="claimState.flight">
            <ClaimCard :flight="claimState.flight" />
          </div>
          <ButtonGroup
            stack
            @primary="send('continue')"
            :primary="{
              label:
                claimState.flight?.status === 'cancelled'
                  ? $t('Anspruch aufgrund von Annullierung')
                  : $t('Anspruch aufgrund von Verspätung'),
            }"
            @secondary="send('next')"
            :secondary="{
              label: $t('Anspruch aus anderem Grund'),
            }"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('noDisruptionDetected')"
          :description="
            $t('noDisruptionDetected.description', { arrival: city.arrival })
          "
        >
          <div v-if="claimState.flight">
            <FlightCard :flight="claimState.flight" />
          </div>
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('Grund angeben'),
            }"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('disruptionType')"
          :description="
            $t(`disruptionType.description`, { arrival: city.arrival })
          "
        >
          <SelectDisruptionType
            :modelValue="claimState"
            @select="send('next')"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('disruptionReason')"
          :title="$t(`disruptionReason.${claimState.disruption.type}.title`)"
          :description="
            $t(`disruptionReason.${claimState.disruption.type}.description`, {
              arrival: city.arrival,
            })
          "
        >
          <SelectDisruptionReason
            :modelValue="claimState"
            @select="send('next')"
          />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('next'),
              disabled: !claimState.disruption.reason,
            }"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('delayDetails')"
          :title="$t('delay')"
        >
          <SelectDisruptionDetails
            :modelValue="claimState"
            type="delayed"
            @select="send('next')"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('cancellationDetails')"
          :title="$t('cancellation')"
        >
          <SelectDisruptionDetails
            :modelValue="claimState"
            type="cancelled"
            @select="send('next')"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('otherFlightYN')"
          :title="
            claimState.disruption.type === 'cancelled'
              ? $t('replacementFlight.title')
              : $t('connectionFlight.title')
          "
          :description="
            claimState.disruption.type === 'cancelled'
              ? $t('replacementFlightYN.description')
              : $t('connectionFlightYN.description')
          "
        >
          <div class="flex flex-col gap-3">
            <ButtonLarge @click="send('yes')" :label="$t('yes')" proceed />
            <ButtonLarge @click="send('no')" :label="$t('no')" proceed />
          </div>
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('connectionFlightDetails')">
          <FlightDetails :modelValue="claimState.connection" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('next'),
              disabled:
                !claimState.connection.date ||
                !claimState.connection.departure,
            }"
          />
        </StepWrapper>
        <StepWrapper
          v-else-if="state?.matches('replacementFlightDetails')"
          :title="$t('replacementFlight.title')"
        >
          <FlightDetails :modelValue="claimState.replacement" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('next'),
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
            :loading="loadingFlights"
            :modelValue="claimState.replacement.flight"
            @update:mflightcodelValue="claimState.replacement.flight = $event"
            @select="send('next')"
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('ineligable')">
          <div v-if="claimState.flight">
            <ClaimCard :flight="claimState.flight" />
          </div>
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('eligable')">
          <div v-if="claimState.flight">
            <ClaimCard :flight="claimState.flight" />
          </div>
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('next'),
            }"
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('bookingNumber')">
          <AddBookingNumber :modelValue="claimState" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('next'),
              disabled: !claimState.client.bookingNumber,
            }"
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('passengers')">
          <StepPassengers :modelValue="claimState" ref="passengers" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('next'),
              disabled: !state.can('next'),
            }"
            @secondary="
              ($refs.passengers as typeof StepPassengers)?.addPassenger()
            "
            :secondary="{
              prefixIcon: 'plus',
              label: $t('passenger'),
            }"
          />
        </StepWrapper>
        <StepWrapper v-else-if="state?.matches('assignmentAgreement')">
          <AssignmentAgreementPreflight :modelValue="claimState" />
          <ButtonGroup
            @primary="send('next')"
            :primary="{
              label: $t('next'),
              disabled: !claimState.client.bookingNumber,
            }"
          />
        </StepWrapper>
      </Transition>
    </form>
  </div>
</template>

<script setup lang="ts">
import StepWrapper from "@/components/organisms/Calculator/StepWrapper.vue";
import ButtonGroup from "@/components/organisms/Calculator/ButtonGroup.vue";
import SelectItinerary from "@/components/organisms/Calculator/Forms/SelectItinerary.vue";
import SelectLayover from "@/components/organisms/Calculator/Forms/SelectLayover.vue";
import SelectRoute from "@/components/organisms/Calculator/Forms/SelectRoute.vue";
import SelectFlightDate from "@/components/organisms/Calculator/Forms/SelectFlightDate.vue";
import SelectDisruptionType from "@/components/organisms/Calculator/Forms/SelectDisruptionType.vue";
import SelectDisruptionDetails from "@/components/organisms/Calculator/Forms/SelectDisruptionDetails.vue";
import SelectDisruptionReason from "@/components/organisms/Calculator/Forms/SelectDisruptionReason.vue";
import FlightDetails from "@/components/organisms/Calculator/Forms/FlightDetails.vue";
import FlightList from "@/components/organisms/Calculator/FlightList.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import FlightCard from "@/components/cells/FlightCard.vue";
import ClaimCard from "@/components/cells/ClaimCard.vue";
import AddDisruptionComment from "@/components/organisms/Calculator/Forms/AddDisruptionComment.vue";

import claimMachine from "@/machines/claim";
import type { ClaimsForm, Airport, Flight } from "~/types";
import AddBookingNumber from "./Forms/AddBookingNumber.vue";
import PassengerForm from "./Forms/PassengerForm.vue";
import StepPassengers from "./StepPassengers.vue";
import AssignmentAgreementPreflight from "./AssignmentAgreementPreflight.vue";
const claimState = useClaim();
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();
const { state, send, transition, subscribe, invoke } = useMachine<ClaimsForm>(
  claimMachine,
  claimState
);
const { getFilteredFlights } = useFlights()
const subscription = subscribe((e) => {
  window.scrollTo({ top: Math.min(window.scrollY, 200) });
  setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }));
});
// off('next', subscription)
const filteredFlights = computed(() => {
  if (!claimState.route) return [];
  const { departure, arrival } = claimState.airport;

  const filtered = getFilteredFlights({
    departure: departure?.iata,
    arrival: arrival?.iata,
    date: claimState.date!,
  });

  return filtered;
});

const city = useCities({ arrival: claimState.airport.trip.arrival?.iata});
const loadingFlights = ref(false);
// watch(
//   () => claimState.date || claimState.airport,
//   () => {
//     const { departure, arrival } = claimState.airport;
//     if (!claimState.date || !departure || !arrival) return;
//     loadingFlights.value = true;
//     console.log('fetching ... ')
//     fetchFlights({
//       departure: departure?.iata,
//       arrival: arrival?.iata,
//       date: claimState.date,
//       locale: locale.value,
//     }).finally(() => (loadingFlights.value = false));
//     // .catch(() => (error.value = true))
//   },
//   { immediate: true, deep: true }
// );
// watch(
//   () => claimState.replacement,
//   () => {
//     const { departure, number, date } = claimState.replacement;
//     if (!departure || !date || !number) return;
//     loadingFlights.value = true;
//     fetchFlights({
//       departure: departure?.iata,
//       arrival: claimState?.airport.trip.arrival?.iata,
//       number,
//       date,
//       locale: locale.value,
//     }).finally(() => (loadingFlights.value = false));
//     // .catch(() => (error.value = true))
//   },
//   { deep: true }
// );

onBeforeMount(() => {
  // if (!route.query.resume) invoke("reset");
  if (state.value.matches("itinerary")) send("next");
});
</script>
