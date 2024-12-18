import IBAN from "iban";
import type { Machine } from "~/composables/useMachine";
import { defaultClaim } from "~/store";
import type { Airport, ClaimState, ClaimsForm } from "~/types";
import { nextLeg } from "~/utils";

// import { createMachine } from 'xstate'

// const machine = createMachine({

// })
export default {
  id: "claimSubmission",
  persist: true,
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
      // console.log([context.airport.departure, context.airport.arrival])
      messages.value.hasEUAirport = "Please provide at least one EU airport"
      return [context.airport.departure, context.airport.arrival]?.some(e => e?.ec261)
    },
    isDelayed: ({ context }) => {
      if (context.flight?.status === 'active') return false
      const { delay } = context.flight?.arrival || { delay: 0 }
      const delayed = delay > 0
      if (delayed) {
        context.disruption.type = 'delayed'
        context.disruption.details = delay < 180 ? '<3' : delay > 240 ? '>4' : '3-4'
      }
      return delayed
    },
    isCancelled: ({ context }) => {
      if (context.flight?.status === 'active') return false
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
      // console.log('is connection relevant?')

      const delay = context.disruption.type === 'delayed' && context.disruption.details === '<3' ? 60 : context.flight?.arrival.delay || 0
      const { departure, arrival } = nextLeg(context)

      // console.log(departure, arrival)
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
      const delay = context.disruption.type === 'delayed' && context.disruption.details === '<3' ? 60 : context.flight?.arrival.delay || 0

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
        const validBoardingPass = !!Object.values(passenger.boardingPass || {})?.length;
        return complete && validEmail && validIBAN && validBoardingPass;
      })
    },
    agreedToTerms: ({ context }) => {
      return context.client.passengers.every(passenger => passenger.signature)
    }
  },
  actions: {
    setHistory: ({ states, target }) => {
      states.value = target ? [target] : []
      console.log('setting history ...', states.value)
      return states.value
    },
    go: ({ states, machine, target }) => {
      console.log('go ...', target || machine.initial)
      states.value.push(target || machine.initial)
    },
    back: ({ states, machine, transition }) => {
      console.log('go back ...')
      try {
        transition.value = 'back'
        states.value = states.value.slice(0, -1)
      } catch (error) {
        states.value = [machine.initial]
      }
    },
    reset: ({ states, machine, context }) => {
      console.log('resetting ... ')
      console.log(context, defaultClaim)
      // context.airport = defaultClaim.airport
      Object.assign(context, JSON.parse(JSON.stringify(defaultClaim)))
      states.value = [machine.initial]
    },
    submitClaim: ({ context }) => {
      console.log('submitting claim ...', context)
    },
    setDelayed: ({ context }) => {
      context.disruption.type = 'delayed'
    },
    setCancelled: ({ context }) => {
      context.disruption.type = 'cancelled'
    },
    setHasConnectionFlight: ({ context }) => {
      context.disruption.connectingFlight = true
    },
    removeNoConnectionFlight: ({ context }) => {
      context.disruption.connectingFlight = false
      context.connection.flight = null
    },
    setHasReplacementFlight: ({ context }) => {
      context.disruption.replacementFlight = true
      
    },
    removeReplacementFlight: ({ context }) => {
      context.replacement.flight = null
      context.disruption.replacementFlight = false
    }
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
            guardType: "and"
          },
          {
            guard: "hasItinerary",
            target: "disruptionDetected",
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
            guardType: "and"
          },
          {
            target: "eligibility",
            guard: ["tooLittleDelay", "isDelayedType"],
            guardType: "and"
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
          actions: 'setHasReplacementFlight'
        },
        no: {
          target: "eligibility",
          actions: "removeReplacementFlight"
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
          actions: 'setHasConnectionFlight'
        },
        no: {
          target: "eligibility",
          actions: 'removeNoConnectionFlight'
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
          guard: "agreedToTerms",
          target: "success",
          actions: "submitClaim",
        },
      },
    },
    success: {
      init: {
        guard: "agreedToTerms",
        guardType: "not",
        actions: "reset",
      },
      on: {
        next: {},
      },
    },
  }
} as Machine<ClaimState, ClaimsForm>;
