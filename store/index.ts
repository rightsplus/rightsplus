import { reactive } from 'vue'
import { Flight, ClaimsForm, Review, Airport, Route } from '@/types'

const claims = process.client && localStorage.getItem('claims') && JSON.parse(localStorage.getItem('claims') as string) || {
  airport: {
    departure: null,
    arrival: null,
    layover: null,
  },
  date: {
    departure: new Date().toISOString().slice(0, 10),
  },
  routes: {},
  client: {
    email: '',
    firstName: '',
    agreedToTerms: false,
  },
  reason: null,
  actualArrivalTime: "2019-12-12T12:00",
  step: 0,
} as ClaimsForm

export const state = reactive({
  claims,
  airports: computed(() => reduceAirports(claims)),
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


const airport = computed(() => {
  return state.claims.airport;
});

watch(airport, () => {
  state.claims.routes = generateRoutes(state.claims);
}, { deep: true });
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: {
      headerColor?: string,
      flights: Flight[],
      airports: Record<string, Airport>,
      reviews: {
        url: string,
        entries: Review[],
      },
      claims: ClaimsForm,
      log: typeof state.log,
    };
  }
}