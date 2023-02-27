import { reactive } from 'vue'
import { Flight, ClaimsForm, Review } from '@/types'

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
  step: 0,
} as ClaimsForm

export const state = reactive({
  claims,
  flights: [],
  reviews: {
    url: '',
    entries: [],
  },
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
      flights: Flight[],
      reviews: {
        url: string,
        entries: Review[],
      },
      claims: ClaimsForm | null,
      log: typeof state.log,
    };
  }
}