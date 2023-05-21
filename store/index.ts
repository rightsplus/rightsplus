import { reactive, onMounted } from 'vue'
import { Flight, ClaimsForm, Review, Airport, Route, Airline } from '@/types'


interface State {
  headerColor?: string | null,
  flights: Flight[],
  // airports: Record<string, Airport>,
  reviews: {
    url?: string,
    entries?: Review[],
  },
  claims: ClaimsForm,
  routes: Record<string, Route>,
  log: (message: string) => void,
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
    flight: null,
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
      cancelled: undefined,
      other: undefined
    },
    step: 0,
  } as ClaimsForm,
  routes: {} as Record<string, Route>,
  flights: [] as Flight[],
  reviews: {
    url: '',
    entries: [],
  },
  headerColor: null,
  log: (message: string) => console.log(message),
} as State)


watch(state, () => {
  process.client && localStorage.setItem('claims', JSON.stringify(state.claims))
})

watch(() => state.claims.airport, () => {
  state.routes = generateRoutes(state.claims);
}, { deep: true, immediate: true });


export const airports = ref({} as Record<string, Airport>);

export const airlines = ref({} as Record<string, Airline>);


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: State;
  }
}