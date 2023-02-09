import { reactive } from 'vue'
import { Flight, ReimbursementForm } from '@/types'

const reimbursement = process.client && localStorage.getItem('reimbursement') && JSON.parse(localStorage.getItem('reimbursement') as string) || {
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
} as ReimbursementForm

export const state = reactive({
  reimbursement,
  flights: [] as Flight[],
  headerColor: null,
  log: (message: string) => console.log(message),
})

watch(state, () => {
  process.client && localStorage.setItem('reimbursement', JSON.stringify(state.reimbursement))
})

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: {
      headerColor: string,
      flights: typeof state.flights,
      reimbursement: ReimbursementForm | null,
      log: (message: string) => void,
    };
  }
}