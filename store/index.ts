import { reactive } from 'vue'
import { Airport, Flight } from '@/types'
import TrieSearch from 'trie-search'

export const state = reactive({
  airports: [] as TrieSearch<Airport>,
  flights: [] as Flight[],
  headerColor: null,
})


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: {
      headerColor: string,
      airports: typeof state.airports,
      flights: typeof state.flights,
    };
  }
}