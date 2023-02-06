import { reactive } from 'vue'
import { Airport, Flight, ReimbursementForm } from '@/types'
import TrieSearch from 'trie-search'

export const state = reactive({
  airports: [] as TrieSearch<Airport>,
  flights: [] as Flight[],
  reimbursement: null,
  headerColor: null,
  log: (message: string) => console.log(message),
})


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: {
      headerColor: string,
      airports: typeof state.airports,
      flights: typeof state.flights,
      reimbursement: ReimbursementForm | null,
      log: (message: string) => void,
    };
  }
}