import { reactive, onMounted } from 'vue'
import { Flight, ClaimsForm, Review, Airport, Route } from '@/types'


interface State {
  headerColor?: string,
  flights: Flight[],
  airports: Record<string, Airport>,
  reviews: {
    url: string,
    entries: Review[],
  },
  claims: ClaimsForm,
  routes: Record<string, Route>,
  log: typeof state.log,
}

const storedClaims = process.client && localStorage.getItem('claims') && JSON.parse(localStorage.getItem('claims') as string) as ClaimsForm


export const state = reactive({
  claims: storedClaims || {
    airport: {
      departure: {
        full: ""
      },
      arrival: {
        full: ""
      },
      layover: [{}],
    },
    route: null,
    date: {
      departure: new Date().toISOString().slice(0, 10),
    },
    client: {
      email: '',
      firstName: '',
      agreedToTerms: false,
    },
    disruption: null,
    reason: null,
    reasonDetails: {
      noBoarding: undefined,
      delayed: undefined,
      cancelled: undefined
    },
    step: 0,
  } as ClaimsForm,
  routes: {},
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

watch(() => state.claims.airport, () => {
  state.routes = generateRoutes(state.claims);
}, { deep: true, immediate: true });


export const airports = computed(() => reduceAirports(state.claims));


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: State;
  }
}