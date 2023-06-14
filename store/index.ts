import { reactive, onMounted } from 'vue'
import { Flight, ClaimsForm, Review, Airport, Route, Airline } from '@/types'
import nuxtStorage from 'nuxt-storage';


interface State {
  headerColor?: string | null,
  flights: Flight[],
  // airports: Record<string, Airport>,
  reviews: {
    url?: string,
    entries?: Review[],
  },
  routes: Record<string, Route>,
  log: (message: string) => void,
}

const defaultClaim = {
  airport: {
    departure: {},
    arrival: {},
    layover: [{}],
  },
  flight: null,
  route: null,
  flight_date: '',
  client: {
    email: '',
    firstName: '',
    lastName: '',
    iban: '',
    passengerCount: 1,
    agreedToTerms: false,
  },
  disruption: {
    type: null,
    details: null,
    reason: null,
    other: null
  },
  step: 0,
} as ClaimsForm
export const claim = reactive({
  value: defaultClaim
})
export const state = reactive({
  routes: {} as Record<string, Route>,
  flights: [] as Flight[],
  reviews: {
    url: '',
    entries: [],
  },
  headerColor: null,
  log: (message: string) => console.log(message),
} as State)

watch(() => claim.value, (value) => {
  if (value) state.routes = generateRoutes?.(value);
}, { deep: true, immediate: true });
watch(() => claim.value, (value) => {
  if (!process.client || !value) return
  nuxtStorage.localStorage.setData('rights-plus-claims', value, 30);
}, { deep: true});
watch(() => {}, () => {
  if (process.client) {
    const value = nuxtStorage.localStorage.getData('rights-plus-claims')
    if (value) claim.value = value
  }
}, { immediate: true });

export const airports = ref({} as Record<string, Airport>);

export const airlines = ref({} as Record<string, Airline>);


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: State;
  }
}