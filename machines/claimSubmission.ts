import IBAN from "iban";
import type { Machine } from "~/composables/machine";
import type { ClaimState, ClaimsForm } from "~/types";
import { nextLeg } from "~/utils";

// import { createMachine } from 'xstate'

// const machine = createMachine({

// })
export default {
  id: "claimSubmission",
  initial: "itinerary",
  loading: "loading",
  guards: {
    hasItinerary: ({ context, messages }) => {
      messages.value.hasItinerary = "Please provide a valid itinerary"

      const { departure, arrival } = context.airport.trip
      return !!departure?.iata && !!arrival?.iata && departure?.iata !== arrival?.iata
    },
    hasDisruptionReason: ({ context, messages }) => {
      messages.value.hasDisruptionReason = "Please provide a reason"

      return !!context.disruption.reason
    },
    hasDisruptionComment: ({ context }) => {
      return !!context.disruption.comment
    },
    hasStopover: ({ context }) => {
      return !!context.airport.trip.layover?.some(e => e.iata)
    },
    hasDate: ({ context, messages }) => {
      messages.value.hasDate = "Please provide a date"

      return !!context.date
    },
    hasFlight: ({ context }) => {
      return !!context.flight
    },
    hasEUAirport: ({ context, messages }) => {
      messages.value.hasEUAirport = "Please provide at least one EU airport"
      return [context.airport.departure, context.airport.arrival]?.some(e => e?.ec261)
    },
    isDelayed: ({ context }) => {
      const { delay } = context.flight?.arrival || { delay: 0 }
      const delayed = delay > 0
      if (delayed) {
        context.disruption.type = 'delayed'
        context.disruption.details = delay < 180 ? '<3' : delay > 240 ? '>4' : '3-4'
      }
      return delayed
    },
    isCancelled: ({ context }) => {
      const cancelled = context.flight?.status === "cancelled"
      if (cancelled) context.disruption.type = 'cancelled'
      return cancelled
    },
    isDelayedType: ({ context }) => {
      return context.disruption.type === 'delayed'
    },
    isCancelledType: ({ context }) => {
      return context.disruption.type === 'cancelled'
    },
    isSelfInflicted: ({ context }) => {
      return context.disruption.type === "noBoarding" && context.disruption.selfInflicted
    },
    isReplacementWithinTimeFrame: ({ context }) => {
      return isReplacementFlightWithinBounds(context)
    },
    isEligible: ({ context }) => {
      const { eligible } = useCompensation()
      return !!eligible
    },
    connectionRelevant: ({ context }) => {
      const { delay } = context.flight?.arrival || { delay: 0 }
      const { departure, arrival } = nextLeg(context)

      console.log(departure, arrival)
      if (!departure || !arrival) return false
      // @todo: make action
      context.connection.departure = departure
      context.connection.arrival = arrival
      if (context.flight?.arrival.scheduledTime) {
        context.connection.date = new Date(context.flight?.arrival.scheduledTime).toISOString().split('T')[0]
      }

      return delay > 0 && delay < 180 && departure
    },
    tooLittleDelay: ({ context }) => {
      const { delay } = context.flight?.arrival || { delay: 0 }
      return delay < 180
    },
    replacementRelevant: ({ context }) => {
      context.replacement.departure = context.airport.departure
      if (context.flight?.arrival.scheduledTime) {
        context.replacement.date = new Date(context.flight?.arrival.scheduledTime).toISOString().split('T')[0]
      }
      return context.disruption.details !== '>14';
    },
    passengersComplete: ({ context }) => {
      return context.client.passengers.every(passenger => {
        const complete = Object.values(passenger).every(Boolean);
        const validEmail = validateEmail(passenger.email)
        const validIBAN = IBAN.isValid(passenger.iban)
        return complete && validEmail && validIBAN
      })
    },
    agreedToTerms: ({ context }) => {
      console.log(context.client.passengers.map(passenger => passenger.signature))
      return context.client.passengers.every(passenger => passenger.signature)
    }
  },
  actions: {
    setHistory: ({ states, target }) => {
      states.value = target ? [target] : []
      return states.value
    },
    go: ({ states, machine, target }) => {
      states.value.push(target || machine.initial)
    },
    back: ({ states, machine }) => {
      try {
        states.value?.pop();
      } catch (error) {
        states.value = [machine.initial]
      }
    },
    reset: ({ states, machine }) => {
      states.value = [machine.initial]
    },
    setDelayed: ({ context }) => {
      context.disruption.type = 'delayed'
    },
    setCancelled: ({ context }) => {
      context.disruption.type = 'cancelled'
      console.log(context.disruption.type)
    },
  },
  states: {
    loading: {
      on: {
        done: {
          actions: 'back'
        }
      }
    },
    itinerary: {
      on: {
        next: [
          {
            target: "chooseLeg",
            guard: ["hasItinerary", "hasStopover"],
            guardType: "and"
          },
          {
            target: "flightDate",
            guard: ["hasItinerary", "hasEUAirport"],
          },
          {
            guard: "hasItinerary",
            target: "eligibility",
          },
        ],
      },
    },
    chooseLeg: {
      init: {
        guard: 'hasStopover',
        guardType: 'not',
        actions: 'back'
      },
      on: {
        next: [{
          target: "flightDate",
          guard: "hasEUAirport"
        },
        {
          target: "eligibility",
        },],
      },
    },
    flightDate: {
      init: {
        guard: 'hasItinerary',
        guardType: 'not',
        actions: 'back'
      },
      on: {
        next: {
          target: "flight",
          guard: "hasDate"
        },
      },
    },
    flight: {
      init: {
        guard: 'hasDate',
        guardType: 'not',
        actions: 'back'
      },
      on: {
        next: [
          {
            target: "disruptionDetected",
            guard: "isDelayed",
          },
          {
            target: "disruptionDetected",
            guard: "isCancelled",
          },
          {
            target: "disruptionType",
          },
        ],
      },
    },
    disruptionDetected: {
      init: {
        guard: 'hasFlight',
        guardType: 'not',
        actions: 'back'
      },
      on: {
        continue: [
          {
            target: "connectionFlightYN",
            guard: ["connectionRelevant", "isDelayed"],
            actions: "setDelayed"
          },
          {
            target: "disruptionReason",
            guard: "isDelayed",
            actions: "setDelayed"
          },
          {
            target: "cancellationDetails",
            guard: "isCancelled",
            actions: "setCancelled"
          },
          {
            target: "disruptionType",
          },
        ],
        next: {
          target: "disruptionType",
        },
      },
    },
    disruptionType: {
      init: {
        guard: 'hasFlight',
        guardType: 'not',
        actions: 'back'
      },
      on: {
        next: [
          {
            target: "delayDetails",
            guard: "isDelayedType",
          },
          {
            target: "cancellationDetails",
            guard: "isCancelledType",
          },
          {
            target: "disruptionReason",
          },
        ],
      },
    },
    cancellationDetails: {
      init: {
        guard: 'hasFlight',
        guardType: 'not',
        actions: 'back'
      },
      on: {
        next: [{
          target: "disruptionReason",
          guard: ["replacementRelevant", "isCancelledType"],
        }, {
          target: "eligibility",
        }],
      },
    },
    delayDetails: {
      init: {
        guard: 'hasFlight',
        guardType: 'not',
        actions: 'back'
      },
      on: {
        next: [
          {
            target: "connectionFlightYN",
            guard: ["connectionRelevant", "isDelayedType"],
          },
          {
            target: "eligibility",
            guard: ["tooLittleDelay", "isDelayedType"],
          },
          {
            target: "disruptionReason",
          }
        ],
      },
    },
    disruptionReason: {
      init: {
        guard: 'hasFlight',
        guardType: 'not',
        actions: 'back'
      },
      on: {
        next: [
          {
            target: "eligibility",
            guard: ["hasDisruptionReason", "hasDisruptionComment", "isSelfInflicted"],
          },
          {
            target: "connectionFlightYN",
            guard: ["hasDisruptionReason", "hasDisruptionComment", "connectionRelevant", "isDelayedType"],
          },
          {
            target: "eligibility",
            guard: ["hasDisruptionReason", "hasDisruptionComment", "tooLittleDelay", "isDelayedType"],
          },
          {
            target: "replacementFlightYN",
            guard: ["hasDisruptionReason", "hasDisruptionComment", "replacementRelevant", "isCancelledType"],
          },
          {
            target: "eligibility",
            guard: ["hasDisruptionReason", "hasDisruptionComment"]
          },
        ],
      },
    },
    replacementFlightYN: {
      on: {
        yes: {
          target: "replacementFlightDetails",
        },
        no: {
          target: "eligibility",
        },
      },
    },
    replacementFlightDetails: {
      on: {
        next: {
          target: "replacementFlight",
        },
      },
    },
    replacementFlight: {
      on: {
        next: [{
          target: "eligibility",
          guard: "isReplacementWithinTimeFrame",
        }, {
          target: "eligibility",
        }],
      },
    },
    connectionFlightYN: {
      on: {
        yes: {
          target: "connectionFlightDetails",
        },
        no: {
          target: "eligibility",
        },
      },
    },
    connectionFlightDetails: {
      on: {
        next: {
          target: "connectionFlight",
        },
      },
    },
    eligibility: {
      on: {
        next: [
          {
            target: "bookingNumber",
            // guard: "isEligible"
          },
        ],
        reset: [
          {
            target: "itinerary",
            actions: "reset",
          }
        ],
      },
    },
    connectionFlight: {
      on: {
        next: {
          target: "eligibility",
        },
      },
    },
    bookingNumber: {
      on: {
        next: {
          target: "passengers",
        },
      },
    },
    passengers: {
      on: {
        next: {
          target: "assignmentAgreement",
          guard: "passengersComplete"
        },
      },
    },
    assignmentAgreement: {
      on: {
        next: {
          target: "summary",
          guard: "agreedToTerms"
        },
      },
    },
    summary: {
      on: {
        next: {
          target: "summary",
        },
      },
    },
  }
} as Machine<ClaimState, ClaimsForm>;
