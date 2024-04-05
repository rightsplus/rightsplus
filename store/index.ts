import { reactive, onMounted } from 'vue'
import type { Flight, ClaimsForm, Review, Airport, Route, Airline } from '@/types'
import nuxtStorage from 'nuxt-storage';


export interface State {
  headerColor?: string | null;
  flights: Flight[];
  // airports: Record<string, Airport>,
  reviews: {
    url?: string;
    entries?: Review[];
  };
  routes: Record<string, Route>;
  log: (message: string) => void;
}
export interface AdminState {
  claims: any[];
  clients: any[];
}


export const defaultClaim = {
  airport: {
    departure: {} as Airport,
    arrival: {} as Airport,
    trip: {
      departure: {} as Airport,
      arrival: {} as Airport,
      layover: [{}] as Airport[],
    },
  },
  route: null,
  flight: null,
  connectingFlight: null,
  date: '',
  client: {
    passengers: [{
      firstName: '',
      lastName: '',
      email: '',
      address: {
        street: '',
        postalCode: '',
        city: '',
      },
      iban: '',
    }],
    agreedToTerms: false,
  },
  disruption: {
    type: null,
    details: null,
    reason: null,
    other: null,
  },
  replacement: {
    departure: {} as Airport,
    date: '',
    number: '',
    flight: null,
  },
  connection: {
    departure: {} as Airport,
    date: '',
    number: '',
    flight: null,
  },
} as ClaimsForm

export const claim = reactive(defaultClaim)
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

export const admin = reactive({
  claims: [],
  clients: [],
} as AdminState)

// watch(() => claim.value.airport.trip, (value) => {
//   if (value) state.routes = generateRoutes?.(value);
//   console.log('trip', value)
//   console.log('state.routes',state.routes)
// }, { deep: true });
watch(claim, (value) => {
  if (!process.client || !value) return
  nuxtStorage.localStorage.setData('rights-plus-claims', value, 30);
}, { deep: true });
watch(() => { }, () => {
  if (process.client) {
    const value = nuxtStorage.localStorage.getData('rights-plus-claims')
    if (value) Object.assign(claim, value)
  }
}, { immediate: true });

export const airports = ref({} as Record<string, Airport>);

export const airlines = ref({} as Record<string, Airline>);


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: State;
  }
}