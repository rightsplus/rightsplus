import { reactive } from 'vue'
import { Flight, ClaimsForm } from '@/types'

const claims = process.client && localStorage.getItem('claims') && JSON.parse(localStorage.getItem('claims') as string) || {
  airport: {
    departure: null,
    arrival: null,
    layover: null,
  },
  date: {
    departure: "2019-12-12",
  },
  selectedFlight: null,
  reason: null,
  actualArrivalTime: "2019-12-12T12:00",
} as ClaimsForm

export const state = reactive({
  claims,
  flights: [] as Flight[],
  headerColor: null,
  log: (message: string) => console.log(message),
})

watch(state, () => {
  process.client && localStorage.setItem('claims', JSON.stringify(state.claims))
})

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: {
      headerColor: string,
      flights: typeof state.flights,
      claims: ClaimsForm | null,
      log: (message: string) => void,
    };
  }
}