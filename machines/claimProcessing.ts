import IBAN from "iban";
import type { Machine } from "~/composables/machine";
import type { ClaimsForm, RowClaimExtended } from "~/types";
import { nextLeg } from "~/utils";

// import { createMachine } from 'xstate'

// const machine = createMachine({

// })
export default {
  initial: "dataReceived",
  loading: "loading",
  guards: {
    hasItinerary: ({ context, messages }) => {
      messages.value.hasItinerary = "Please provide a valid itinerary"

      const { departure, arrival } = context.airport.trip
      return !!departure?.iata && !!arrival?.iata && departure?.iata !== arrival?.iata
    },
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
    reset: ({ history, state, machine }) => {
      history.value = []
      state.value = machine.initial
    },
  },
  states: {
    dataReceived: {
      on: {
        accept: {
          target: "awaitInitialAirlineResponse",
          actions: "acceptCase",
        },
        reject: {
          target: "rejected",
          actions: "rejectCase",
        },
      },
    },
    awaitInitialAirlineResponse: {
      on: {
        accept: {
          target: "awaitAirlinePayment",
          actions: "acceptCase",
        },
        reject: [
          {
            target: "awaitInitialAirlineResponse",
            actions: "negotiate",
            guard: "insistToNegotiate"
          },
          {
            target: "airlineRejected"
          }
        ]
      }
    },
    airlineRejected: {
      on: {
        engageLawyer: {
          target: "awaitLawyerResponse",
        },
      }
    },
    awaitLawyerResponse: {
      on: {
        accept: {
          target: "awaitAirlinePayment",
          actions: ["sendAirlineAcceptPaymentAfterLawyer"],
        },
        reject: {
          target: "airlineRejectedAfterLawyer",
          actions: "rejectCase",
        },
      },
    },
    airlineRejectedAfterLawyer: {
      on: {
        withdraw: {
          target: "caseWithdrawn",
        },
        fileLawsuit: {
          target: "awaitCourtDecision",
        }
      }
    },
    awaitCourtDecision: {
      on: {
        win: {
          target: "awaitAirlinePayment",
          actions: "sendAirlineAcceptPaymentAfterCourt",
        },
        lose: {
          target: "caseLost",
        }
      }
    },
    awaitAirlinePayment: {
      on: {
        receivePayment: {
          target: "paymentReceived",
        },
      },
    },
    receivePayment: {
      on: {
        payout: {
          target: "completed",
        }
      }
    },
    rejected: {
      type: 'final'
    },
    caseWithdrawn: {
      type: "final"
    },
    caseLost: {
      type: "final"
    },
    completed: {
      type: "final"
    }
  }
} as Machine<RowClaimExtended>;
