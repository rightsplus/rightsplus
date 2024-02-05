import { reactive, onMounted } from 'vue'
import { Flight, ClaimsForm, Review, Airport, Route, Airline } from '@/types'
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
  flight_date: '',
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
    replacement: null,
    connectingFlight: null,
  },
} as ClaimsForm
export const claim = reactive({
  value: defaultClaim,
  reset: () => claim.value = defaultClaim,
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

// watch(() => claim.value.airport.trip, (value) => {
//   if (value) state.routes = generateRoutes?.(value);
//   console.log('trip', value)
//   console.log('state.routes',state.routes)
// }, { deep: true });
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