import IBAN from "iban";
import { ExitStatus } from "typescript";
import type { Machine } from "~/composables/machine";
import type { ClaimsForm } from "~/types";
import { nextDeparture } from "~/utils";

// import { createMachine } from 'xstate'

// const machine = createMachine({

// })

export default {
  initial: "itinerary",
  loading: "loading",
  guards: {
    hasItinerary: ({ context }) => {
      return !!context.airport.trip.departure?.iata && !!context.airport.trip.arrival?.iata
    },
    hasDisruptionReason: ({ context }) => {
      return !!context.disruption.reason
    },
    hasStopover: ({ context }) => {
      return !!context.airport.trip.layover?.some(e => e.iata)
    },
    hasEUAirport: ({ context }) => {
      console.log([context.airport.departure, context.airport.arrival]?.map(e => ([e.iata, e.ec261])))
      return [context.airport.departure, context.airport.arrival]?.some(e => e.ec261)
    },
    isDelayed: ({ context }) => {
      return (context.flight?.arrival.delay || 0) > 0
    },
    isCancelled: ({ context }) => {
      return context.flight?.status === "cancelled"
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
    connectionRelevant: ({ context }) => {
      const { delay } = context.flight?.arrival || { delay: 0 }
      const departure = nextDeparture(context)

      // @todo: make action
      if (departure) {
        context.connection.departure = departure
      }
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
    }
  },
  actions: {
    setHistory: ({ history, target }) => {
      history.value = target ? [target] : []
      return history.value
    },
    go: ({ state, machine, target }) => {
      state.value = target || machine.initial
    },
    back: ({ history, state, machine }) => {
      try {
        const current = history.value?.pop();
        state.value = current || machine.initial
      } catch (error) {
        state.value = machine.initial
      }
    },
    exit: ({ history, state, machine }) => {
      history.value = []
      state.value = machine.initial
      navigateTo('/')
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
            target: "stopover",
            guard: "hasItinerary"
          }
        ],
      },
    },
    stopover: {
      on: {
        next: [
          {
            target: "chooseRoute",
            guard: "hasStopover",
          },
          {
            target: "flightDate",
            guard: "hasEUAirport"
          },
          {
            target: "ineligable",
          },
        ],
      },
    },
    chooseRoute: {
      on: {
        next: [{
          target: "flightDate",
          guard: "hasEUAirport"
        },
        {
          target: "ineligable",
        },],
      },
    },
    flightDate: {
      on: {
        next: {
          target: "flight",
        },
      },
    },
    flight: {
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
            target: "noDisruptionDetected",
          },
        ],
      },
    },
    disruptionDetected: {
      on: {
        continue: [
          {
            target: "otherFlightYN",
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
    noDisruptionDetected: {
      on: {
        next: {
          target: "disruptionType",
        },
      },
    },
    disruptionType: {
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
      on: {
        next: [{
          target: "disruptionReason",
          guard: ["replacementRelevant", "isCancelledType"],
        }, {
          target: "ineligable",
        }],
      },
    },
    delayDetails: {
      on: {
        next: [
          {
            target: "otherFlightYN",
            guard: ["connectionRelevant", "isDelayedType"],
          },
          {
            target: "ineligable",
            guard: ["tooLittleDelay", "isDelayedType"],
          },
          {
            target: "disruptionReason",
          }
        ],
      },
    },
    disruptionReason: {
      on: {
        next: [
          {
            target: "ineligable",
            guard: "isSelfInflicted",
          },
          {
            target: "otherFlightYN",
            guard: ["connectionRelevant", "isDelayedType"],
          },
          {
            target: "ineligable",
            guard: ["tooLittleDelay", "isDelayedType"],
          },
          {
            target: "otherFlightYN",
            guard: ["replacementRelevant", "isCancelledType"],
          },
          {
            target: "eligable",
            guard: "hasDisruptionReason"
          },
        ],
      },
    },
    otherFlightYN: {
      on: {
        yes: [{
          target: "replacementFlightDetails",
          guard: ["replacementRelevant", "isCancelledType"],
        }, {
          target: "connectionFlightDetails",
          guard: ["connectionRelevant", "isDelayedType"],
        }],
        no: {
          target: "eligable",
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
    eligable: {
      on: {
        next: {
          target: "bookingNumber",
        },
      },
    },
    ineligable: {
      on: {
        next: {
          target: "exit",
          actions: "reset",
        },
        restart: {
          target: "itinerary",
          actions: "reset",
        },
      },
    },
    connectionFlight: {
      on: {
        next: {
          target: "eligable",
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
    exit: {
      type: "final",
    },
    replacementFlightDetails: {
      on: {
        next: {
          target: "replacementFlight",
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
    replacementFlight: {
      on: {
        next: [{
          target: "ineligable",
          guard: "isReplacementWithinTimeFrame",
        }, {
          target: "eligable",
        }],
      },
    },
    assignmentAgreement: {
      on: {
        next: {
          target: "finish",
        },
      },
    },
    finish: {
      type: "final",
    },
  }
} as Machine<ClaimsForm>;
